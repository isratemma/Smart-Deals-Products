import React, { useEffect, useState } from 'react';
import Product from '../product/Product';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-100 px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">All Products</h1>
      <p className="text-gray-500 mb-8">Browse all available products up for bidding.</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-purple-600"></span>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-500 font-medium">Could not load products. Make sure backend is running.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 font-medium">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
