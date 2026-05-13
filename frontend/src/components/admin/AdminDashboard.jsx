import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiPackage, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { orderAPI, productAPI, authAPI } from '../../utils/api';
import { formatPrice, STATUS_COLORS } from '../../utils/helpers';
import { Spinner } from '../common';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderAPI.getAll({ limit: 5 }),
      productAPI.getAll({ limit: 1 }),
      authAPI.getAllUsers(),
    ]).then(([ordRes, prodRes, userRes]) => {
      setOrders(ordRes.data.orders);
      setStats({
        totalOrders:   ordRes.data.pagination.total,
        totalRevenue:  ordRes.data.totalRevenue,
        totalProducts: prodRes.data.pagination.total,
        totalCustomers: userRes.data.count,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  const STAT_CARDS = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: FiTrendingUp, color: 'bg-green-50 text-green-700', iconBg: 'bg-green-100' },
    { label: 'Total Orders',  value: stats?.totalOrders || 0,               icon: FiPackage,    color: 'bg-blue-50 text-blue-700',  iconBg: 'bg-blue-100' },
    { label: 'Products',      value: stats?.totalProducts || 0,             icon: FiShoppingBag,color: 'bg-maroon-50 text-maroon-700', iconBg: 'bg-maroon-100' },
    { label: 'Customers',     value: stats?.totalCustomers || 0,            icon: FiUsers,      color: 'bg-gold-50 text-gold-700',  iconBg: 'bg-gold-100' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening in your store.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, iconBg }) => (
          <div key={label} className={`${color} rounded-2xl p-5 border border-opacity-20`}>
            <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-display font-bold">{value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-semibold text-gray-800 text-lg">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-maroon-700 font-semibold hover:text-maroon-600 flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">Order</th>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
              ) : orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-semibold text-maroon-700 text-xs">
                    #{o._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-gray-700">{o.user?.name}</p>
                    <p className="text-xs text-gray-400">{o.user?.email}</p>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-gray-800">{formatPrice(o.totalPrice)}</td>
                  <td className="px-6 py-3.5">
                    <span className={`badge px-2.5 py-1 text-xs ${STATUS_COLORS[o.orderStatus]}`}>{o.orderStatus}</span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/products/new" className="bg-maroon-800 text-white rounded-2xl p-5 hover:bg-maroon-700 transition-colors group">
          <FiShoppingBag size={24} className="mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-display font-semibold text-lg">Add New Product</p>
          <p className="text-cream-300 text-sm mt-1">Upload images, set price & inventory</p>
        </Link>
        <Link to="/admin/orders" className="bg-gold-600 text-white rounded-2xl p-5 hover:bg-gold-700 transition-colors group">
          <FiPackage size={24} className="mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-display font-semibold text-lg">Manage Orders</p>
          <p className="text-gold-100 text-sm mt-1">Update status, view details</p>
        </Link>
      </div>
    </div>
  );
}
