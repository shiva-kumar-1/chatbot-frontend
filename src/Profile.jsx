import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // ✅ Add Navbar

function Profile({ token, logout }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setMsg('');
      setError('');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setName(res.data.name || '');
        setEmail(res.data.email || '');
      } catch (err) {
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const isUnchanged = name === profile.name && email === profile.email;

  const handleSave = async (e) => {
    e.preventDefault();
    if (isUnchanged) return;
    setSaving(true);
    setMsg('');
    setError('');
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/user/edit-profile`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(prev => ({ ...prev, name, email }));
      setEditing(false);
      setMsg('Profile updated!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setError('');
    setMsg('');
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    setDeleting(true);
    setError('');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
    } catch (err) {
      setError('Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center text-white mt-10">Loading profile...</div>;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <Navbar logout={logout} />

      {/* Glowing background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600 opacity-20 blur-3xl rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500 opacity-20 blur-2xl rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 opacity-10 blur-2xl rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
      </div>

      {/* Profile Content */}
      <div className="relative z-10 max-w-xl w-full mx-auto pt-28 pb-10 px-4">
        <h2 className="text-2xl font-bold text-indigo-300 mb-6 text-center">User Profile</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Name :</label>
            {editing ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={saving || deleting}
                className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-white/90">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Email :</label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={saving || deleting}
                className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-white/90">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Registered On :</label>
            <p className="text-white/70">
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div className="flex justify-between flex-wrap gap-2">
            {editing ? (
              <>
                <button
                  type="submit"
                  disabled={saving || deleting || isUnchanged}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving || deleting}
                  className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  disabled={deleting}
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={saving || deleting}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>

          {msg && <p className="text-green-400 text-sm text-center">{msg}</p>}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
<br />
<br />

<div className="mt-6 text-center text-sm text-gray-400">
  For Improvements and Suggestions{" "}
<br />

  <a
    href="mailto:shivakumarsomineni666@gmail.com"
    className="underline hover:text-indigo-300"
  >
    shivakumarsomineni666@gmail.com
  </a>
</div>

        </form>
      </div>
    </div>
  );
}

export default Profile;
