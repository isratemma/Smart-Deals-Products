import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MyBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) { setLoading(false); return; }
    if (user === undefined) return;

    fetch(`http://localhost:3000/bids`)
      .then((res) => res.json())
      .then((data) => {
        // filter client-side by logged-in user email
        const myBids = Array.isArray(data)
          ? data.filter((b) => b.bidderEmail === user.email)
          : [];
        setBids(myBids);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleRemoveBid = (id) => {
    if (!window.confirm('Remove this bid?')) return;
    fetch(`http://localhost:3000/bids/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => setBids((prev) => prev.filter((b) => b._id !== id)));
  };

  return (
    <div className="bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          My Bids: <span className="text-purple-600">{bids.length}</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Please log in</h2>
            <p className="text-gray-400 text-sm mb-6">You need to be logged in to see your bids.</p>
            <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition">
              Login
            </Link>
          </div>
        ) : bids.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🏷️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No bids placed yet</h2>
            <p className="text-gray-400 text-sm mb-6">You haven't placed any bids. Browse products and start bidding.</p>
            <Link to="/AllProducts" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-4">SL No</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Seller</th>
                  <th className="px-5 py-4">Bid Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, index) => (
                  <tr key={bid._id} className="border-b border-gray-50 hover:bg-gray-50 transition">

                    {/* SL No */}
                    <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={bid.productImage}
                          alt={bid.productTitle}
                          className="w-12 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                          onError={(e) => { e.target.src = 'https://placehold.co/48x40?text=N/A'; }}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{bid.productTitle}</p>
                          <p className="text-xs text-gray-400">${bid.bidAmount}</p>
                        </div>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {bid.bidderPhoto ? (
                          <img
                            src={bid.bidderPhoto}
                            alt={bid.bidderName}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                            {bid.bidderName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{bid.bidderName || '—'}</p>
                          <p className="text-xs text-gray-400">{bid.bidderEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Bid Price */}
                    <td className="px-5 py-4">
                      <span className="text-gray-800 font-semibold">${bid.bidAmount}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bid.status === 'accepted' ? 'bg-green-100 text-green-700'
                        : bid.status === 'rejected' ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {bid.status === 'accepted' ? 'Accepted'
                          : bid.status === 'rejected' ? 'Rejected'
                          : 'Pending'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleRemoveBid(bid._id)}
                        className="border border-red-400 text-red-500 hover:bg-red-50 text-xs font-medium px-3 py-1.5 rounded-md transition"
                      >
                        Remove Bid
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;
