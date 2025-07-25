import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Add token to headers if it exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = token;
  }
  return config;
});

export default instance;
