import React from 'react';
import './style.css';
import Moment from 'moment';

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
        console.log(res)
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

export default App;
