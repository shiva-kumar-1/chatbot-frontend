import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken, setShowLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden px-4">
      
      {/* Glowing animated blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600 opacity-20 blur-3xl rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500 opacity-20 blur-2xl rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 opacity-10 blur-2xl rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/10 border border-white/20 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-white tracking-tight">
          Login to <span className="text-indigo-400">Zeno</span>
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">Powered by Google AI</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Login
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setShowLogin(false)}
            className="text-sm text-indigo-300 hover:underline transition"
          >
            Don&apos;t have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
