import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlusCircle, FiSearch, FiStar } from 'react-icons/fi';
import { productAPI } from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import { Spinner, Pagination } from '../common';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [page,     setPage]     = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ search, category, page, limit: 10 });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search, category, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm">{pagination.total || 0} products total</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 py-2.5">
          <FiPlusCircle size={18} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="input-field pl-9 py-2.5 text-sm" />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input-field w-auto py-2.5 text-sm">
          <option value="">All Categories</option>
          {['Sarees','Kurtis','Lehengas','Dupattas','Blouses','Sets'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiSearch size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">No products found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Stock</th>
                    <th className="text-left px-4 py-3">Rating</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url || `https://placehold.co/48x60/F9F3E3/8B1A2E?text=P`}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded-lg bg-cream-100 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-gray-800 line-clamp-2 max-w-[200px]">{p.name}</p>
                            {p.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-gold-600 font-semibold">
                                <FiStar size={11} /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-maroon-100 text-maroon-700 text-xs">{p.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-maroon-800">{formatPrice(p.discountPrice || p.price)}</p>
                        {p.discountPrice > 0 && <p className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold text-xs px-2 py-1 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-gold-500 text-sm">★</span>
                          <span className="text-xs font-semibold text-gray-700">{p.rating?.toFixed(1) || '—'}</span>
                          <span className="text-xs text-gray-400">({p.numReviews})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            disabled={deleting === p._id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === p._id
                              ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
                              : <FiTrash2 size={15} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 pb-4">
              <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
