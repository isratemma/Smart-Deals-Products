import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import MyBids from '../MyBids/MyBids';

const ProductDetails = () => {
  const product = useLoaderData();
  const { user } = useContext(AuthContext);

  const bidModalRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:3000/products/bids/${product._id}`)
      .then((res) => res.json())
      .then((data) => console.log('bids for this product', data));
  }, [product._id]);

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bidAmount, setBidAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { _id, title, image, description, minPrice, maxPrice, category } =
    product;

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

    if (
      Number(bidAmount) < Number(minPrice) ||
      Number(bidAmount) > Number(maxPrice)
    ) {
      setError(`Bid must be between $${minPrice} and $${maxPrice}`);
      return;
    }

    const bidData = {
      productId: _id,
      productTitle: title,
      productImage: image,
      bidderName: name,
      bidderEmail: email,
      bidAmount: Number(bidAmount),
      status: 'pending',
      bidTime: new Date().toISOString(),
      image:user?.photoURL,
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
      .then((data) => {
        console.log('Bid saved:', data);
        setSubmitted(true);
      })
      .catch((err) => {
        setError('Something went wrong. Please try again.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Product Image */}
        <div className="w-full h-72 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/800x400?text=No+Image';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="p-8 flex flex-col gap-4">
          {category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-500">
              {category}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>

          <p className="text-gray-500 leading-relaxed">{description}</p>

          {/* Price Range */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 font-medium">Price Range:</span>

            <span className="bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">
              ${minPrice} - ${maxPrice}
            </span>
          </div>

          {/* Bid Button */}
          <button
            onClick={handleBidModalOpen}
            className="mt-4 w-full sm:w-fit bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            Place a Bid
          </button>
        </div>
      </div>

      {/* Modal */}
      <dialog ref={bidModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-2xl p-8 max-w-md w-full">
          {submitted ? (
            /* Success Message */
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="text-5xl">🎉</div>

              <h3 className="text-2xl font-bold text-gray-800">
                Bid Placed Successfully!
              </h3>

              <p className="text-gray-500 text-sm">
                Your bid of{' '}
                <span className="text-purple-600 font-semibold">
                  ${bidAmount}
                </span>{' '}
                has been submitted.
              </p>

              <button
                onClick={() => bidModalRef.current.close()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition"
              >
                Done
              </button>
            </div>
          ) : (
            /* Bid Form */
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                Place Your Bid
              </h3>

              <p className="text-sm text-gray-400 mb-6">
                Offer your best price for{' '}
                <span className="font-medium text-gray-700">{title}</span>
              </p>

              <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Your Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    readOnly={!!user?.email}
                    className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      user?.email
                        ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                        : 'border-gray-300 text-gray-800'
                    }`}
                  />
                  {user?.email && (
                    <p className="text-xs text-gray-400 mt-1">
                      Auto-filled from your account
                    </p>
                  )}
                </div>

                {/* Bid Amount */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Bid Amount ($)
                  </label>

                  <input
                    type="number"
                    required
                    min={minPrice}
                    max={maxPrice}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Enter amount between ${minPrice}-${maxPrice}`}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />

                  <p className="text-xs text-gray-400 mt-1">
                    Allowed range: ${minPrice} - ${maxPrice}
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Bid'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => bidModalRef.current.close()}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div>
        <h3 className="text-3xl">Bids for this product:<span className='text-primary'>{MyBids.length}</span></h3>
        <div class="overflow-x-auto">
  <table class="$$table">
    <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="$$checkbox" />
          </label>
        </th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="$$checkbox" />
          </label>
        </th>
        <td>
          <div class="flex items-center gap-3">
            <div class="$$avatar">
              <div class="$$mask $$mask-squircle h-12 w-12">
                <img
                  src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                  alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">Hart Hagerty</div>
              <div class="text-sm opacity-50">United States</div>
            </div>
          </div>
        </td>
        <td>
          Zemlak, Daniel and Leannon
          <br />
          <span class="$$badge $$badge-ghost $$badge-sm">Desktop Support Technician</span>
        </td>
        <td>Purple</td>
        <th>
          <button class="$$btn $$btn-ghost $$btn-xs">details</button>
        </th>
      </tr>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="$$checkbox" />
          </label>
        </th>
        <td>
          <div class="flex items-center gap-3">
            <div class="$$avatar">
              <div class="$$mask $$mask-squircle h-12 w-12">
                <img
                  src="https://img.daisyui.com/images/profile/demo/3@94.webp"
                  alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">Brice Swyre</div>
              <div class="text-sm opacity-50">China</div>
            </div>
          </div>
        </td>
        <td>
          Carroll Group
          <br />
          <span class="$$badge $$badge-ghost $$badge-sm">Tax Accountant</span>
        </td>
        <td>Red</td>
        <th>
          <button class="$$btn $$btn-ghost $$btn-xs">details</button>
        </th>
      </tr>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="$$checkbox" />
          </label>
        </th>
        <td>
          <div class="flex items-center gap-3">
            <div class="$$avatar">
              <div class="$$mask $$mask-squircle h-12 w-12">
                <img
                  src="https://img.daisyui.com/images/profile/demo/4@94.webp"
                  alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">Marjy Ferencz</div>
              <div class="text-sm opacity-50">Russia</div>
            </div>
          </div>
        </td>
        <td>
          Rowe-Schoen
          <br />
          <span class="$$badge $$badge-ghost $$badge-sm">Office Assistant I</span>
        </td>
        <td>Crimson</td>
        <th>
          <button class="$$btn $$btn-ghost $$btn-xs">details</button>
        </th>
      </tr>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="$$checkbox" />
          </label>
        </th>
        <td>
          <div class="flex items-center gap-3">
            <div class="$$avatar">
              <div class="$$mask $$mask-squircle h-12 w-12">
                <img
                  src="https://img.daisyui.com/images/profile/demo/5@94.webp"
                  alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">Yancy Tear</div>
              <div class="text-sm opacity-50">Brazil</div>
            </div>
          </div>
        </td>
        <td>
          Wyman-Ledner
          <br />
          <span class="$$badge $$badge-ghost $$badge-sm">Community Outreach Specialist</span>
        </td>
        <td>Indigo</td>
        <th>
          <button class="$$btn $$btn-ghost $$btn-xs">details</button>
        </th>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th>SL No.</th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
        <th></th>
      </tr>
    </tfoot>
  </table>
</div>
      </div>
    </div>
  );
};

export default ProductDetails;
