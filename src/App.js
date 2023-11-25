// src/App.js
import React from 'react';
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


const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
        <Router>
          <AuthCheck>
            {(authState) =>
            (
              <>
                <Navigation authState={authState} />

                <Routes>
                  <Route path="/" element={<Dashboard authState={authState} />} />
                  <Route path="/login" element={<Login authState={authState} />} />
                  <Route path="/login/recovery" element={<Recovery authState={authState} />} />
                  <Route path="/login/recovery/:recoveryToken" element={<RecoveryToken authState={authState} />} />
                  <Route path="/login/activation/:activationToken" element={<ActivationToken authState={authState} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>

                <Bottom />
              </>
            )}
          </AuthCheck>
        </Router>
    </I18nextProvider>
  );
};



export default App;
