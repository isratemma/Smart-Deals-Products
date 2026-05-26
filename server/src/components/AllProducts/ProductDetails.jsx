import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProductDetails = () => {
  const product = useLoaderData();
  const { user } = useContext(AuthContext);

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

  const {
    _id, title, image, description,
    minPrice, maxPrice, category,
    condition, usageTime, postedDate,
    sellerName, sellerEmail, sellerPhoto,
    sellerLocation, sellerContact, sellerStatus,
  } = product;

  useEffect(() => {
    fetch(`http://localhost:3000/bids?productId=${_id}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime))
          : [];
        setBids(sorted);
        setBidsLoading(false);
      })
      .catch(() => setBidsLoading(false));
  }, [_id]);

  const handleOpenModal = () => {
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

    if (Number(price) < Number(minPrice) || Number(price) > Number(maxPrice)) {
      setError(`Price must be between $${minPrice} and $${maxPrice}`);
      return;
    }

    const bidData = {
      productId: _id,
      productTitle: title,
      productImage: image,
      bidderName: buyerName,
      bidderEmail: buyerEmail,
      bidderPhoto: buyerImage,
      bidderContact: contact,
      bidAmount: Number(price),
      status: 'pending',
      bidTime: new Date().toISOString(),
    };

    setLoading(true);
    fetch('http://localhost:3000/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bidData),
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => {
        setSubmitted(true);
        setBids((prev) => [{ ...bidData, _id: Date.now() }, ...prev]);
      })
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false));
  };

  const updateBidStatus = (bidId, status) => {
    fetch(`http://localhost:3000/bids/${bidId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => setBids((prev) => prev.map((b) => b._id === bidId ? { ...b, status } : b)));
  };

  return (
    <div className="bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Back link */}
        <Link to="/AllProducts" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 mb-6 transition">
          ← Back To Products
        </Link>

        {/* ── Product Detail Card ── */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Left — Image */}
            <div className="lg:w-2/5 bg-gray-50 flex items-center justify-center p-6">
              <img
                src={image}
                alt={title}
                className="w-full max-h-80 object-contain rounded-xl"
                onError={(e) => { e.target.src = 'https://placehold.co/400x320?text=No+Image'; }}
              />
            </div>

            {/* Right — Info */}
            <div className="lg:w-3/5 p-8 flex flex-col gap-4">
              {/* Category badge */}
              {category && (
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-500 bg-purple-50 px-3 py-1 rounded-full w-fit">
                  {category}
                </span>
              )}

              <h1 className="text-3xl font-bold text-gray-800">{title}</h1>

              {/* Price */}
              <div>
                <p className="text-2xl font-bold text-purple-600">${minPrice} - {maxPrice}</p>
                <p className="text-xs text-gray-400 mt-0.5">Price starts from</p>
              </div>

              {/* Product Details */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                  <span>Product ID:</span>
                  <span className="text-gray-700 font-mono text-xs truncate">{_id}</span>
                  <span>Posted:</span>
                  <span className="text-gray-700">{postedDate || 'N/A'}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Description</h3>
                <div className="flex gap-4 text-xs mb-2">
                  {condition && (
                    <span className="text-purple-600 font-medium border border-purple-200 px-2 py-0.5 rounded-full">
                      Condition: {condition}
                    </span>
                  )}
                  {usageTime && (
                    <span className="text-blue-600 font-medium border border-blue-200 px-2 py-0.5 rounded-full">
                      Usage Time: {usageTime}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">{description}</p>
              </div>

              {/* Seller Info */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Seller Information</h3>
                <div className="flex items-start gap-3">
                  {sellerPhoto ? (
                    <img src={sellerPhoto} alt={sellerName}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                      {sellerName?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 space-y-0.5">
                    <p className="font-semibold text-gray-800">{sellerName || 'Unknown Seller'}</p>
                    <p className="text-xs text-gray-400">{sellerEmail || 'N/A'}</p>
                    {sellerLocation && <p>📍 Location: {sellerLocation}</p>}
                    {sellerContact && <p>📞 Contact: {sellerContact}</p>}
                    {sellerStatus && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                        {sellerStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleOpenModal}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition mt-2"
              >
                I Want Buy This Product
              </button>
            </div>
          </div>
        </div>

        {/* ── Bids Section ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-gray-800">
              Bids For This Products:{' '}
              <span className="text-purple-600">
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
          <p className="text-xs text-gray-400 mb-2">Only visible to Owner</p>

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
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Seller</th>
                    <th className="px-5 py-4">Bid Price</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAll ? bids : bids.slice(0, 6)).map((bid, i) => (
                    <tr key={bid._id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">

                      {/* SL No */}
                      <td className="px-5 py-4 text-gray-500">{i + 1}</td>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={bid.productImage || image} alt={bid.productTitle}
                            className="w-12 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                            onError={(e) => { e.target.src = 'https://placehold.co/48x40?text=N/A'; }} />
                          <div>
                            <p className="font-medium text-gray-800">{bid.productTitle}</p>
                            <p className="text-xs text-gray-400">${bid.bidAmount}</p>
                          </div>
                        </div>
                      </td>

                      {/* Seller (bidder) */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {bid.bidderPhoto ? (
                            <img src={bid.bidderPhoto} alt={bid.bidderName}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }} />
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
                      <td className="px-5 py-4 font-semibold text-gray-800">${bid.bidAmount}</td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateBidStatus(bid._id, 'accepted')}
                            disabled={bid.status === 'accepted'}
                            className="border border-green-400 text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium px-3 py-1.5 rounded-md transition"
                          >
                            Accept Offer
                          </button>
                          <button
                            onClick={() => updateBidStatus(bid._id, 'rejected')}
                            disabled={bid.status === 'rejected'}
                            className="border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium px-3 py-1.5 rounded-md transition"
                          >
                            Reject Offer
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
        <div className="modal-box rounded-2xl p-8 max-w-lg w-full">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="text-5xl">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800">Bid Placed Successfully!</h3>
              <p className="text-gray-500 text-sm">
                Your offer of <span className="text-purple-600 font-semibold">${price}</span> has been submitted.
              </p>
              <button onClick={() => bidModalRef.current.close()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition">
                Done
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                Give Seller Your Offered Price
              </h3>

              <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
                {/* Row 1 — Name + Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Buyer Name</label>
                    <input type="text" required value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Buyer Email</label>
                    <input type="email" required value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="Your Email"
                      readOnly={!!user?.email}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        user?.email ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' : 'border-gray-300'
                      }`} />
                  </div>
                </div>

                {/* Buyer Image URL */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Buyer Image URL</label>
                  <input type="text" value={buyerImage}
                    onChange={(e) => setBuyerImage(e.target.value)}
                    placeholder="https://your_img_url"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>

                {/* Place Your Price */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Place Your Price</label>
                  <input type="number" required min={minPrice} max={maxPrice} value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={`e.g. $${minPrice} - $${maxPrice}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Contact Info</label>
                  <input type="text" value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. +555 1234"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => bidModalRef.current.close()}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2 rounded-lg transition text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-lg transition text-sm flex items-center gap-2">
                    {loading ? <><span className="loading loading-spinner loading-xs"></span>Submitting...</> : 'Submit Bid'}
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
