// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navigation = ({ authState }) => {
  const { isAuthenticated } = authState;
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div>
      <nav>
        <ul>
          {isAuthenticated ? (
            <li><Link to="/">{t('dashboard')}</Link></li>
          ) : (
            <li><Link to="/login">{t('login')}</Link></li>
          )}
        </ul>
      </nav>
      <div>
        <button onClick={() => changeLanguage('pl')}>Polski</button>
        <button onClick={() => changeLanguage('en')}>English</button>
      </div>
    </div>
  );
};

export default Navigation;
