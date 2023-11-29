// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './js/i18n';

import 'toastr/build/toastr.min.css';

import AuthCheck from './js/AuthCheck';

import Navigation from './components/Navigation';
import Bottom from './components/Bottom';
import Login from './components/Login';
import Recovery from './components/Recovery';
import Dashboard from './components/Dashboard';
import RecoveryToken from './components/RecoveryToken';

import NotFound from './components/NotFound';
import ActivationToken from './components/ActivationToken';
import { PacmanLoader } from 'react-spinners';
import StudiesDetailsUser from './components/StudiesDetailsUser';


const App = () => {

  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    user: null,
    tokens: null,
  });

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AuthCheck>
          {(authState) => {

            setAuthState(authState);

            if (authState.isAuthenticated === null) {
              return <div className='center-main'><PacmanLoader className='centered-element' color="#36d7b7"/></div>;
            }

            if (authState.isAuthenticated != null) {
              if (authState.isAuthenticated) {
                return (
                  <>
                    <Navigation authState={authState} />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="*" element={<NotFound authState={authState} />} />
                      <Route path="/:studiesId" element={<StudiesDetailsUser userDetails={authState.user} />} />
                    </Routes>
                  </>
                )
              } else {
                return (<Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/login/recovery" element={<Recovery />} />
                  <Route path="/login/recovery/:recoveryToken" element={<RecoveryToken />} />
                  <Route path="/login/activation/:activationToken" element={<ActivationToken />} />
                  <Route path="*" element={<NotFound authState={authState} />} />
                </Routes>)
              }
            }

          }}
        </AuthCheck>
        <Bottom />
      </Router>
    </I18nextProvider>
  );
};

export default App;