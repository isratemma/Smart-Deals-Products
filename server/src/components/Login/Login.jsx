import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const newUser = {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
          .then((res) => res.json())
          .then(() => navigate('/'))
          .catch(() => navigate('/'));
      })
      .catch((error) => {
        console.error('Google sign-in error:', error.message);
      });
  };

  return (
    <div>
      <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-xl w-full max-w-md mx-auto mt-30">
        <h2 className="text-2xl font-bold text-center mb-4  ">
          Login
        </h2>

        {/* Email */}
        <label className="label">Email</label>
        <input
          type="email"
          className="input input-bordered w-full mb-3"
          placeholder="Enter your email"
        />

        {/* Password */}
        <label className="label">Password</label>
        <input
          type="password"
          className="input input-bordered w-full mb-4"
          placeholder="Enter your password"
        />

        {/* Login button */}
        <button className="btn btn-neutral w-full mb-3  bg-purple-600 hover:bg-purple-700 text-white font-semibold  rounded-lg ">
          Login
        </button>

        {/* OR divider */}
        <div className="text-center text-sm text-gray-500 mb-3">OR</div>

        {/* Google sign in — now wired up */}
        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">
          Sign in with Google
        </button>

        {/* Register link */}
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium">
            Register here.
          </Link>
        </p>
      </fieldset>
    </div>
  );
};

export default Login;
