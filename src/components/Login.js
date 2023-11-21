import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
import axiosInt from '../js/AxiosInstance';
import { useConfig } from '../config';
import toastr from 'toastr';
import AuthCheck from '../js/AuthCheck';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { baseUrl } = useConfig();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveAuthTokens = (token, refreshToken, expires) => {
    // Save tokens to localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expirationDate', expires);
  };

  const handleLogin = async () => {
    if (validateForm()) {
      let addressIp = null;

      try {
        const res = await axios.get('https://api.ipify.org/?format=json');
        addressIp = res.data.ip;
      } catch (error) {
        console.log('Unable to fetch IP');
      }

      try {
        const response = await axiosInt.post(
          `${baseUrl}/auth/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              'X-Forwarded-For': addressIp,
            },
          }
        );

        const {token, refreshToken, expires} = response.data;
        saveAuthTokens(token, refreshToken, expires);

        // Redirect to the dashboard
        navigate('/dashboard');

      } catch (error) {
        toastr.error("Nie udało się zalogować");
      }
    }
  };

  return (
    <AuthCheck>
      {(authState) => {
        // Check if the user is authenticated
        if (authState.isAuthenticated) {
          navigate('/dashboard')
        }

        // Render the login form if not authenticated
        return (
          <div>
            <h2>Login</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div>
                <label>
                  Email:
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>
                <div style={{ color: 'red' }}>{errors.email}</div>
              </div>
              <div>
                <label>
                  Hasło:
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </label>
                <div style={{ color: 'red' }}>{errors.password}</div>
              </div>
              <div>
                <button type="submit">Zaloguj się</button>
              </div>
            </form>
          </div>
        );
      }}
    </AuthCheck>
  );
};

export default Login;
