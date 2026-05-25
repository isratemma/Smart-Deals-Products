import React, { Suspense } from 'react';
import LatestProducts from '../components/latestProducts/LatestProducts';

const latestProductsPromise = fetch('http://localhost:3000/products')
  .then((res) => res.json());

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
          </div>
        }
      >
        <LatestProducts latestProductsPromise={latestProductsPromise} />
      </Suspense>
    </div>
  );
};

export default Home;
