import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from 'react-grid-system';
import './styles/output.css';

function App () {
  const [weatherData, setWeather] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState('city');
  const [isError, setError] = useState(false);
  const [cityList, setCityList] = useState(null);

  async function fetchWeather() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city_name: city })
    };

    await fetch('/get_weather', requestOptions)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
        console.log(data);
        setIsLoaded(true);
      })
      .catch(error => {
        setError(error);
        console.log(error); 
      });
  }

  async function fetchCities() {
    await fetch('/get_cities')
      .then(response => response.json())
      .then(data => {
        setCityList(data);
        console.log(data);
      })
      .catch(error => {
        console.log(error); 
      });
  }

  useEffect( () => {
    fetchCities();
  }, []);


  const handleChange = (event) => {
    setCity(event.target.value.toLowerCase());
  }


  const handleSubmit = (event) => {
    fetchWeather(); 
    event.preventDefault();
  }


  if (!isLoaded) {
    console.log('Waiting');
    return (
      <Container className={'main-container'}>
        <Row align={'center'} justify={'center'} className={'row-1'}>
          <form onSubmit={handleSubmit}>
            <label htmlFor='city_input'>Enter city: </label>
            <input id='city_input' type='input'  name='city' onChange={handleChange} size="50"/>
            <input type="submit" value="Submit" />
          </form>
        </Row>
      </Container>
    )
  } 
  else if(isError) {
    return (
      <div>Error</div>
    )
  }
  else {
    return (
      <Container className={'main-container'}>
        <Row align={'center'} justify={'center'} className={'row-1'}>
          <form onSubmit={handleSubmit}>
            <label htmlFor='city_input'>Enter city: </label>
            <input id='city_input' type='input'  name='city' onChange={handleChange} size="50"/>
            <input type="submit" value="Submit" />
          </form>
        </Row>

        {weatherData && (
          <Row align={'center'} justify={'center'} className={'row-2'}>
              <Container className={'weather-result'}>
                <h3>{weatherData.name.toUpperCase()}</h3>
                <p>Temperature: {weatherData.main.temp} degC</p>
                <p>Feels like: {weatherData.main.feels_like} degC</p>
                <p>Humidity: {weatherData.main.humidity} %</p>
                <div className='weather-icon-container'>
                  <img className={'weather-icon'} src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}></img>
                </div>
                <p>{weatherData.weather[0].main +': '+ weatherData.weather[0].description} </p>
              </Container>
          </Row>
        )}
      </Container>
    );
  }
};

export default App;