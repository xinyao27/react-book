# 事件监听

## 前言

浏览器原生的 `addEventListener` 允许我们进行事件监听，React 同样提供了一套事件监听的机制：使用 `on*` 属性。

例如监听按钮的 click 事件：
```js
function handleClick() {
  console.log('Click');
}

<button onClick={handleClick}>btn</button>
```

注意：若不经处理，`on*` 事件监听只能用在 HTML 的标签上，不能用在组件标签上。

## 与原生浏览器事件相比

### 相同

React 事件与原生浏览器事件拥有同样的接口，同样支持事件的冒泡机制：使用 `stopPropagation()` 和 `preventDefault()` 来中断。

举个栗子：
```js
function handleClick(e) {
  console.log(e.target.innerHTML);
}

<button onClick={handleClick}>btn</button>
```
这样每次点击按钮，就会打印按钮的 `innerHTML`。

### 不同

与原生浏览器事件不同的是，在 JSX 内使用驼峰式写法(例如 onClick)，HTML 事件使用全小写(例如 onclick)。并且 HTML 通过写 JavaScript 代码字符串直接写入了 HTML 属性内，React 则更像是事件委派的机制。

## this

this 一直是一个令 JavaScript 初学者头疼的东西，如果你对 this 一点不了解的话推荐你看一下 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 对 this 的讲解。简单讲，this 就是指向方法的调用者。

使用 `class component` 并且绑定事件时，不可避免的要手动实现 this 的绑定。

列举几种绑定 this 的方式：

- *bind*。`bind` 方法返回一个函数，函数的 this 指向 bind 的第一个参数。缺点是每次调用 onClick 事件时都会生成一个新的函数。
```js
class Demo extends React.Component {
  handleClick() {
    console.log('hello');
  }
  
  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>btn</button>
    )
  }
}
```

- *构造器内声明*。在构造器内绑定 this，这样的好处是仅绑定一次，不存在无用的重复绑定，推荐使用这种方式。
```js
class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('hello');
  }

  render() {
    return (
      <button onClick={this.handleClick}>btn</button>
    )
  }
}
```

- *箭头函数*。箭头函数没有 this，所以需要继承定义箭头函数所在的作用域的 this。
```js
class Demo extends React.Component {
  // 我更倾向于构造器内声明，这种写法严格讲应该是类的实例属性而不是方法
  handleClick = () => {
    console.log('hello');
  }

  render() {
    return (
      <button onClick={this.handleClick}>btn</button>
    )
  }
}
// 或者
class Demo extends React.Component {
  handleClick() {
    console.log('hello');
  }

  render() {
    return (
      // 不推荐 每次调用 onClick 事件时都会生成一个新的函数
      <button onClick={() => this.handleClick()}>btn</button>
    )
  }
}
```

## 实战

我们利用事件实现可交互的天气查询。

### 加入当前地点

接口内已经有了当前查询的地点，我们取出渲染即可：
```js
class App extends React.Component {
  state = {
    city: null,
    realTimeData: [],
    weatherDetailsData: [],
    indexesData: [],
  }

  componentDidMount() {
    fetch('/app/weather/listWeather?cityIds=101240101')
      .then(res => res.json())
      .then((res) => {
        if (res.code === '200' && res.value.length) {
          const { city, realtime, weatherDetailsInfo, indexes } = res.value[0];
          const { weather3HoursDetailsInfos } = weatherDetailsInfo;
          this.setState({
            city,
            realTimeData: realtime,
            weatherDetailsData: weather3HoursDetailsInfos,
            indexesData: indexes,
          });
        }
      });
  }

  render() {
    const { city, realTimeData, weatherDetailsData, indexesData } = this.state;
    return (
      <div className="app">
        <div className="city">{city}</div>
        <RealTime data={realTimeData}/>
        <WeatherDetails data={weatherDetailsData} />
        <Indexes data={indexesData}/>
      </div>
    );
  }
}
```