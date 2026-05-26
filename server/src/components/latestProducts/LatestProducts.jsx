import React, { use } from 'react';
import Product from '../product/Product';

// Wraps the use() call — if the promise rejects, shows error UI instead of crashing
const ProductList = ({ latestProductsPromise, onRetry }) => {
  const products = use(latestProductsPromise);

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-gray-500 font-medium">No products available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {products.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Could not load products
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Make sure your backend server is running on{' '}
            <span className="font-mono text-purple-600">localhost:3000</span>
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onRetry?.();
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LatestProducts = ({ latestProductsPromise, onRetry }) => {
  return (
    <div>
      <h2 className="text-5xl font-bold text-center mt-6">
        Recent <span className="text-[#955AEF]">Products</span>
      </h2>
      <ErrorBoundary onRetry={onRetry}>
        <ProductList
          latestProductsPromise={latestProductsPromise}
          onRetry={onRetry}
        />
      </ErrorBoundary>
    </div>
  );
};

export default LatestProducts;
