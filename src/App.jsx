import React from 'react';
import './App.css';

import Home from './components/home/Home';
import Login from './components/login/login';
import Dashboard from './components/Dashboard/dashboard';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MyDocuments from './components/myDocuments/myDocuments';
import Settings from './components/settings/settings';
import { DocumentProvider } from './context/DocumentContext';

function App() {
  return (
    <div>
      <DocumentProvider>
        <Router>
          <Routes>
            {/* Login Page */}
            <Route path="/" element={<Login />} />
            {/* Dashboard Layout */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="myDocuments" element={<MyDocuments />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </DocumentProvider>

      {/* WhatsApp Floating Button */}
      {/* <a
        href="https://wa.me/919121245032"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 100
        }}
      >
        <img
          src="https://www.diginweb.site/whatsapp.png"
          alt="Chat with us on WhatsApp"
          style={{ width: '60px', height: '60px' }}
        />
      </a> */}
    </div>
  );
}

export default App;