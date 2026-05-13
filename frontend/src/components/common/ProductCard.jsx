import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice, discountPercent } from '../../utils/helpers';
import { StarRating } from './index';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const [imgError, setImgError] = useState(false);
  const [wished,   setWished]   = useState(false);
  const [adding,   setAdding]   = useState(false);

  const price   = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDisc = product.discountPrice > 0 && product.discountPrice < product.price;
  const inStock = product.stock > 0;
  const mainImg = !imgError && product.images?.[0]?.url
    ? product.images[0].url
    : `https://placehold.co/400x500/F9F3E3/8B1A2E?text=${encodeURIComponent(product.name.slice(0, 15))}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!inStock || loading || adding) return;
    setAdding(true);
    await addToCart(product._id);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div className="card group overflow-hidden animate-fade-in flex flex-col">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden shrink-0">
        <div className="aspect-[4/5] overflow-hidden bg-cream-100">
          <img
            src={mainImg}
            alt={product.name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1">
          {hasDisc && (
            <span className="badge bg-maroon-800 text-white text-xs">
              {discountPercent(product.price, product.discountPrice)}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="badge bg-gold-500 text-white text-xs">Featured</span>
          )}
          {!inStock && (
            <span className="badge bg-gray-700 text-white text-xs">Sold Out</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center shadow transition-all duration-200 hover:scale-110"
          aria-label="Wishlist"
        >
          <FiHeart
            size={13}
            className={wished ? 'fill-maroon-700 text-maroon-700' : 'text-gray-500'}
          />
        </button>

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
          <Link
            to={`/products/${product._id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg hover:bg-cream-100 transition-colors"
          >
            <FiEye size={12} /> Quick View
          </Link>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <p className="text-xs text-gold-600 font-semibold uppercase tracking-widest mb-0.5 sm:mb-1">
            {product.category}
          </p>
          <h3 className="font-display text-gray-800 font-semibold text-sm sm:text-base leading-snug line-clamp-2 hover:text-maroon-800 transition-colors mb-1 sm:mb-2">
            {product.name}
          </h3>
        </Link>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">({product.numReviews})</span>
          </div>
        )}

        {/* Fabric tag */}
        {product.fabric && (
          <span className="text-xs text-gray-400 mb-2 hidden sm:block">{product.fabric}</span>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="font-display text-maroon-800 text-base sm:text-lg font-bold">
              {formatPrice(price)}
            </span>
            {hasDisc && (
              <span className="text-gray-400 text-xs sm:text-sm line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || loading}
            className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 active:scale-90 ${
              adding
                ? 'bg-green-600 text-white'
                : inStock
                  ? 'bg-maroon-800 text-white hover:bg-maroon-700 shadow-sm hover:shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Add to cart"
          >
            {adding
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              : <FiShoppingBag size={15} />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
