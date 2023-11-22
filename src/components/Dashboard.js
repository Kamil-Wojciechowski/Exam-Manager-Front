// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({authState}) => {
  const navigate = useNavigate();
  const {isAuthenticated} = authState;
  
  if(!isAuthenticated) {
    navigate("/login");
  }
  
  return (
    <div>
          <h2>Welcome</h2>
    </div>
  );
};

export default Dashboard;