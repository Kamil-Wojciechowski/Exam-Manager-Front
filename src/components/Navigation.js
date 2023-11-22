// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ authState }) => {
  const { isAuthenticated, user } = authState;


  return (
    <div>
      <nav>
        <ul>
          {isAuthenticated ? (
            <li><Link to="/">Dashboard</Link></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>
      <div>
        {isAuthenticated ? (
          <h2>
            Hi, {user.firstname}
          </h2>
        ) : (
          <></>
        )}
    </div>
    </div >
  );
};

export default Navigation;
