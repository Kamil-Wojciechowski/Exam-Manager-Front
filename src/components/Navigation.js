// Navigation.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { slide as Menu } from 'react-burger-menu'

const Navigation = ({ authState }) => {
  const { isAuthenticated } = authState;
  const { t } = useTranslation();

  const containRole = authState.user.currentRoles.includes('ROLE_TEACHER');

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

              <ul>
                <li><Link onClick={handleLogout}>{t('logout')}</Link></li>
                <li><Link to="/">{t('dashboard')}</Link></li>
                {containRole &&

                  <li><Link to="/admin/database">{t('database')}</Link></li>

                }
                {(authState.isTeacher) &&
                  (authState.user.googleConnected ? (
                    <li><Link to="/admin/google/disonnect">Disconnect google account</Link></li>
                  ) : (
                    <li><Link to="/admin/google/connect">Connect google account</Link></li>
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
