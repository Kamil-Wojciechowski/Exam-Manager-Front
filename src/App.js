// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthCheck from './js/AuthCheck';
import { ConfigProvider } from './config';
import 'toastr/build/toastr.min.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <AuthCheck>
                {(authState) => <Dashboard authState={authState} />}
              </AuthCheck>
            }
          />
          <Route path="/login" element={<Login />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </ConfigProvider>
  );
};



export default App;
