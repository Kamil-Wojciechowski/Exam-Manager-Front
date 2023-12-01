import React, { useEffect, useState } from 'react';
import axios from '../js/AxiosInstance';

const AuthCheck = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    user: null,
    tokens: null,
  });

  const saveAuthTokens = (token, refreshToken, expires) => {
    // Save tokens to localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expirationDate', expires);
  };

  const userDataCheck = async (accessToken) => {
    try {
      const response = await axios.get(`/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const checkUserDetails = async (accessToken) => {
    try {
      const user = await userDataCheck(accessToken);

      setAuthState({
        isAuthenticated: true,
        user,
        tokens: {
          accessToken,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      try {
        await checkUserDetails(accessToken);
      } catch (error) {
        try {
          console.error('Error fetching user details:', error);
          const refreshOld = localStorage.getItem('refreshToken');

          localStorage.removeItem("accessToken");

          const response = await axios.post(`/auth/refresh/${refreshOld}`);
          const { token, refreshToken, expires } = response.data;
          saveAuthTokens(token, refreshToken, expires);

          await checkUserDetails(token);
        } catch (error) {
          console.log("Error fetching refresh token");

          if (error.response && error.response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setAuthState({
              isAuthenticated: false,
              user: null,
              tokens: null,
            });
          }
        }
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        tokens: null,
      });
    }
  };

  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line
  }, []);

  return <>{children(authState)}</>;
};

export default AuthCheck;
