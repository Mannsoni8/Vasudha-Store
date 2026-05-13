import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { orderAPI } from '../../utils/api';
import { formatPrice, STATUS_COLORS, ORDER_STATUSES } from '../../utils/helpers';
import { Spinner, Pagination } from '../common';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders,     setOrders]     = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [status,     setStatus]     = useState('');
  const [page,       setPage]       = useState(1);
  const [expanded,   setExpanded]   = useState(null);
  const [updating,   setUpdating]   = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getAll({ status, page, limit: 15 });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [status, page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch { toast.error('Status update failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm">{pagination.total || 0} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-auto py-2.5 text-sm">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-400">
            <FiSearch size={40} className="mx-auto mb-3 opacity-30" />
            <p>No orders found</p>
          </div>
        ) : orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Row */}
            <div
              className="flex flex-wrap items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            >
              <div className="flex-1 min-w-[180px]">
                <p className="font-mono text-xs font-bold text-maroon-700">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{order.user?.name}</p>
                <p className="text-xs text-gray-400">{order.user?.email}</p>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-800">{formatPrice(order.totalPrice)}</p>
                <p className="text-xs">{order.paymentMethod}</p>
              </div>

              <div>
                <span className={`badge text-xs px-3 py-1.5 ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
              </div>

              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              {expanded === order._id
                ? <FiChevronUp size={18} className="text-gray-400 ml-auto" />
                : <FiChevronDown size={18} className="text-gray-400 ml-auto" />
              }
            </div>

            {/* Expanded detail */}
            {expanded === order._id && (
              <div className="border-t border-gray-100 p-5 animate-fade-in space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Shipping */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ship To</p>
                    <p className="font-semibold text-sm text-gray-800">{order.shippingAddress?.name}</p>
                    <p className="text-xs text-gray-600">{order.shippingAddress?.phone}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {order.shippingAddress?.street},<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment</p>
                    <p className="font-semibold text-sm text-gray-800">{order.paymentMethod}</p>
                    <span className={`badge text-xs mt-1 ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.paymentStatus}
                    </span>
                    {order.notes && <p className="text-xs text-gray-500 mt-2 italic">"{order.notes}"</p>}
                  </div>

                  {/* Update Status */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Update Status</p>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="input-field py-2 text-sm"
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {updating === order._id && (
                      <p className="text-xs text-maroon-600 mt-1 flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-maroon-600 border-t-transparent rounded-full animate-spin inline-block" /> Updating...
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Order Items ({order.orderItems.length})</p>
                  <div className="space-y-2">
                    {order.orderItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <img src={item.image || `https://placehold.co/48x60/F9F3E3/8B1A2E?text=P`} alt={item.name} className="w-12 h-14 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`} · Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-maroon-800 text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="bg-maroon-50 rounded-xl p-4 min-w-[200px] text-sm space-y-1.5">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
                    <div className="flex justify-between font-bold text-maroon-800 border-t border-maroon-200 pt-1.5">
                      <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
    </div>
  );
}
