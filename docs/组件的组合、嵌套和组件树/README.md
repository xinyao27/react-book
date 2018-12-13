# 组件的组合、嵌套和组件树

## 前言

上一节实战中，我们使用 `class component` 创建了一个表示天气信息的组件。
这一节我们将创建更多组件，并将所有组件组合。

## 封装组件

上一节的实例代码可以进行如下修改：
```js
import React from 'react';
import './style.css';

class RealTime extends React.Component {
  render() {
    return (
      <div className="RealTime">
        <div className="temp">-2°</div>
        <div className="weather">晴</div>
        <div className="wind">北风 2级</div>
        <div className="humidity">湿度 66%</div>
      </div>
    );
  }
}

const App = () => (
  <div>
    <RealTime />
  </div>
);

export default App;
```
我们将 `RealTime` 相关的内容抽离了出来单独封装了一个组件，这样的复用性更强。
需要注意的是，组件调用时如：`<RealTime></<RealTime>` 可简写为自闭合组件 `<RealTime />`。

## 编写更多组件

我们再来实现一个未来1天内温度分布表组件。
```js
class Details extends React.Component {
  render() {
    return (
      <div className="Details">
        <div className="time">01:00</div>
        <div className="weather">阴</div>
        <div className="temperature">-1°</div>
      </div>
    );
  }
}

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

![details.png](https://i.loli.net/2018/12/13/5c1270293efa2.png)

似乎还不错，但是仔细看 `WeatherDetails` 组件内重复写了好多个 `<Details />`，我们可以通过更加优雅的方式改造这里：
```js
class WeatherDetails extends React.Component {
  render() {
    // 首先我们写一个 getDataSource 函数模拟一个数据源
    const getDataSource = () => Array(7).fill({});
    return (
      <div className="WeatherDetails">
        {
          // map 我们生成的数组，返回组件
          getDataSource().map(() => <Details />)
        }
      </div>
    );
  }
}
```
这样写控制台会出现 warning ：`Each child in an array or iterator should have a unique "key" prop.`，
意思是每个子组件都要有一个独一无二的 `key` 属性(请不要使用 index 作为 key)，例如：
```js
getDataSource().map(() => <Details key={xxx}/>)
```
这里我就先忽略这个警告继续了。

在写一个展示各项生活指数的组件
```js
class Indexes extends React.Component {
  render() {
    const getDataSource = () => Array(6).fill({});
    const Index = () => (
      <div className="Index">
        <div className="level">适宜</div>
        <div className="name">洗车指数</div>
      </div>
    );
    return (
      <div className="Indexes">
        {
          getDataSource().map(() => <Index />)
        }
      </div>
    );
  }
}
```

## 总结

组件和组件可以结合在一起，组件的内部又可以使用其他组件，这样组合嵌套后，就构成了一个所谓的组件树。

之前的实战中 `App` 内使用了三个组件 `<RealTime />` `<WeatherDetails />` `<Indexes />`。

其中 `<WeatherDetails />` 又使用了组件 `<Details />`。`<Indexes />` 内部使用了函数式组件 `<Index />`。

我们希望设计组件时能保证组件的专一性即：*一个组件只专注做一件事*

一个复杂的功能如果可以拆分成等多个小功能，那就可以将每个小功能封装成一个组件，然后通过组件的嵌套/组合实现复杂功能。

当然也不是拆分的越细、颗粒度越小越好，能控制在一个可控的范围内即可。