# 渲染列表数据

## 前言

在 组件的组合、嵌套和组件树 章节内我们实现过一个组件 `WeatherDetails` ：
```js
class WeatherDetails extends React.Component {
  render() {
    return (
      <div className="WeatherDetails">
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
      </div>
    );
  }
}
```
可以看出这里我们连续写了8个 `Details` 组件才达到了一个列表的效果，这种写法肯定是不合适的，这一节我们了解一下怎么优化写法。

## 前置知识

我们说过 JSX 中，`{}` 内可放任何 JavaScript 表达式，当然放一个数组也是可以的。

```js
function Demo() {
  const components = [
    <li>list 1</li>,
    <li>list 2</li>,
    <li>list 3</li>,
  ];
  return (
    <ul>
      {components}
    </ul>
  );
}
```
我们在数组内插入了几个 JSX 元素，是可以正常渲染的：

![map.png](https://i.loli.net/2018/12/15/5c14f5caa8824.png)

但是控制台却出现了 warning ：
```
Warning: Each child in an array or iterator should have a unique "key" prop.
```
数组或迭代器内每个子元素都必须有 prop 属性："key"。

这是为什么呢？

简单点讲，React 内每次状态变更导致需要更新 Dom 元素时，React 只会去更新需要变更的 Dom 元素，对于没有变化的元素绝对不会动。

回到我们上述的例子，当我们需要将数组内 `list 1` 和 `list2` 元素调换位置时，React 会认为他们是分别改变了自己而不是仅仅调换位置，从而导致 React 将两个元素重新渲染，这样无疑加大了 Dom 操作成本。

怎么解决呢？我们给数组内的每一个元素加一个 prop: key，并且保证每个元素的 key 都是自己独有的（就像给每个元素一个身份证）这样 React 就可以根据 key 知道二者仅仅是调换了位置。

## 实战

为了提高效率降低成本，我们将在 App 组件内发起请求拿到数据，将数据进行简单封装后通过 props 传给各个组件。

首先我们改写 App 组件：
```js
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <RealTime />
        <WeatherDetails />
        <Indexes />
      </div>
    );
  }
}
```
发送请求，封装数据：
```js
class App extends React.Component {
  state = {
    realTimeData: null,
    weatherDetailsData: null,
    indexesData: null,
  }

  componentDidMount() {
    fetch('/app/weather/listWeather?cityIds=101240101')
      .then(res => res.json())
      .then((res) => {
        if (res.code === '200' && res.value.length) {
          const { weatherDetailsInfo } = res.value[0];
          const { weather3HoursDetailsInfos } = weatherDetailsInfo;
          this.setState({
            weatherDetailsData: weather3HoursDetailsInfos,
          });
        }
      });
  }

  render() {
    const { weatherDetailsData } = this.state;
    return (
      <div className="app">
        <RealTime />
        <WeatherDetails data={weatherDetailsData} />
        <Indexes />
      </div>
    );
  }
}
```
然后我们开始改写 WeatherDetails 及 Details 组件，使用传入的 props 渲染数据：
```js
import Moment from 'moment'; // 这里使用 moment 格式化时间 需要预先安装 `npm i moment --save`

class Details extends React.Component {
  render() {
    const { data } = this.props;
    const time = Moment(data.startTime).format('HH:mm');
    const weather = data.weather;
    const temperature = `${data.highestTemperature}°`;
    return (
      <div className="Details">
        <div className="time">{time}</div>
        <div className="weather">{weather}</div>
        <div className="temperature">{temperature}</div>
      </div>
    );
  }
}

class WeatherDetails extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div className="WeatherDetails">
        {
          // map 返回了一个内容为 JSX 的数组
          data && data.map(detail => <Details data={detail} key={detail.startTime}/>)
        }
      </div>
    );
  }
}
```
同样的，对于 Indexes 组件我们也用同样的方式处理，首先修改组件 App：
```js
class App extends React.Component {
  state = {
    realTimeData: null,
    weatherDetailsData: null,
    indexesData: null,
  }

  componentDidMount() {
    fetch('/app/weather/listWeather?cityIds=101240101')
      .then(res => res.json())
      .then((res) => {
        if (res.code === '200' && res.value.length) {
          const { weatherDetailsInfo, indexes } = res.value[0];
          const { weather3HoursDetailsInfos } = weatherDetailsInfo;
          this.setState({
            weatherDetailsData: weather3HoursDetailsInfos,
            indexesData: indexes,
          });
        }
      });
  }

  render() {
    const { weatherDetailsData, indexesData } = this.state;
    return (
      <div className="app">
        <RealTime />
        <WeatherDetails data={weatherDetailsData} />
        <Indexes data={indexesData}/>
      </div>
    );
  }
}
```
修改 Indexes 组件：
```js
class Indexes extends React.Component {
  render() {
    const { data } = this.props;
    const Index = ({ data }) => (
      <div className="Index">
        <div className="level">{data.level}</div>
        <div className="name">{data.name}</div>
      </div>
    );
    return (
      <div className="Indexes">
        {
          data && data.map(index => <Index data={index} key={index.abbreviation}/>)
        }
      </div>
    );
  }
}
```

之前写 RealTime 组件时，我们在组件内请求了一次数据，这与 App 内发送的请求重复了，我们重构一下：
```js
// App 组件
class App extends React.Component {
  state = {
    realTimeData: null,
    weatherDetailsData: null,
    indexesData: null,
  }

  componentDidMount() {
    fetch('/app/weather/listWeather?cityIds=101240101')
      .then(res => res.json())
      .then((res) => {
        if (res.code === '200' && res.value.length) {
          const { realtime, weatherDetailsInfo, indexes } = res.value[0];
          const { weather3HoursDetailsInfos } = weatherDetailsInfo;
          this.setState({
            realTimeData: realtime,
            weatherDetailsData: weather3HoursDetailsInfos,
            indexesData: indexes,
          });
        }
      });
  }

  render() {
    const { realTimeData, weatherDetailsData, indexesData } = this.state;
    return (
      <div className="app">
        <RealTime data={realTimeData}/>
        <WeatherDetails data={weatherDetailsData} />
        <Indexes data={indexesData}/>
      </div>
    );
  }
}

// RealTime 组件
class RealTime extends React.Component {
  render() {
    const {
      temp, weather, wD: windType, wS: windLevel, sD: humidity,
    } = this.props.data;
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

## 最后

至此，我们的实战已经可以正确渲染列表数据了。下一节，我们将让程序可以根据用户输入的地点查询天气。