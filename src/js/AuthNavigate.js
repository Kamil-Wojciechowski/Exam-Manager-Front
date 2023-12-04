import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthNavigate = (isAuthenticated, protectedRoute, teacher, teacherRoute) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (!protectedRoute) {
        navigate('/');
      }

      if(teacherRoute && !teacher) {
        navigate("/");
      } 

      
    } else {
      if (protectedRoute) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, protectedRoute, navigate]);
};

export default useAuthNavigate;
