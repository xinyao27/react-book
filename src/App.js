import React from 'react';
import './style.css';

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
