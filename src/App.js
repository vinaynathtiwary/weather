import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { cities, dailyData } from "./data";

// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

async function getWeatherData(coordinates) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${parseFloat(
        coordinates.lat,
        10
      )}&lon=${parseFloat(coordinates.lng, 10)}`,
      {
        method: "GET",
        hostname: "api.ambeedata.com",
        port: null,
        path: "/weather/latest/by-lat-lng?lat=12.9889055&lng=77.574044",
        headers: {
          "x-api-key": "16973dbfa9ffefa6efeaba257a70f1b5",
          "Content-type": "application/json",
        },
      }
    );

    const resJson = await response.json();

    return resJson.data;
  } catch (error) {
    console.log(error);
  }

  return {};
}

async function getLocation(coordinates) {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=pk.f5635c892768342f672864a120b2b51d&lat=${parseFloat(
        coordinates.lat,
        10
      )}&lon=${parseFloat(coordinates.lng, 10)}&format=json`
    );

    const resJson = await response.json();

    return resJson.address;
  } catch (error) {
    console.log(error);
  }

  return {};
}

async function getLocationImage(city) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=CmACeGwOAqdR1xYTUF7PGEmtIAkp4wyAt7XFWxHh2Ls`
    );

    const resJson = await response.json();

    return resJson.results[0].urls.raw;
  } catch (error) {
    console.log(error);
  }

  return {};
}

/**
 * {
          "time": 1602153684,
          "precipIntensity": 0.0072,
          "precipType": "rain",
          "precipProbability": 0.02,
          "uvIndex": 0,
          "temperature": 81.87,
          "apparentTemperature": 88.64,
          "summary": "Humid",
          "icon": "clear-day",
          "dewPoint": 75.35,
          "humidity": 81,
          "pressure": 1005.9,
          "windSpeed": 3.19,
          "windGust": 3.19,
          "windBearing": 72,
          "cloudCover": 0.83,
          "visibility": 10,
          "lat": "12",
          "lng": "77"
      }
 */

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [time, setTime] = useState(new Date().toLocaleString().split(",")[1]);
  const [coord, setCoord] = useState({ lat: null, lng: null });
  const [address, setAdd] = useState({});
  const [image, setImage] = useState("");
  const [wmage, setWmage] = useState("");

  setInterval(() => {
    setTime(new Date().toLocaleString().split(",")[1]);
  }, 1000);

  useEffect(() => {
    if (coord.lat && coord.lng) {
      (async () => {
        const data = await getWeatherData(coord);
        const location = await getLocation(coord);

        setAdd(location);
        setWeatherData(data);
      })();
    }
  }, [coord]);

  useEffect(() => {
    getCoordintes();
  }, []);

  useEffect(() => {
    if (address.state) {
      (async () => {
        const data = await getLocationImage(address.state);

        setImage(data);
      })();
    }
  }, [address?.state]);

  useEffect(() => {
    if (weatherData.icon) {
      (async () => {
        const data = await getLocationImage(weatherData.icon);

        setWmage(data);
      })();
    }
  }, [weatherData.icon]);

  function getCoordintes() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      var crd = pos.coords;
      var lat = crd.latitude.toString();
      var lng = crd.longitude.toString();
      var coordinates = { lat, lng };
      setCoord(coordinates);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  return (
    <div>
      <div className="weatherPanel">
        <div className="weatherItems">
          <div
            style={{
              backgroundImage: `url("https://img.freepik.com/free-vector/sun-shining-blue-sky-with-white-clouds-realistic-background_1284-10467.jpg?size=626&ext=jpg&ga=GA1.1.1456252214.1697306129&semt=ais")`,
            }}
            className="bg-img"
          ></div>
          <div className="weatherItemscontent">
            <input
              className="searchBar"
              type="text"
              placeholder="Search........"
            />
            <h1 className="heading">Weather Forecast</h1>
            <div className="cities">
              {image ? (
                <div className="city">
                  <img src={image} />

                  {address.city || address.state}
                </div>
              ) : (
                ""
              )}
              {cities.map((city) => (
                <div key={city.cityName} className="city">
                  <img src={city.cityImage} />
                  {city.cityName}
                </div>
              ))}
            </div>
            {/* {dailyData.map((dailyData) => (
              <div key={dailyData.dailyData} className="weatherTable">
                {dailyData.day}
                {dailyData.rain}
                {dailyData.windSpeed}
                {dailyData.temp}
                {dailyData.humidity}
              </div>
            ))} */}
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Rain</th>
                  <th>Wind Speed</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.Day}</td>
                    <td>{data.Rain}</td>
                    <td>{data.WindSpeed}</td>
                    <td>{data.Temp}</td>
                    <td>{data.Humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="upperRightPanel">
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="bg-img"
          ></div>
          <div className="rightpanelcontent">
            <div className="dateTime">
              <div>{new Date().toLocaleString().split(",")[0]}</div>
              <div>{time}</div>
            </div>

            <div>
              <div>
                <div className="weatherDetails">
                  <h2>Today</h2>
                  <h1>
                    {weatherData.temperature
                      ? parseInt((5 / 9) * (weatherData.temperature - 32), 10)
                      : 0}
                    <sup className="celcius">°C</sup>
                  </h1>
                  <h3>
                    {address.city || address.state_district}, {address.state}
                  </h3>
                </div>
                <div className="row">
                  <div className="col">Humidity: {weatherData.humidity}%</div>
                  <div className="col">
                    Wind Speed: {weatherData.windSpeed}km/h
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    Clouds: {weatherData.cloudCover * 100}%
                  </div>
                  <div className="col">
                    Visibility: {weatherData.visibility}km
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    Dew Point:{" "}
                    {parseInt((5 / 9) * (weatherData.dewPoint - 32), 10)}C
                  </div>
                  <div className="col">UV Index: {weatherData.uvIndex}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
