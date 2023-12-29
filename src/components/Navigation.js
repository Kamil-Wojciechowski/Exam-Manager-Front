// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { slide as Menu } from 'react-burger-menu'

const Navigation = ({ authState }) => {
  const { isAuthenticated } = authState;
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.clear();

    window.location.href = '/login';
  }

  return (
    <div>
      {isAuthenticated ? (
        <Menu className='test'>
          <label id="hamburger-menu">
            <nav id="sidebar_menu">
              <h3 className='sidebar_menu-title'>Menu</h3>
              <br/>
              <ul className="sidebar_menu-list">
                <li><Link className="sidebar_menu-item" onClick={handleLogout}>{t('logout')}</Link></li>
                <li><Link className="sidebar_menu-item" to="/">{t('dashboard')}</Link></li>
                {authState.isTeacher &&
                  <>
                    <li><Link className="sidebar_menu-item" to="/admin/database">{t('database')}</Link></li>
                    <li><Link className="sidebar_menu-item" to="/admin/users">{t('users')}</Link></li>
                  </>
                }
                {(authState.isTeacher) &&
                  (authState.user.googleConnected ? (
                    <li><Link className="sidebar_menu-item" to="/admin/google/disonnect">{t('disconnect_google')}</Link></li>
                  ) : (
                    <li><Link className="sidebar_menu-item" to="/admin/google/connect">{t('connect_google')}</Link></li>
                  ))}
              </ul>

            </nav>
          </label>
        </Menu>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navigation;
