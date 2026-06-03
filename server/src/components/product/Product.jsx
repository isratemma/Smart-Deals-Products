import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  const { _id, image, description, category, sellerName, sellerPhoto, ownerName, status } = product;

  // handle both old (title/minPrice) and new (name/price) field names
  const productName = product.title || product.name || 'Unnamed Product';
  const startingPrice = product.minPrice || product.price || 0;
  const endingPrice = product.maxPrice || null;
  const seller = sellerName || ownerName || 'Unknown Seller';

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">

      {/* Clickable Image */}
      <Link to={`/productDetails/${_id}`} className="block overflow-hidden">
        <img
          src={image}
          alt={productName}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2 flex-1">

        {/* Category badge */}
        {category && (
          <span className="text-xs font-medium text-purple-500 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full w-fit">
            {category}
          </span>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{productName}</h2>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        {/* Price */}
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="text-gray-500">Price:</span>
          <span className="text-purple-600 font-semibold">${startingPrice}</span>
          {endingPrice && (
            <>
              <span className="text-gray-400">–</span>
              <span className="text-purple-600 font-semibold">${endingPrice}</span>
            </>
          )}
        </div>

        {/* Seller info */}
        <div className="flex items-center gap-2 mt-1">
          {sellerPhoto ? (
            <img
              src={sellerPhoto}
              alt={seller}
              className="w-7 h-7 rounded-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
              {seller.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-500">{seller}</span>
          {status && (
            <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
              status === 'sold' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
            }`}>
              {status === 'sold' ? 'Sold' : 'Available'}
            </span>
          )}
        </div>

        {/* View Details Button */}
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
