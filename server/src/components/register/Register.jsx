import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveUserToDB = (user, extraName, extraPhoto) => {
    const newUser = {
      name: extraName || user.displayName,
      email: user.email,
      photoURL: extraPhoto || user.photoURL,
    };
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch(() => {});
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    createUser(email, password)
      .then((result) => {
        saveUserToDB(result.user, name, photoURL);
        navigate('/');
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          setError('Email already in use. Try logging in.');
        } else {
          setError('Registration failed. Try again.');
        }
        setLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    setError('');
    signInWithGoogle()
      .then((result) => {
        saveUserToDB(result.user);
        navigate('/');
      })
      .catch(() => setError('Google sign-in failed. Try again.'));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
          Register Now!
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Login Now
          </Link>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="your@email.com"
            />
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Image URL (optional)</label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Min. 6 characters"
            />
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition mb-4"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* OR */}
        <div className="text-center text-sm text-gray-400 mb-4">OR</div>

        {/* Google button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.1-6.1C34.46 3.09 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 5.52C12.4 13.67 17.73 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.67 7.16l7.18 5.57C43.44 37.27 46.52 31.33 46.52 24.5z"/>
            <path fill="#FBBC05" d="M10.74 28.26A14.6 14.6 0 0 1 9.5 24c0-1.48.26-2.91.74-4.26l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.56 10.76l8.18-6.5z"/>
            <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.18-5.57C28.6 38.1 26.42 39 24 39c-6.27 0-11.6-4.17-13.26-9.74l-8.18 6.5C6.07 43.52 14.45 47 24 47z"/>
          </svg>
          Sign Up With Google
        </button>

      </div>
    </div>
  );
};

export default Register;
