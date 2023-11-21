// src/components/Dashboard.js
import React from 'react';

const Dashboard = ({ authState }) => {
  const { isAuthenticated, user } = authState;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h2>Welcome, {user.firstname}!</h2>
          {/* Add dashboard content here */}
        </>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
