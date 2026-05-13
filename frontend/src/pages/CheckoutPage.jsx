import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiSmartphone } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { formatPrice, buildWhatsAppMessage } from '../utils/helpers';
import { EmptyState } from '../components/common';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'COD',       label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'WhatsApp',  label: 'Order via WhatsApp', icon: '💬', desc: 'Confirm & pay via WhatsApp' },
  { id: 'Online',    label: 'Online Payment',   icon: '💳', desc: 'UPI / Cards / NetBanking' },
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919462062626';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=address 2=payment 3=confirm
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [address, setAddress] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    street:  user?.address?.street  || '',
    city:    user?.address?.city    || '',
    state:   user?.address?.state   || 'Gujarat',
    pincode: user?.address?.pincode || '',
  });
  const [payment, setPayment] = useState('COD');
  const [notes, setNotes]     = useState('');

  const items     = cart.items || [];
  const shipping  = cartTotal > 999 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  const handleAddress = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const validateAddress = () => {
    const { name, phone, street, city, state, pincode } = address;
    if (!name || !phone || !street || !city || !state || !pincode) {
      toast.error('Please fill all address fields'); return false;
    }
    if (!/^\d{10}$/.test(phone)) { toast.error('Enter a valid 10-digit phone number'); return false; }
    if (!/^\d{6}$/.test(pincode)) { toast.error('Enter a valid 6-digit pincode'); return false; }
    return true;
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product:  i.product._id,
        name:     i.product.name,
        image:    i.product.images?.[0]?.url || '',
        price:    i.product.discountPrice > 0 ? i.product.discountPrice : i.product.price,
        quantity: i.quantity,
        size:     i.size,
        color:    i.color,
      }));

      const { data } = await orderAPI.create({ orderItems, shippingAddress: address, paymentMethod: payment, notes });
      setPlacedOrder(data.order);
      await clearCart();

      if (payment === 'WhatsApp') {
        const msg = buildWhatsAppMessage(orderItems, grandTotal, address);
        setTimeout(() => window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank'), 800);
      }

      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  // Empty cart guard
  if (items.length === 0 && !placedOrder) return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <EmptyState icon="🛒" title="Your cart is empty" subtitle="Add items before checking out"
        action={<Link to="/products" className="btn-primary mt-3 inline-block">Shop Now</Link>} />
    </div>
  );

  // ── Step 3: Success ────────────────────────────────
  if (step === 3 && placedOrder) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheckCircle size={48} className="text-green-600" />
      </div>
      <h1 className="font-display text-4xl text-maroon-900 font-bold mb-3">Order Placed! 🌸</h1>
      <p className="text-gray-600 mb-2">Namaste, <span className="font-semibold">{user?.name}</span>! Your order has been received.</p>
      <p className="text-gray-500 text-sm mb-8">Order ID: <span className="font-mono text-maroon-700 font-semibold">#{placedOrder._id?.slice(-8).toUpperCase()}</span></p>

      <div className="bg-cream-100 rounded-2xl p-6 text-left mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between"><span>Items</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-cream-200 text-base">
            <span>Total</span><span className="text-maroon-800">{formatPrice(grandTotal)}</span>
          </div>
          <div className="flex justify-between pt-1"><span>Payment</span><span className="font-semibold">{payment}</span></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders" className="btn-primary">Track My Orders</Link>
        <Link to="/" className="btn-outline">Continue Shopping</Link>
        {payment === 'WhatsApp' && (
          <a href={`https://wa.me/${WHATSAPP}?text=${buildWhatsAppMessage(
            items.map(i => ({ name: i.product?.name, size: i.size, quantity: i.quantity, price: i.product?.discountPrice || i.product?.price })),
            grandTotal, address
          )}`} target="_blank" rel="noreferrer" className="btn-whatsapp">
            💬 Confirm on WhatsApp
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10 max-w-sm">
        {['Address', 'Payment', 'Confirm'].map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-maroon-800' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                i + 1 < step  ? 'bg-maroon-800 border-maroon-800 text-white' :
                i + 1 === step ? 'border-maroon-800 text-maroon-800 bg-white' :
                'border-gray-200 text-gray-400 bg-white'
              }`}>{i + 1 < step ? '✓' : i + 1}</div>
              <span className="text-xs font-semibold hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-2 ${i + 1 < step ? 'bg-maroon-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form area */}
        <div className="lg:col-span-2">

          {/* ── Step 1: Address ─────────────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-cream-200 p-6 animate-fade-in">
              <h2 className="font-display text-xl font-semibold mb-5 flex items-center gap-2">
                <FiTruck size={20} className="text-maroon-700" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input name="name" value={address.name} onChange={handleAddress} className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input name="phone" value={address.phone} onChange={handleAddress} className="input-field" placeholder="10-digit mobile number" maxLength={10} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Street Address *</label>
                  <input name="street" value={address.street} onChange={handleAddress} className="input-field" placeholder="House no, Building, Street, Area" />
                </div>
                <div>
                  <label className="label">City *</label>
                  <input name="city" value={address.city} onChange={handleAddress} className="input-field" placeholder="City" />
                </div>
                <div>
                  <label className="label">State *</label>
                  <select name="state" value={address.state} onChange={handleAddress} className="input-field">
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Pincode *</label>
                  <input name="pincode" value={address.pincode} onChange={handleAddress} className="input-field" placeholder="6-digit pincode" maxLength={6} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Order Notes (Optional)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field resize-none" placeholder="Any special instructions..." />
                </div>
              </div>
              <button
                onClick={() => { if (validateAddress()) setStep(2); }}
                className="btn-primary mt-6 w-full sm:w-auto px-10"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ── Step 2: Payment ─────────────────────── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-cream-200 p-6 animate-fade-in">
              <h2 className="font-display text-xl font-semibold mb-5 flex items-center gap-2">
                <FiSmartphone size={20} className="text-maroon-700" /> Payment Method
              </h2>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      payment === m.id ? 'border-maroon-600 bg-maroon-50' : 'border-gray-200 hover:border-maroon-200'
                    }`}
                  >
                    <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-maroon-800" />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{m.label}</p>
                      <p className="text-sm text-gray-500">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {payment === 'Online' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-800">
                  💡 Online payment gateway integration (Razorpay/Stripe) can be added. For now, confirming the order and paying on delivery is also available.
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setStep(1)} className="btn-outline px-6">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary px-10">Review Order →</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirm ─────────────────────── */}
          {step === 3 && !placedOrder && (
            <div className="bg-white rounded-2xl border border-cream-200 p-6 animate-fade-in space-y-5">
              <h2 className="font-display text-xl font-semibold">Review & Confirm</h2>

              {/* Address review */}
              <div className="bg-cream-100 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm text-gray-700">Delivering to</p>
                  <button onClick={() => setStep(1)} className="text-xs text-maroon-700 font-semibold hover:underline">Edit</button>
                </div>
                <p className="text-sm text-gray-800 font-semibold">{address.name} · {address.phone}</p>
                <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} — {address.pincode}</p>
              </div>

              {/* Payment review */}
              <div className="bg-cream-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm text-gray-700">Payment</p>
                    <p className="text-sm text-gray-800 font-semibold">{PAYMENT_METHODS.find(m => m.id === payment)?.label}</p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs text-maroon-700 font-semibold hover:underline">Change</button>
                </div>
              </div>

              {/* Items review */}
              <div>
                <p className="font-semibold text-sm text-gray-700 mb-3">Order Items</p>
                <div className="space-y-3">
                  {items.map((item) => {
                    const p = item.product;
                    const price = p.discountPrice > 0 ? p.discountPrice : p.price;
                    return (
                      <div key={item._id} className="flex gap-3 items-center">
                        <img src={p.images?.[0]?.url || `https://placehold.co/60x75/F9F3E3/8B1A2E?text=P`} alt={p.name} className="w-14 h-16 object-cover rounded-lg bg-cream-100" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-500">{item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`} · Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-maroon-800 text-sm">{formatPrice(price * item.quantity)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap pt-2">
                <button onClick={() => setStep(2)} className="btn-outline px-6">← Back</button>
                <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1 sm:flex-none px-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                  ) : (
                    <><FiCheckCircle size={18} /> Place Order</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-cream-200 p-6 sticky top-24">
            <h3 className="font-display text-lg font-semibold mb-4">Price Details</h3>
            <div className="space-y-2.5 text-sm text-gray-600 mb-4">
              {items.map((item) => {
                const p = item.product;
                const price = p.discountPrice > 0 ? p.discountPrice : p.price;
                return (
                  <div key={item._id} className="flex justify-between gap-2">
                    <span className="line-clamp-1 flex-1">{p.name} × {item.quantity}</span>
                    <span className="font-semibold shrink-0">{formatPrice(price * item.quantity)}</span>
                  </div>
                );
              })}
              <div className="border-t border-cream-200 pt-2.5 flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t border-cream-200 pt-2.5 flex justify-between text-base">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-display font-bold text-maroon-800 text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700 font-semibold text-center">
              ✅ Safe & Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
