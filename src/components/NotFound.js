// NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';

const NotFound = ({authState}) => {
  const navigate = useNavigate();

  if(authState.isAuthenticated) {
    navigate("/")
  } else {
    navigate("/login");
  }


  return (
    <div className='center-main'><PacmanLoader className='centered-element' color="#36d7b7" /></div>
  );
};

export default NotFound;
