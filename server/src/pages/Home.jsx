import React, { Suspense, useState } from 'react';
import LatestProducts from '../components/latestProducts/LatestProducts';

// Creates a fresh promise each time — so retrying works
const fetchProducts = () =>
  fetch('http://localhost:3000/products').then((res) => {
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  });

const Home = () => {
  const [promise, setPromise] = useState(() => fetchProducts());

  const handleRetry = () => setPromise(fetchProducts());

  return (
    <div className="bg-gray-100 px-6 py-10 min-h-screen">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
          </div>
        }
      >
        <LatestProducts
          latestProductsPromise={promise}
          onRetry={handleRetry}
        />
      </Suspense>
    </div>
  );
};

export default Home;
