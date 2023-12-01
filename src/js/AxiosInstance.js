import axios from 'axios';
import i18n from './i18n';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.defaults.timeout = 5000;

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    // Add the token to the headers if available
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const currentLanguage = i18n.language;
    config.headers['Accept-Language'] = currentLanguage;

    return config;
  },
  (error) => {
    // Do something with the request error
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => {
    // Do something with the response data
    return response;
  },
  (error) => {
    // Do something with the response error
    return Promise.reject(error);
  }
);

export default AxiosInstance;
