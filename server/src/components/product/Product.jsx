import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  const { _id, image, description } = product;

  // handle both old (title/minPrice) and new (name/price) field names
  const productName = product.title || product.name || 'Unnamed Product';
  const startingPrice = product.minPrice || product.price || 0;
  const endingPrice = product.maxPrice || null;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Image */}
      <figure className="px-4 pt-4 pb-4">
        <img
          src={image}
          alt={productName}
          className="w-full h-48 object-cover rounded-xl"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
      </figure>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h2 className="text-lg font-semibold text-gray-800">{productName}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        {/* Price */}
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="text-gray-500">Price:</span>
          <span className="text-purple-600 font-medium">${startingPrice}</span>
          {endingPrice && (
            <>
              <span className="text-gray-400">–</span>
              <span className="text-purple-600 font-medium">${endingPrice}</span>
            </>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/productDetails/${_id}`}
          className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Product;
