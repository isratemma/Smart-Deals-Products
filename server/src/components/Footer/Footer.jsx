import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold mb-3">
            <span className="text-white">Smart</span>
            <span className="text-purple-400">Deals</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted marketplace for authentic local products. Discover the best deals from across Bangladesh.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/AllProducts" className="hover:text-white transition">All Products</Link></li>
            <li><Link to="/my-products" className="hover:text-white transition">My Products</Link></li>
            <li><Link to="/my-bids" className="hover:text-white transition">My Bids</Link></li>
            <li><Link to="/create-product" className="hover:text-white transition">Create Product</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Electronics</li>
            <li>Fashion</li>
            <li>Home &amp; Living</li>
            <li>Groceries</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact &amp; Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span>✉</span> support@smartdeals.com
            </li>
            <li className="flex items-start gap-2">
              <span>📞</span> +880 123 456 789
            </li>
            <li className="flex items-start gap-2">
              <span>📍</span> 123 Commerce Street, Dhaka, Bangladesh
            </li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-purple-600 flex items-center justify-center transition text-xs font-bold">X</a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-blue-700 flex items-center justify-center transition text-xs font-bold">in</a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition text-xs font-bold">f</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center text-xs text-gray-500 py-4">
        © 2025 SmartDeals. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
