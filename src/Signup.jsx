import React, { useState } from 'react';
import axios from 'axios';

function Signup({ setShowLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => {
        setShowLogin(true);
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          'Registration failed. Email may already be in use.'
      );
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

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/10 border border-white/20 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-white tracking-tight">
          Create Your <span className="text-indigo-400">Zeno</span> Account
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">Powered by Google AI</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
            placeholder="Password (min 6 chars)"
            value={password}
            required
            minLength={6}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Sign Up
          </button>

          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
          )}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setShowLogin(true)}
            className="text-sm text-indigo-300 hover:underline transition"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
