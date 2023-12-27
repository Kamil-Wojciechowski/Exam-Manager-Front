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
import { PacmanLoader } from 'react-spinners';
import StudiesDetailsUser from './components/StudiesDetailsUser';
import Database from './components/Database';
import DatabaseId from './components/DatabaseId';
import GoogleConnect from './components/GoogleConnect';
import GoogleDisconnect from './components/GoogleDisconnect';
import GoogleCallback from './components/GoogleCallback';
import DatabaseQuestion from './components/DatabaseQuestion';
import DatabaseQuestionAnswer from './components/DatabaseQuestionAnswer';
import StudiesExams from './components/StudiesExams';
import ExamParticipate from './components/ExamParticipate';
import ExamResults from './components/ExamResults';
import Users from './components/Users';


const App = () => {

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AuthCheck>
          {(authState) => {
            if (authState.isAuthenticated === null) {
              return <div className='center-main'><PacmanLoader className='centered-element' color="#36d7b7" /></div>;
            }

            if (authState.isAuthenticated != null) {
              return (
                <>
                  <Navigation authState={authState} />
                  <Routes>
                    <Route path="/" element={<Dashboard authState={authState} />} />
                    <Route path="/admin/database" element={<Database authState={authState} />} />
                    <Route path="/admin/database/:databaseId" element={<DatabaseId authState={authState} />} />
                    <Route path="/admin/database/:databaseId/questions" element={<DatabaseQuestion authState={authState} />} />
                    <Route path="/admin/database/:databaseId/questions/:questionId" element={<DatabaseQuestionAnswer authState={authState} />} />
                    <Route path="/admin/google/connect" element={<GoogleConnect authState={authState} />} />
                    <Route path="/admin/google/disonnect" element={<GoogleDisconnect authState={authState} />} />
                    <Route path="/admin/users" element={<Users authState={authState} />} />
                    <Route path="/callback" element={<GoogleCallback authState={authState} />} />
                    <Route path="/studies/:studiesId" element={<StudiesDetailsUser authState={authState} />} />
                    <Route path="/studies/:studiesId/exams" element={<StudiesExams authState={authState} />} />
                    <Route path="/studies/:studiesId/exams/:examId/participate" element={<ExamParticipate authState={authState} />} />
                    <Route path="/studies/:studiesId/exams/:examId" element={<ExamResults authState={authState} />} />
                    <Route path="/login" element={<Login authState={authState} />} />
                    <Route path="/login/recovery" element={<Recovery authState={authState} />} />
                    <Route path="/login/recovery/:recoveryToken" element={<RecoveryToken authState={authState} />} />
                    <Route path="/login/activation/:activationToken" element={<ActivationToken authState={authState} />} />
                    <Route path="*" element={<NotFound authState={authState} />} />
                  </Routes>
                </>
              )
            }
          }

          }
        </AuthCheck>
        <Bottom />
      </Router>
    </I18nextProvider>
  );
};

export default App;