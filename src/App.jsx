import React from 'react';
import './App.css';

import Home from './components/home/Home';
import Login from './components/login/login';
import Dashboard from './components/Dashboard/dashboard';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MyDocuments from './components/myDocuments/myDocuments';
import Settings from './components/settings/settings';
import { DocumentProvider } from './context/DocumentContext';
import { NotificationProvider } from './context/NotificationContext';
import Notification from './components/Notification';

function App() {
  return (
    <div>
      <NotificationProvider>
        <DocumentProvider>
          <Notification />
          <Router basename="/paperchime"> {/* ✅ FIX HERE */}
            <Routes>
              <Route path="/" element={<Login />} />

              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Home />} />
                <Route path="myDocuments" element={<MyDocuments />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </DocumentProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;