# 组件的 state 和 setState

## 前言

前面两节实战中，我们已经完成了三个主要组件及其内部组件，但是我们展示的数据都是写死的内容，我们期望内容是实时更新的。

我们需要引入状态的概念，在 React 内组件可以通过维护 state 来维护组件内的状态，这意味着 state 只关心组件自己的内部状态，且这些状态只能在组件内改变。

## state

定义 state 的方式很简单：
```js
class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'frank',
    };
  }
}
```
现在有新[提案](https://github.com/tc39/proposal-class-fields)，对实例属性有了新的写法(需要 babel 转义)
```js
class Demo extends React.Component {
  state = {
    name: 'frank',
  };
}
```

我们希望 state 是可以更改的，因为我们需要使用变化的 state 去实现动态可交互的组件。

怎么修改 state 呢？直接赋值？`this.state.name = 'cxy'`。
no no no，永远不要直接修改 state，这样做 React 并不会做出你所期望的操作，还有可能带来一些意想不到的 bug。

正确的操作是使用 `setState` 修改 state。

## setState

`setState` 是一个异步方法，例如：
```js
// state = {count: 0}
console.log(this.state.count); // => 0
this.setState({
  count: this.state.count + 1,
});
console.log(this.state.count); // => 0
```
出现这种情况是因为 react 并不会马上修改 state，而是将这个对象放入队列，且一个生命周期(生命周期相关内容可看 组件生命周期 章节)内所有的 `setState` 方法都会合并操作。
因此你并不需要担心写多个 `setState` 带来性能问题。

回过头来看上述例子，`setState` 允许我们传入第二个参数作为更新完 state 之后的回调，在这里我们可以获取到更新后的 state：
```js
console.log(this.state.count) // => 0
this.setState({
  count: this.state.count + 1,
}, () => {
  console.log(this.state.count) // => 1
})
```

## setState 接受函数参数
```js
// state = {count: 0}
this.setState({
  count: this.state.count + 1,
});
this.setState({
  count: this.state.count + 2,
});
```
看上述例子，我们期望得到结果3，实际上得到了2。
原因是第二个 `setState` 内的 count 依赖于 `this.state.count`，由于 `setState` 异步执行，`this.state.count + 2` 里的 count 仍然是0。

为了解决这种情况，我们将 `setState` 第一个参数改为函数返回对象的形式：
```js
this.setState(prevState => ({
  count: prevState.count + 1,
}));
this.setState(prevState => ({
  count: prevState.count + 2,
}));
```
此时，`prevState` 即上一次 `setState` 的结果，这样我们就可以针对该结果进行操作，最后返回一个对象作为更新的 state。

## 总结

我们已经知道可以使用 `state` 配合 `setState` 维护组件内部状态，`setState` 可接受两个参数，且第一个参数可使用函数的形式 目的为获取上一次 `setState` 的结果。

使用 `setState` 可以使 React 变得充满想象力，然而在项目的复杂度不断提高的情况下，并不推荐滥用 `setState`，滥用 `setState` 将会是数据流变得混乱，程序维护成本增大。

## 实战

我们先改造 `RealTime` 组件。如下：
```js
class RealTime extends React.Component {
  constructor() {
    super();

    this.state = {
      temp: -5,
      weather: '晴',
      windType: '南风',
      windLevel: '3级',
      humidity: 48,
    };
  }

  render() {
    const {
      temp, weather, windType, windLevel, humidity,
    } = this.state;
    return (
      <div className="RealTime">
        <div className="temp">{temp}</div>
        <div className="weather">{weather}</div>
        <div className="wind">{`${windType} ${windLevel}`}</div>
        <div className="humidity">{`湿度 ${humidity}%`}</div>
      </div>
    );
  }
}
```

现在 `RealTime` 组件变成了这样：

![state.png](https://i.loli.net/2018/12/14/5c12841d68e64.png)

好了组件已经能展示 `state` 的内容了，下一步我们来改变 `state`。

首先我们希望能获取真实的数据，所以我们需要从真实的天气 api 取到数据并赋值给 `state`。

注：此处使用网上获取的魅族天气的 api，仅供学习使用，严禁用于商业途径。

然后我们在组件上写一个方法 `componentDidMount`(此方法会在组件加载完毕之后立即执行，适合发送 http 请求) ：
```js
componentDidMount() {
  // 如遇跨域问题 `create-react-app` 生成的项目可在 `package.json` 内新添
  // "proxy": "http://aider.meizu.com"
  fetch('/app/weather/listWeather?cityIds=101240101')
    .then(res => res.json())
    .then((res) => {
      if (res.code === '200' && res.value.length) {
        const { realtime } = res.value[0];
        const {
          temp, weather, wD: windType, wS: windLevel, sD: humidity,
        } = realtime;
        // 调用 setState 改变 state
        this.setState({
          temp,
          weather,
          windType,
          windLevel,
          humidity,
        });
      }
    });
}
```
好了 现在已经可以从天气 api 取得数据并渲染到组件内。