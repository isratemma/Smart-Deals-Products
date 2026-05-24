import { Link, NavLink } from 'react-router-dom';
import AllProducts from '../AllProducts/AllProducts';

export default function Navbar() {
  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <NavLink to="/about">About</NavLink>
      </li>

      <li>
        <NavLink to="/AllProducts">AllProducts</NavLink>
      </li>
      <li>
        <NavLink to='/register'>Register</NavLink>
      </li>
      <li>
        <NavLink to='/login'>Login</NavLink>
      </li>
      
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-10">
      {/* Left Side */}
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-52"
          >
            {links}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-wide">
          SmartDeals
        </Link>
      </div>

      {/* Center Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">{links}</ul>
      </div>

      {/* Right Side */}
      <div className="navbar-end gap-3">
        <Link to="/login" className="btn btn-ghost">
          Login
        </Link>

        <Link to="/register" className="btn btn-primary rounded-full px-6">
          Register
        </Link>
      </div>
    </div>
  );
}
