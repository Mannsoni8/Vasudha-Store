import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { EmptyState, Spinner } from '../components/common';

export default function CartPage() {
  const { cart, cartTotal, cartCount, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const shipping     = cartTotal > 999 ? 0 : 99;
  const grandTotal   = cartTotal + shipping;
  const items        = cart.items || [];

  if (items.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Shopping Cart</h1>
      <EmptyState
        icon="🛍️"
        title="Your cart is empty"
        subtitle="Add some beautiful Indian wear to get started!"
        action={<Link to="/products" className="btn-primary inline-flex items-center gap-2 mt-3"><FiShoppingBag size={16}/> Shop Now</Link>}
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="section-title mb-2">Shopping Cart</h1>
      <p className="text-gray-500 text-sm mb-8">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const p       = item.product;
            if (!p) return null;
            const price   = p.discountPrice > 0 ? p.discountPrice : p.price;
            const imgUrl  = p.images?.[0]?.url || `https://placehold.co/120x150/F9F3E3/8B1A2E?text=${encodeURIComponent(p.name || 'Product')}`;

            return (
              <div key={item._id} className="bg-white rounded-2xl border border-cream-200 p-4 flex gap-4 animate-fade-in">
                <Link to={`/products/${p._id}`} className="shrink-0">
                  <img src={imgUrl} alt={p.name} className="w-24 h-28 object-cover rounded-xl bg-cream-100" />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-xs text-gold-600 font-semibold uppercase tracking-widest">{p.category}</p>
                      <Link to={`/products/${p._id}`}>
                        <h3 className="font-display font-semibold text-gray-800 hover:text-maroon-800 line-clamp-2 text-base">{p.name}</h3>
                      </Link>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        {item.size  && <span>Size: <b>{item.size}</b></span>}
                        {item.color && <span>Color: <b>{item.color}</b></span>}
                      </div>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0">
                      <FiTrash2 size={17} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : removeItem(item._id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold text-lg transition-colors"
                      >−</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= p.stock}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold text-lg transition-colors disabled:opacity-40"
                      >+</button>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-maroon-800 font-bold text-lg">{formatPrice(price * item.quantity)}</p>
                      {item.quantity > 1 && <p className="text-xs text-gray-400">{formatPrice(price)} each</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-cream-200 p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold text-gray-800 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-green-600">Add {formatPrice(999 - cartTotal)} more for free shipping!</p>
              )}
              <div className="border-t border-cream-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-800 text-base">Total</span>
                <span className="font-display font-bold text-maroon-800 text-xl">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5">
              Proceed to Checkout <FiArrowRight size={18} />
            </button>

            <Link to="/products" className="block text-center text-sm text-maroon-700 hover:text-maroon-600 font-semibold mt-4">
              ← Continue Shopping
            </Link>

            {/* COD badge */}
            <div className="mt-5 bg-green-50 rounded-xl p-3 text-center">
              <p className="text-green-700 text-xs font-semibold">✅ Cash on Delivery Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
