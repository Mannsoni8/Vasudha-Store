import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { orderAPI } from '../utils/api';
import { formatPrice, STATUS_COLORS } from '../utils/helpers';
import { PageLoader, EmptyState } from '../components/common';

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getMy()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="section-title mb-2">My Orders</h1>
      <p className="text-gray-500 text-sm mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          subtitle="Your orders will appear here after you shop"
          action={<Link to="/products" className="btn-primary mt-3 inline-block">Start Shopping</Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
              {/* Order header */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 p-5 cursor-pointer hover:bg-cream-50 transition-colors"
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-maroon-100 rounded-full flex items-center justify-center">
                    <FiPackage size={18} className="text-maroon-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs px-3 py-1 ${STATUS_COLORS[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <span className="font-display font-bold text-maroon-800">{formatPrice(order.totalPrice)}</span>
                  {expanded === order._id ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {/* Order items (expanded) */}
              {expanded === order._id && (
                <div className="border-t border-cream-200 p-5 animate-fade-in">
                  {/* Progress tracker */}
                  <OrderProgress status={order.orderStatus} />

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {order.orderItems.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <img
                          src={item.image || `https://placehold.co/64x80/F9F3E3/8B1A2E?text=P`}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded-xl bg-cream-100"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`} · Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-maroon-800 text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="bg-cream-100 rounded-xl p-4 text-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-500 text-xs">Shipping to</p>
                        <p className="font-semibold text-gray-800 text-xs mt-0.5">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Payment</p>
                        <p className="font-semibold text-gray-800 text-xs mt-0.5">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Shipping</p>
                        <p className={`font-semibold text-xs mt-0.5 ${order.shippingPrice === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                          {order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Total</p>
                        <p className="font-display font-bold text-maroon-800 mt-0.5">{formatPrice(order.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Order Progress Tracker ──────────────────────────
const STEPS = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

function OrderProgress({ status }) {
  if (status === 'Cancelled') return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-center text-sm text-red-700 font-semibold">
      ❌ This order has been cancelled
    </div>
  );

  const currentIdx = STEPS.indexOf(status);

  return (
    <div className="flex items-center mb-6">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i <= currentIdx ? 'bg-maroon-800 border-maroon-800 text-white' : 'border-gray-200 text-gray-400'
            }`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i <= currentIdx ? 'text-maroon-800' : 'text-gray-400'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentIdx ? 'bg-maroon-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
