import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Chat from './Chat';
import Profile from './Profile';
import ChatHistory from './ChatHistory';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <Routes>
        {!token && (
          <>
            <Route
              path="/"
              element={
                showLogin ? (
                  <Login setToken={setToken} setShowLogin={setShowLogin} />
                ) : (
                  <Signup setShowLogin={setShowLogin} />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {token && (
          <>
            <Route path="/" element={<Navigate to="/chat" />} />
            <Route path="/chat" element={<Chat token={token} logout={logout} />} />
            <Route path="/history" element={<ChatHistory token={token} />} />
            <Route path="/profile" element={<Profile token={token} logout={logout} />} />
            <Route path="*" element={<div className="text-center p-10">404 Not Found</div>} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
