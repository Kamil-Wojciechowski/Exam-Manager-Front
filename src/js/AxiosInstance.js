import axios from 'axios';

// Create an Axios instance with default properties
const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    // Other default headers if needed
  },
});

// Set default timeout (optional)
AxiosInstance.defaults.timeout = 5000; // 5 seconds

// You can also intercept requests or responses globally if needed
AxiosInstance.interceptors.request.use(
  (config) => {
    // config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'; // Replace with your React app's URL
    // config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE';
    // config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    // config.headers['Access-Control-Allow-Credentials'] = 'true';

    const token = localStorage.getItem('accessToken');

    // Add the token to the headers if available
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

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
