import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProductDetails = () => {
  const product = useLoaderData();
  const { user } = useContext(AuthContext);

  const bidModalRef = useRef(null);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bidAmount, setBidAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Bids for this product
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);

  const { _id, title, image, description, minPrice, maxPrice, category } = product;

  // Fetch bids for this product
  useEffect(() => {
    fetch(`http://localhost:3000/bids?productId=${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setBids(Array.isArray(data) ? data : []);
        setBidsLoading(false);
      })
      .catch(() => setBidsLoading(false));
  }, [_id]);

  const handleBidModalOpen = () => {
    setSubmitted(false);
    setBidAmount('');
    setError('');
    setName(user?.displayName || '');
    setEmail(user?.email || '');
    bidModalRef.current.showModal();
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (Number(bidAmount) < Number(minPrice) || Number(bidAmount) > Number(maxPrice)) {
      setError(`Bid must be between $${minPrice} and $${maxPrice}`);
      return;
    }

    const bidData = {
      productId: _id,
      productTitle: title,
      productImage: image,
      bidderName: name,
      bidderEmail: email,
      bidderPhoto: user?.photoURL || '',
      bidAmount: Number(bidAmount),
      status: 'pending',
      bidTime: new Date().toISOString(),
    };

    setLoading(true);

    fetch('http://localhost:3000/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bidData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to place bid');
        return res.json();
      })
      .then(() => {
        setSubmitted(true);
        // Refresh bids list
        setBids((prev) => [...prev, { ...bidData, _id: Date.now() }]);
      })
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-gray-100 px-4 py-10">

      {/* Product Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="w-full h-72 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://placehold.co/800x400?text=No+Image'; }} />
        </div>
        <div className="p-8 flex flex-col gap-4">
          {category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-500">{category}</span>
          )}
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 leading-relaxed">{description}</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 font-medium">Price Range:</span>
            <span className="bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">
              ${minPrice} – ${maxPrice}
            </span>
          </div>
          <button onClick={handleBidModalOpen}
            className="mt-2 w-full sm:w-fit bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition">
            Place a Bid
          </button>
        </div>
      </div>

      {/* Bids Section */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Bids for this product{' '}
          <span className="text-purple-600">({bids.length})</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">All bids placed on this product</p>

        {bidsLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md text-purple-600"></span>
          </div>
        ) : bids.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-4xl mb-3">🏷️</div>
            <p className="text-gray-500 font-medium">No bids yet. Be the first to bid!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-4">SL No</th>
                  <th className="px-5 py-4">Buyer</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, i) => (
                  <tr key={bid._id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">

                    {/* SL No */}
                    <td className="px-5 py-4 text-gray-500">{i + 1}</td>

                    {/* Photo + Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {bid.bidderPhoto ? (
                          <img
                            src={bid.bidderPhoto}
                            alt={bid.bidderName}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                            {bid.bidderName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{bid.bidderName || '—'}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-gray-500">{bid.bidderEmail}</td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="text-purple-600 font-semibold">${bid.bidAmount}</span>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            fetch(`http://localhost:3000/bids/${bid._id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'accepted' }),
                            })
                              .then((res) => res.json())
                              .then(() =>
                                setBids((prev) =>
                                  prev.map((b) => b._id === bid._id ? { ...b, status: 'accepted' } : b)
                                )
                              );
                          }}
                          disabled={bid.status === 'accepted'}
                          className="border border-green-400 text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium px-3 py-1 rounded-md transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            fetch(`http://localhost:3000/bids/${bid._id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'rejected' }),
                            })
                              .then((res) => res.json())
                              .then(() =>
                                setBids((prev) =>
                                  prev.map((b) => b._id === bid._id ? { ...b, status: 'rejected' } : b)
                                )
                              );
                          }}
                          disabled={bid.status === 'rejected'}
                          className="border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium px-3 py-1 rounded-md transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bid Modal */}
      <dialog ref={bidModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-2xl p-8 max-w-md w-full">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="text-5xl">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800">Bid Placed Successfully!</h3>
              <p className="text-gray-500 text-sm">
                Your bid of <span className="text-purple-600 font-semibold">${bidAmount}</span> has been submitted.
              </p>
              <button onClick={() => bidModalRef.current.close()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition">
                Done
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Place Your Bid</h3>
              <p className="text-sm text-gray-400 mb-6">
                Offer your best price for <span className="font-medium text-gray-700">{title}</span>
              </p>

              <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Your Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" readOnly={!!user?.email}
                    className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      user?.email ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-300'
                    }`} />
                  {user?.email && <p className="text-xs text-gray-400 mt-1">Auto-filled from your account</p>}
                </div>

                {/* Bid Amount */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Bid Amount ($)</label>
                  <input type="number" required min={minPrice} max={maxPrice} value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Between $${minPrice} – $${maxPrice}`}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  <p className="text-xs text-gray-400 mt-1">Allowed range: ${minPrice} – ${maxPrice}</p>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                    {loading ? <><span className="loading loading-spinner loading-sm"></span>Submitting...</> : 'Submit Bid'}
                  </button>
                  <button type="button" onClick={() => bidModalRef.current.close()}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition">
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
};

export default ProductDetails;
