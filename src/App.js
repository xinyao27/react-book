import React from 'react';
import './style.css';
import Moment from 'moment';
import { cities } from './static/city.json';

class RealTime extends React.Component {
  render() {
    const {
      temp, weather, wD: windType, wS: windLevel, sD: humidity,
    } = this.props.data;
    return (
      <div className="RealTime">
        <div className="temp">{`${temp}°`}</div>
        <div className="weather">{weather}</div>
        <div className="wind">{`${windType} ${windLevel}`}</div>
        <div className="humidity">{`湿度 ${humidity}%`}</div>
      </div>
    );
  }
}

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

class City extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      input: '',
    }

    this.handleVisible = this.handleVisible.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleVisible() {
    this.setState({
      visible: true,
    });
  }

  handleChange(e) {
    this.setState({
      input: e.target.value,
    });
  }

  handleSearch() {
    const { input } = this.state;
    if (input) {
      const result = cities.find(item => item.city === input);
      if (result) {
        // 更新天气并关闭当前弹框
        this.props.onCityChange(result.cityid);
        this.setState({
          visible: false,
          input: '', // 关闭弹框后清空输入
        });
      } else {
        alert('没有查询到相应城市')
      }
    } else {
      alert('没有输入要查询的城市')
    }
  }

  render() {
    const city = this.props.data;
    const { visible, input } = this.state;
    return (
      <div className="city">
        <div onClick={this.handleVisible}>{city}</div>
        {
          visible && (
            <div className="dialog">
              <input
                type="text"
                placeholder="搜索市"
                value={input}
                onChange={this.handleChange}
              />
              <button onClick={this.handleSearch}>查询</button>
            </div>
          )
        }
      </div>
    )
  }
}

class App extends React.Component {
  state = {
    city: null,
    realTimeData: [],
    weatherDetailsData: [],
    indexesData: [],
  }

  // 将请求数据抽离，可复用
  getData(id) {
    fetch(`/app/weather/listWeather?cityIds=${id}`)
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

  componentDidMount() {
    // 默认请求北京的天气，当然可以拓展 例如利用定位获取当前位置，或者要求用户输入位置
    this.getData('101010100');
  }

  handleCityChange = cityid => {
    this.getData(cityid);
  }

  render() {
    const { city, realTimeData, weatherDetailsData, indexesData } = this.state;
    return (
      <div className="app">
        <City data={city} onCityChange={this.handleCityChange}/>
        <RealTime data={realTimeData}/>
        <WeatherDetails data={weatherDetailsData} />
        <Indexes data={indexesData}/>
      </div>
    );
  }
}

export default App;
