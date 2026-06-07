import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProductDetails = () => {
  const product = useLoaderData();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const bidModalRef = useRef(null);
  const [buyerName, setBuyerName] = useState(user?.displayName || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerImage, setBuyerImage] = useState(user?.photoURL || '');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const { _id, image, description, category, condition, usage, createdAt,
    sellerName, sellerEmail, sellerPhoto, location, sellerContact, status, deadline } = product;

  const productName = product.title || product.name || 'Unnamed Product';
  const minPrice = product.minPrice || product.price || 0;
  const maxPrice = product.maxPrice || null;
  const productImage = image || product.photoURL || 'https://placehold.co/600x450?text=No+Image';
  const ownerName = sellerName || product.ownerName || 'Unknown Seller';
  const ownerEmail = sellerEmail || product.ownerEmail || 'N/A';
  const ownerPhoto = sellerPhoto || product.ownerPhoto || null;

  useEffect(() => {
    setBidsLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/bids`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => {
        const fetchedBids = Array.isArray(res.data)
          ? res.data
              .filter((b) => b.productId === _id)
              .sort((a, b) => new Date(b.bidTime || b.createdAt) - new Date(a.bidTime || a.createdAt))
          : [];
        setBids(fetchedBids);
      })
      .catch(() => setBids([]))
      .finally(() => setBidsLoading(false));
  }, [_id]);

  const handleOpenModal = () => {
    if (!user) {
      navigate('/login', { state: { from: currentLocation } });
      return;
    }
    setSubmitted(false);
    setPrice('');
    setContact('');
    setError('');
    setBuyerName(user?.displayName || '');
    setBuyerEmail(user?.email || '');
    setBuyerImage(user?.photoURL || '');
    bidModalRef.current.showModal();
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (maxPrice && (Number(price) < Number(minPrice) || Number(price) > Number(maxPrice))) {
      setError(`Price must be between $${minPrice} and $${maxPrice}`);
      return;
    }
    const bidData = {
      productId: _id,
      productTitle: productName,
      productImage,
      bidderName: buyerName,
      bidderEmail: buyerEmail,
      bidderPhoto: buyerImage,
      bidderContact: contact,
      bidAmount: Number(price),
      status: 'pending',
      bidTime: new Date().toISOString(),
    };
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(bidData),
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => { setSubmitted(true); setBids((prev) => [{ ...bidData, _id: Date.now() }, ...prev]); })
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false));
  };

  const updateBidStatus = (bidId, newStatus) => {
    fetch(`${import.meta.env.VITE_API_URL}/bids/${bidId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => setBids((prev) => prev.map((b) => b._id === bidId ? { ...b, status: newStatus } : b)));
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Back button */}
        <Link to="/AllProducts"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition mb-6 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Products
        </Link>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:w-5/12 flex flex-col">

              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 min-h-80">
                {status && (
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full z-10 ${
                    status === 'sold' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {status === 'sold' ? '● Sold' : '● Available'}
                  </span>
                )}
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full max-h-80 object-contain rounded-2xl hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x450?text=No+Image'; }}
                />
              </div>

              {/* Description */}
              <div className="p-8 border-t border-gray-100 flex-1">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-purple-500 rounded-full inline-block"></span>
                  Product Description
                </h3>

                {(condition || usage) && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {condition && (
                      <span className="flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-full">
                        🏷️ {condition}
                      </span>
                    )}
                    {usage && (
                      <span className="flex items-center gap-1.5 text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1.5 rounded-full">
                        ⏱️ {usage}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-gray-500 text-sm leading-relaxed">
                  {description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:w-7/12 p-8 flex flex-col gap-5 lg:border-l border-gray-100">

              {/* Category + Title */}
              <div>
                {category && (
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                    {category}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mt-3 leading-tight">{productName}</h1>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Starting Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-green-600">${minPrice}</span>
                  {maxPrice && (
                    <>
                      <span className="text-gray-400 text-lg">–</span>
                      <span className="text-2xl font-bold text-green-500">${maxPrice}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Product Details Card */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-purple-400 rounded-full inline-block"></span>
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {category && (
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-0.5">Category</p>
                      <p className="font-semibold text-gray-700">{category}</p>
                    </div>
                  )}
                  {condition && (
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-0.5">Condition</p>
                      <p className="font-semibold text-gray-700">{condition}</p>
                    </div>
                  )}
                  {usage && (
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-0.5">Usage</p>
                      <p className="font-semibold text-gray-700">{usage}</p>
                    </div>
                  )}
                  {location && (
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-0.5">Location</p>
                      <p className="font-semibold text-gray-700">{location}</p>
                    </div>
                  )}
                  {deadline && (
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-0.5">Bid Deadline</p>
                      <p className="font-semibold text-gray-700">{deadline}</p>
                    </div>
                  )}
                  {createdAt && (
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-0.5">Posted</p>
                      <p className="font-semibold text-gray-700">{new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Information Card */}
              <div className="border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-400 rounded-full inline-block"></span>
                  Seller Information
                </h3>
                <div className="flex items-center gap-4">
                  {ownerPhoto ? (
                    <img
                      src={ownerPhoto}
                      alt={ownerName}
                      className="w-14 h-14 rounded-2xl object-cover shadow-md shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
                      {ownerName?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-base truncate">{ownerName}</p>
                    <p className="text-sm text-gray-400 truncate">{ownerEmail}</p>
                    {location && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        📍 {location}
                      </p>
                    )}
                    {sellerContact && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        📞 {sellerContact}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleOpenModal}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base mt-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                I Want to Buy This Product
              </button>
            </div>
          </div>
        </div>

        {/* ── Bids Section ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Bids For This Product{' '}
              <span className="text-purple-600 bg-purple-100 text-base px-3 py-0.5 rounded-full ml-2">
                {String(bids.length).padStart(2, '0')}
              </span>
            </h2>
            {bids.length > 6 && (
              <button onClick={() => setShowAll((p) => !p)}
                className="text-sm text-purple-600 hover:underline font-medium">
                {showAll ? 'Show less' : `View all ${bids.length}`}
              </button>
            )}
          </div>

          {bidsLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-md text-purple-600"></span>
            </div>
          ) : bids.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">🏷️</div>
              <p className="text-gray-500 font-medium">No bids yet. Be the first to bid!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Bidder</th>
                    <th className="px-5 py-4">Bid Price</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAll ? bids : bids.slice(0, 6)).map((bid, i) => (
                    <tr key={bid._id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={bid.productImage || productImage} alt={bid.productTitle}
                            className="w-12 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                            onError={(e) => { e.target.src = 'https://placehold.co/48x40?text=N/A'; }} />
                          <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{bid.productTitle}</p>
                            <p className="text-xs text-gray-400">ID: {bid.productId?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {bid.bidderPhoto ? (
                            <img src={bid.bidderPhoto} alt={bid.bidderName}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }} />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {bid.bidderName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{bid.bidderName || '—'}</p>
                            <p className="text-xs text-gray-400">{bid.bidderEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-lg font-bold text-gray-800">${bid.bidAmount}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          bid.status === 'accepted' ? 'bg-green-100 text-green-700'
                          : bid.status === 'rejected' ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {bid.status === 'accepted' ? '✓ Accepted'
                            : bid.status === 'rejected' ? '✗ Rejected'
                            : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateBidStatus(bid._id, 'accepted')}
                            disabled={bid.status === 'accepted'}
                            className="border border-green-400 text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium px-3 py-1.5 rounded-lg transition">
                            Accept
                          </button>
                          <button onClick={() => updateBidStatus(bid._id, 'rejected')}
                            disabled={bid.status === 'rejected'}
                            className="border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium px-3 py-1.5 rounded-lg transition">
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
      </div>

      {/* ── Bid Modal ── */}
      <dialog ref={bidModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-3xl p-8 max-w-lg w-full shadow-2xl">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800">Bid Placed Successfully!</h3>
              <p className="text-gray-500 text-sm">
                Your offer of <span className="text-purple-600 font-bold text-lg">${price}</span> has been submitted.
              </p>
              <button onClick={() => bidModalRef.current.close()}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-xl transition">
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <img src={productImage} alt={productName}
                  className="w-12 h-12 rounded-xl object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=?'; }} />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Place Your Bid</h3>
                  <p className="text-xs text-gray-400 line-clamp-1">{productName}</p>
                </div>
              </div>

              <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Buyer Name</label>
                    <input type="text" required value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Buyer Email</label>
                    <input type="email" required value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      readOnly={!!user?.email}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        user?.email ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'border-gray-200 bg-gray-50'
                      }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Photo URL (optional)</label>
                  <input type="text" value={buyerImage}
                    onChange={(e) => setBuyerImage(e.target.value)}
                    placeholder="https://your-photo-url.jpg"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Your Offer Price {maxPrice ? `($${minPrice} – $${maxPrice})` : `(min $${minPrice})`}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input type="number" required min={minPrice} max={maxPrice || undefined} value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={`${minPrice}`}
                      className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Info</label>
                  <input type="text" value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+880 1234 567890"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50" />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => bidModalRef.current.close()}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl transition text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2">
                    {loading ? <><span className="loading loading-spinner loading-xs"></span> Submitting...</> : 'Submit Bid'}
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
