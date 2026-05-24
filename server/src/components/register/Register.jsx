import React, { use } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {

  const {SignInWithGoogle} = use(AuthContext);

  const handleGoogleSignIn = () => {
      SignInWithGoogle()
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.error(error);
       })
  }

  return (
    <div>
      <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        {/* Name */}
        <label className="label">Your Name</label>
        <input
          type="text"
          className="input input-bordered w-full mb-3"
          placeholder="Enter your name"
        />

        {/* Photo URL */}
        <label className="label">Photo URL</label>
        <input
          type="text"
          className="input input-bordered w-full mb-3"
          placeholder="Enter photo URL"
        />

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

        {/* Terms */}
        <label className="flex items-center gap-2 text-sm mb-4">
          <input type="checkbox" className="checkbox checkbox-sm" />I agree to
          the Terms and Conditions
        </label>

        {/* Register button */}
        <button onClick={handleGoogleSignIn}
          className="btn btn-primary w-full mb-3">Register</button>

        {/* OR */}
        <div className="text-center text-sm text-gray-500 mb-3">OR</div>

        {/* Google sign up */}
        <button className="btn btn-outline w-full">Sign up with Google</button>

        {/* Login link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-medium">
            Login here
          </a>
        </p>
      </fieldset>
    </div>
  );
};

export default Register;