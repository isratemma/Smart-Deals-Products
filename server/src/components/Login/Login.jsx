import React from 'react';

const Login = () => {
  return (
    <div>
      <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-xl w-full max-w-md mx-auto mt-30">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

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

        {/* Sign in button */}
        <button className="btn btn-neutral w-full mb-3 bg-primary
        text-white">Login</button>

        {/* OR divider */}
        <div className="text-center text-sm text-gray-500 mb-3">OR</div>

        {/* Google sign in */}
        <button className="btn btn-outline w-full">Sign in with Google</button>

        {/* Register link */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="text-primary font-medium">
            Register here.
          </a>
        </p>
      </fieldset>
    </div>
  );
};

export default Login;