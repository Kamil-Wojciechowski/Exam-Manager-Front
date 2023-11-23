// AuthCheck.js
import React, { useEffect, useState } from 'react';
import axios from '../js/AxiosInstance';

const AuthCheck = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    tokens: null,
  });

  const checkUserDetails = async (accessToken, setAuthState) => {
    const user = await userDataCheck(accessToken);

    setAuthState({
      isAuthenticated: true,
      user,
      tokens: {
        accessToken,
      },
    });
  }

  const saveAuthTokens = (token, refreshToken, expires) => {
    // Save tokens to localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expirationDate', expires);
  };

  const userDataCheck = async (accessToken) => {
    const response = await axios.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      // Check for authentication tokens in storage
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          checkUserDetails(accessToken, setAuthState);
        } catch (error) {
          try {
            const refreshOld = localStorage.getItem('refreshToken');

            const response = await axios.post(
              `/auth/refresh/${refreshOld}`
            );

            const { token, refreshToken, expires } = response.data;
            saveAuthTokens(token, refreshToken, expires);

            checkUserDetails(userDataCheck, token, setAuthState);

          } catch (error) {

            console.error('Error fetching user details:', error);

            // If the request for user details results in a 401, it likely means the token has expired
            // Remove tokens from storage and redirect to the login page
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
        // No tokens in storage, set authentication state to false
        setAuthState({
          isAuthenticated: false,
          user: null,
          tokens: null,
        });

        // Redirect to the login page
      }
    };

    checkAuthentication();
    // eslint-disable-next-line
  }, []);

  return <>{children(authState)}</>;
};

export default AuthCheck;