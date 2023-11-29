import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import axiosInt from '../js/AxiosInstance';
import toastr from 'toastr';

const Login = ({ authState }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/');
    }
  }, [authState, navigate]);

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
          `/auth/login`,
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

        const { token, refreshToken, expires } = response.data;
        saveAuthTokens(token, refreshToken, expires);

        // Redirect to the dashboard
        window.location.href = '/';

      } catch (error) {
        toastr.error("Nie udało się zalogować");
      }
    }
  };


  // Render the login form if not authenticated
  return (
    <div id="login">
      <div className="centered-element">
        <div id="login-border">
          <h2>{t('login')}</h2>
          <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <Form.Group>
              <Form.Label>
                Email:
                <Form.Control type='email' name='email' value={formData.email} onChange={handleChange} />
              </Form.Label>
              <div style={{ color: 'red' }}>{errors.email}</div>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                {t('password')}:
                <Form.Control type='password' name='password' value={formData.password} onChange={handleChange} />
              </Form.Label>
              <div style={{ color: 'red' }}>{errors.password}</div>
            </Form.Group>
            <div>
              <Button className="main_button" variant='primary' type="submit">Zaloguj się</Button>
            </div>
          </Form>
          <div>
            <a href='/login/recovery' >Zapomniałeś hasło?</a>
          </div>
        </div>
      </div>
    </div>
  );
}



export default Login;
