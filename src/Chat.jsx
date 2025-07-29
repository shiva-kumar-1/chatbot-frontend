import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FiSend } from 'react-icons/fi';

function Chat({ token, logout }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/get-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const withTimestamps = res.data.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp || new Date().toISOString()
        }));
        setMessages(withTimestamps);
      } catch (err) {
        setError('Failed to load chat history.');
      }
    }
    fetchHistory();
  }, [token]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    setLoading(true);
    setError('');

    const userMsg = {
      role: 'user',
      content: inputMessage,
      id: `user-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat/send-message`,
        { message: inputMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMsg = {
        role: 'bot',
        content: res.data.reply,
        id: `bot-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar logout={logout} />

      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600 opacity-20 blur-3xl rounded-full animate-spin-slow" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500 opacity-20 blur-2xl rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 opacity-10 blur-2xl rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
      </div>

      {/* Scrollable Chat */}
      <div className="fixed top-[64px] bottom-[80px] left-0 right-0 z-10 overflow-y-auto 
                      scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent 
                      hover:scrollbar-thumb-white/50 scrollbar-thumb-rounded-full">
        <div ref={chatRef} className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-4">No messages yet. Start the conversation!</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`relative group w-fit max-w-[80%] px-4 py-2 my-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'ml-auto bg-indigo-600 text-white'
                  : 'mr-auto bg-white/20 text-white'
              }`}
            >
              <div>{msg.content}</div>

              <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                <span>{formatTime(msg.timestamp)}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleCopy(msg.content)} title="Copy">📋</button>
                  {msg.role === 'bot' && (
                    <button onClick={() => speak(msg.content)} title="Speak">🔊</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-indigo-300 mt-2 ml-2 animate-pulse">Thinking...</div>
          )}
        </div>
      </div>

      {/* Sticky Input */}
      <form
  onSubmit={handleSubmit}
  className="fixed bottom-0 left-0 w-full bg-black/70 border-t border-white/10 px-4 py-4 z-50"
  autoComplete="off"
>
  <div className="max-w-4xl mx-auto flex items-center space-x-2">
    {/* Dummy input to prevent autofill */}
    <input
      type="text"
      name="dummy"
      autoComplete="username"
      style={{ display: 'none' }}
    />
    
    <input
      type="search"
      name="chatInput"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      inputMode="text"
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      placeholder="Type your message..."
      className="flex-1 px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      disabled={loading}
    />
    <button
      type="submit"
      disabled={loading}
      className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
    >
      <FiSend size={18} />
    </button>
  </div>
</form>

      {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
    </div>
  );
}

export default Chat;
