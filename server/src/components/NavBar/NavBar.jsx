import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const { user, signOutUser } = useContext(AuthContext);

  const handleSignOut = () => {
    signOutUser()
      .then(() => console.log('Signed out'))
      .catch((error) => console.error(error));
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-purple-600 ${
      isActive ? 'text-purple-600 font-semibold' : 'text-gray-700'
    }`;

  return (
    <nav className="bg-white shadow-sm px-6 lg:px-16 py-3 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide shrink-0">
        <span className="text-gray-900">Smart</span>
        <span className="text-purple-600">Deals</span>
      </Link>

      {/* Center links */}
      <div className="hidden lg:flex items-center gap-7">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/AllProducts" className={navLinkClass}>All Products</NavLink>
        {user && (
          <>
            <NavLink to="/my-products" className={navLinkClass}>My Products</NavLink>
            <NavLink to="/my-bids" className={navLinkClass}>My Bids</NavLink>
            <NavLink to="/create-product" className={navLinkClass}>Create Product</NavLink>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        {user ? (
          <>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
                title={user.displayName || user.email}
              />
            )}
            <button
              onClick={handleSignOut}
              className="border border-purple-600 text-purple-600 text-sm font-medium px-5 py-1.5 rounded-lg hover:bg-purple-50 transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-purple-600 text-purple-600 text-sm font-medium px-5 py-1.5 rounded-lg hover:bg-purple-50 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 text-white text-sm font-medium px-5 py-1.5 rounded-lg hover:bg-purple-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <details className="dropdown dropdown-end">
          <summary className="btn btn-ghost btn-sm text-lg">☰</summary>
          <ul className="dropdown-content menu p-3 shadow bg-white rounded-box w-52 z-50 mt-2">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/AllProducts">All Products</NavLink></li>
            {user && (
              <>
                <li><NavLink to="/my-products">My Products</NavLink></li>
                <li><NavLink to="/my-bids">My Bids</NavLink></li>
                <li><NavLink to="/create-product">Create Product</NavLink></li>
              </>
            )}
            <div className="divider my-1"></div>
            {user ? (
              <li><button onClick={handleSignOut}>Sign Out</button></li>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </details>
      </div>

    </nav>
  );
}
