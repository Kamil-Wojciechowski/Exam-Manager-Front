// NotFound.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const NotFound = ({ authState }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if(authState.isAuthenticated) {
      navigate("/")
    } else {
      navigate("/login");
    }
  }, [navigate]);
};

export default NotFound;
