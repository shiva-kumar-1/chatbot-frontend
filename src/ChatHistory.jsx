import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function ChatHistory({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/get-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      setError('Failed to load chat history.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chat/delete-message/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => prev.filter(msg => msg._id !== id));
    } catch (err) {
      alert('Failed to delete message.');
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Clear ALL chat history? This cannot be undone.')) return;
    setClearing(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chat/clear-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
    } catch (err) {
      setError('Failed to clear chat history.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Glowing Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600 opacity-20 blur-3xl rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500 opacity-20 blur-2xl rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 opacity-10 blur-2xl rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto pt-24 pb-12 px-4">
        <h2 className="text-2xl font-bold text-indigo-300 mb-6 text-center">Chat History</h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading chat history...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={clearHistory}
                disabled={clearing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm transition"
              >
                {clearing ? 'Clearing...' : 'Clear All'}
              </button>
            </div>

            {messages.length === 0 ? (
              <p className="text-center text-gray-400">No chat history available.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`group bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-md`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">
                        <span className="font-semibold text-indigo-400">
                          {msg.role === 'user' ? '👨‍💻 You' : '🤖 Bot'}:
                        </span>{' '}
                        {msg.content}
                      </div>
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="text-xs text-red-400 hover:text-red-500 transition"
                        title="Delete message"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ChatHistory;
