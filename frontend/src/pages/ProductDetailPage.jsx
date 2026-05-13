import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowLeft, FiStar, FiTruck, FiShield } from 'react-icons/fi';
import { useProduct } from '../hooks';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, discountPercent, buildWhatsAppMessage } from '../utils/helpers';
import { PageLoader, StarRating, CategoryBadge } from '../components/common';
import { productAPI } from '../utils/api';
import toast from 'react-hot-toast';

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919462062626';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, setProduct } = useProduct(id);
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();

  const [selImg,    setSelImg]    = useState(0);
  const [selSize,   setSelSize]   = useState('');
  const [selColor,  setSelColor]  = useState('');
  const [quantity,  setQuantity]  = useState(1);
  const [reviewTab, setReviewTab] = useState(false);
  const [rating,    setRating]    = useState(5);
  const [comment,   setComment]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageLoader />;
  if (error || !product) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">😕</p>
      <h2 className="font-display text-2xl text-maroon-900 mb-2">Product Not Found</h2>
      <button onClick={() => navigate('/products')} className="btn-primary mt-4">Back to Products</button>
    </div>
  );

  const price   = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDisc = product.discountPrice > 0 && product.discountPrice < product.price;
  const inStock = product.stock > 0;

  const handleAddToCart = async () => {
    if (product.size?.length && !selSize) { toast.error('Please select a size'); return; }
    await addToCart(product._id, quantity, selSize, selColor);
  };

  const handleBuyNow = async () => {
    if (product.size?.length && !selSize) { toast.error('Please select a size'); return; }
    const ok = await addToCart(product._id, quantity, selSize, selColor);
    if (ok) navigate('/cart');
  };

  const handleWhatsApp = () => {
    const items = [{ name: product.name, size: selSize, quantity, price }];
    const msg = buildWhatsAppMessage(items, price * quantity, null);
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to submit a review'); return; }
    setSubmitting(true);
    try {
      await productAPI.addReview(id, { rating, comment });
      toast.success('Review submitted! 🌟');
      setComment(''); setRating(5);
      // Refetch product
      const { data } = await productAPI.getOne(id);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-maroon-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-maroon-700">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-maroon-700">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* Images */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex flex-col gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelImg(i)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selImg === i ? 'border-maroon-600' : 'border-cream-200 hover:border-maroon-300'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Main image */}
          <div className="flex-1 rounded-2xl overflow-hidden bg-cream-100 aspect-[4/5]">
            <img
              src={product.images?.[selImg]?.url || `https://placehold.co/600x750/F9F3E3/8B1A2E?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <CategoryBadge category={product.category} />
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3 leading-snug">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-display text-3xl text-maroon-800 font-bold">{formatPrice(price)}</span>
            {hasDisc && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="badge bg-green-100 text-green-700 text-sm">
                  {discountPercent(product.price, product.discountPrice)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Fabric & Stock */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {product.fabric && (
              <div className="bg-cream-100 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Fabric</p>
                <p className="font-semibold text-gray-800">{product.fabric}</p>
              </div>
            )}
            <div className={`rounded-lg p-3 ${inStock ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-gray-500 text-xs">Availability</p>
              <p className={`font-semibold ${inStock ? 'text-green-700' : 'text-red-600'}`}>
                {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Color selector */}
          {product.color?.length > 0 && (
            <div className="mb-5">
              <p className="label">Color: <span className="text-maroon-700 font-bold">{selColor || 'Select'}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.color.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelColor(c)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      selColor === c ? 'border-maroon-600 bg-maroon-50 text-maroon-800' : 'border-gray-200 hover:border-maroon-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.size?.length > 0 && (
            <div className="mb-5">
              <p className="label">Size: <span className="text-maroon-700 font-bold">{selSize || 'Select'}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.size.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelSize(s)}
                    className={`w-12 h-12 rounded-lg border-2 text-sm font-semibold transition-all ${
                      selSize === s ? 'border-maroon-600 bg-maroon-800 text-white' : 'border-gray-200 hover:border-maroon-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="label">Quantity</p>
            <div className="flex items-center gap-0 w-fit border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-lg font-bold transition-colors">−</button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-lg font-bold transition-colors">+</button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button onClick={handleAddToCart} disabled={!inStock || cartLoading} className="btn-outline flex-1 flex items-center justify-center gap-2">
              <FiShoppingBag size={18} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={!inStock} className="btn-primary flex-1">
              Buy Now
            </button>
          </div>

          <button onClick={handleWhatsApp} className="btn-whatsapp w-full">
            <span className="text-xl">💬</span> Order via WhatsApp
          </button>

          {/* Trust badges */}
          <div className="flex gap-4 mt-6 pt-5 border-t border-cream-200">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <FiTruck size={15} className="text-maroon-600" /> Free shipping ₹999+
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <FiShield size={15} className="text-maroon-600" /> 7-day returns
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-maroon-900 font-semibold">
            Customer Reviews ({product.numReviews})
          </h2>
          {user && (
            <button onClick={() => setReviewTab(!reviewTab)} className="btn-outline text-sm py-2">
              {reviewTab ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {/* Write review form */}
        {reviewTab && user && (
          <form onSubmit={submitReview} className="bg-cream-100 rounded-2xl p-6 mb-6 animate-slide-up">
            <h3 className="font-semibold text-gray-800 mb-4">Your Review</h3>
            <div className="mb-4">
              <p className="label">Rating</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= rating ? 'text-gold-500' : 'text-gray-300'}`}>★</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Comment</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="input-field resize-none" placeholder="Share your experience with this product..." required />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews list */}
        {product.reviews?.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews?.map((r) => (
              <div key={r._id} className="bg-white rounded-xl p-5 border border-cream-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{r.name}</p>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <p className="text-gray-600 text-sm mt-2">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
