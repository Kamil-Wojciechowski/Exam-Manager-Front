// src/components/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = ({ authState }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) {
      navigate('/login');
    }
  }, [authState, navigate]);

  return (
    <div>
      <p>{t('greeting')}, {authState.user ? authState.user.firstname : ""}</p>
    </div>
  );
};

export default Dashboard;
