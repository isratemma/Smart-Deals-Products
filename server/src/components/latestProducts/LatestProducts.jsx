import React, { use } from 'react';
import Product from '../product/Product';

const LatestProducts = ({ latestProductsPromise }) => {
  const products = use(latestProductsPromise);
  console.log(products);

  return (
    <div>
      <h2 className="text-5xl font-bold text-center justify-center mt-6">
        Recent <span className="text-[#955AEF]">Products</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 justify-center items-center mx-auto">
        {products.map((product) => (
          <Product key={product._id} product={product}></Product>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
