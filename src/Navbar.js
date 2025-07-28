import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ logout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full z-20 fixed top-0 bg-white/10 backdrop-blur border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-sm text-white font-semibold">
        
        {/* 🧠 Zeno Branding + Links */}
        <div className="flex items-center space-x-8">
          <span className="text-lg text-indigo-400 font-bold tracking-wide">Zeno</span>

          <Link
            to="/chat"
            className={`hover:text-indigo-400 transition ${
              isActive('/chat') ? 'text-indigo-400 underline' : ''
            }`}
          >
            Chat
          </Link>
          <Link
            to="/history"
            className={`hover:text-indigo-400 transition ${
              isActive('/history') ? 'text-indigo-400 underline' : ''
            }`}
          >
            History
          </Link>
          <Link
            to="/profile"
            className={`hover:text-indigo-400 transition ${
              isActive('/profile') ? 'text-indigo-400 underline' : ''
            }`}
          >
            Profile
          </Link>
        </div>

        {/* 🔴 Logout Button */}
        <button
          onClick={logout}
          className="text-red-300 hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
