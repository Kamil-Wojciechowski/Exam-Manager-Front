// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'toastr/build/toastr.min.css';

import AuthCheck from './js/AuthCheck';
import { ConfigProvider } from './js/config';

import Navigation from './components/Navigation';
import Login from './components/Login';
import Recovery from './components/Recovery';
import Dashboard from './components/Dashboard';

import NotFound from './components/NotFound';


const App = () => {
  return (
    <ConfigProvider>
      <Router>
        <AuthCheck>
          {(authState) =>
          (
            <>
              <Navigation authState={authState} />

              <Routes>
                <Route path="/" element={<Dashboard authState={authState} />}/>
                <Route path="/login" element={<Login authState={authState} />} />
                <Route path="/login/recovery" element={<Recovery authState={authState} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </>
          )}
        </AuthCheck>
      </Router>
    </ConfigProvider>
  );
};



export default App;
