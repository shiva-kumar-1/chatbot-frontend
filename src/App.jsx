import React, { useState } from 'react';
import Login from './Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <h1>Welcome! You are logged in.</h1>
    </div>
  );
}

export default App;
