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

const App = () => (
  <div className="app">
    <RealTime />
    <WeatherDetails />
    <Indexes />
  </div>
);

export default App;
