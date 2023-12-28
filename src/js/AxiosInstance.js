import axios from 'axios';
import i18n from './i18n';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status >= 200 && status <= 302
  }
});

AxiosInstance.defaults.timeout = 10000;

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const currentLanguage = i18n.language;
    config.headers['Accept-Language'] = currentLanguage;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
