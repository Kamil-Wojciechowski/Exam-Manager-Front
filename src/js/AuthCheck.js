// AuthCheck.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useConfig } from '../config';
import axios from '../js/AxiosInstance';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const { baseUrl } = useConfig();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    tokens: null,
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      // Check for authentication tokens in storage
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          // Fetch user details from the backend
          const response = await axios.get(`${baseUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const user = response.data.data;

          // Set the authentication state
          setAuthState({
            isAuthenticated: true,
            user,
            tokens: {
              accessToken,
              refreshToken,
            },
          });
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
            navigate('/login');
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
        navigate('/login');
      }
    };

    checkAuthentication();
    // eslint-disable-next-line
  }, [navigate]);

  return <>{children(authState)}</>;
};

export default AuthCheck;
