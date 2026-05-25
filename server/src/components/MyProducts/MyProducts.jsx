import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) { setLoading(false); return; }
    if (user === undefined) return;
    fetch(`http://localhost:3000/products?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => setProducts((prev) => prev.filter((p) => p._id !== id)));
  };

  const handleMakeSold = (id) => {
    fetch(`http://localhost:3000/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sold' }),
    })
      .then((res) => res.json())
      .then(() => setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, status: 'sold' } : p))));
  };

  return (
    <div className="bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto w-full">

        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          My Products: <span className="text-purple-600">{products.length}</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Please log in</h2>
            <p className="text-gray-400 text-sm mb-6">You need to be logged in to see your products.</p>
            <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition">
              Login
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h2>
            <p className="text-gray-400 text-sm mb-6">You haven't listed any products. Create one to get started.</p>
            <Link to="/create-product" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition">
              Create Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-4">SL No</th>
                  <th className="px-5 py-4">Image</th>
                  <th className="px-5 py-4">Product Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4 text-gray-600">{index + 1}</td>
                    <td className="px-5 py-4">
                      <img src={product.image} alt={product.title}
                        className="w-12 h-10 object-cover rounded-lg bg-gray-100"
                        onError={(e) => { e.target.src = 'https://placehold.co/48x40?text=N/A'; }} />
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">{product.title}</td>
                    <td className="px-5 py-4 text-gray-600">{product.category || '—'}</td>
                    <td className="px-5 py-4 text-gray-700">${product.minPrice}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'sold' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.status === 'sold' ? 'Sold' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/edit-product/${product._id}`}
                          className="border border-purple-400 text-purple-600 hover:bg-purple-50 text-xs font-medium px-3 py-1 rounded-md transition">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(product._id)}
                          className="border border-red-400 text-red-500 hover:bg-red-50 text-xs font-medium px-3 py-1 rounded-md transition">
                          Delete
                        </button>
                        {product.status !== 'sold' && (
                          <button onClick={() => handleMakeSold(product._id)}
                            className="border border-green-400 text-green-600 hover:bg-green-50 text-xs font-medium px-3 py-1 rounded-md transition">
                            Make Sold
                          </button>
                        )}
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
  );
};

export default MyProducts;
