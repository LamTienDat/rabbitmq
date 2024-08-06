const http = require('k6/http');
const { check, sleep } = require('k6');
const {
  randomItem,
  randomIntBetween,
} = require('https://jslib.k6.io/k6-utils/1.0.0/index.js');

import {
  randomItem,
  randomIntBetween,
} from 'https://jslib.k6.io/k6-utils/1.0.0/index.js';

export let options = {
  vus: 1000, // Số lượng user ảo
  duration: '1m', // Thời gian chạy test
};

const BASE_URL = 'http://localhost:3000';
const USER_CREDENTIALS = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
  { email: 'user3@example.com', password: 'password3' },
  { email: 'user4@example.com', password: 'password4' },
  { email: 'user5@example.com', password: 'password5' },
  { email: 'user6@example.com', password: 'password6' },
  { email: 'user7@example.com', password: 'password7' },
  { email: 'user8@example.com', password: 'password8' },
  { email: 'user9@example.com', password: 'password9' },
  { email: 'user10@example.com', password: 'password10' },
];

const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
const STATES = ['NY', 'CA', 'IL', 'TX', 'AZ'];
const COUNTRIES = ['USA', 'Canada', 'Mexico'];
const WEATHER_CONDITIONS = ['Clear', 'Rain', 'Snow', 'Cloudy', 'Windy'];

function getRandomWeatherData() {
  return {
    city: randomItem(CITIES),
    state: randomItem(STATES),
    country: randomItem(COUNTRIES),
    timestamp: new Date().toISOString(),
    temperature: randomIntBetween(-10, 40), // Nhiệt độ từ -10 đến 40 độ C
    humidity: randomIntBetween(0, 100), // Độ ẩm từ 0 đến 100%
    windSpeed: randomIntBetween(0, 100), // Tốc độ gió từ 0 đến 100 km/h
    weatherCondition: randomItem(WEATHER_CONDITIONS),
    pressure: randomIntBetween(950, 1050), // Áp suất từ 950 đến 1050 hPa
    isDaytime: Math.random() > 0.5, // Ban ngày hoặc ban đêm ngẫu nhiên
    precipitation: Math.random() > 0.5 ? randomIntBetween(0, 50) : 0, // Lượng mưa từ 0 đến 50 mm hoặc 0
  };
}

export default function () {
  const user = randomItem(USER_CREDENTIALS);

  // Đăng nhập
  const loginRes = http.post(
    `${BASE_URL}/v1/send-data`,
    JSON.stringify({
      email: user.email,
      password: user.password,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  const authToken = loginRes.json('access_token');

  // Tạo dữ liệu thời tiết ngẫu nhiên
  const weatherData = getRandomWeatherData();

  // Gửi dữ liệu thời tiết sử dụng token
  const params = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    `${BASE_URL}/your-weather-endpoint`,
    JSON.stringify(weatherData),
    params,
  );
  check(res, { 'status was 200': (r) => r.status == 200 });

  sleep(randomIntBetween(1, 5));
}
