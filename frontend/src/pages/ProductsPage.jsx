import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { useProducts, useDebounce } from '../hooks';
import ProductCard from '../components/common/ProductCard';
import { SkeletonGrid, EmptyState, Pagination } from '../components/common';
import { CATEGORIES, FABRICS, SORT_OPTIONS } from '../utils/helpers';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch]   = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [fabric, setFabric]   = useState(params.get('fabric') || '');
  const [sort, setSort]       = useState(params.get('sort') || '');
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [page, setPage]       = useState(Number(params.get('page')) || 1);
  const [featured, setFeatured] = useState(params.get('featured') || '');

  const debouncedSearch = useDebounce(search, 400);

  const queryParams = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category && { category }),
    ...(fabric   && { fabric }),
    ...(sort     && { sort }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(featured && { featured }),
    page,
    limit: 12,
  };

  const { products, pagination, loading, error } = useProducts(queryParams);

  // Sync URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedSearch) p.set('search', debouncedSearch);
    if (category)  p.set('category', category);
    if (fabric)    p.set('fabric', fabric);
    if (sort)      p.set('sort', sort);
    if (minPrice)  p.set('minPrice', minPrice);
    if (maxPrice)  p.set('maxPrice', maxPrice);
    if (featured)  p.set('featured', featured);
    if (page > 1)  p.set('page', page);
    setParams(p, { replace: true });
  }, [debouncedSearch, category, fabric, sort, minPrice, maxPrice, featured, page]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, category, fabric, sort, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setFabric(''); setSort('');
    setMinPrice(''); setMaxPrice(''); setFeatured(''); setPage(1);
  };

  const hasFilters = category || fabric || sort || minPrice || maxPrice || debouncedSearch || featured;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">Category</h4>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="cat" checked={!category} onChange={() => setCategory('')} className="accent-maroon-800" />
            <span className="text-sm text-gray-700">All</span>
          </label>
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)} className="accent-maroon-800" />
              <span className="text-sm text-gray-700">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fabric */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">Fabric</h4>
        <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="input-field text-sm py-2">
          <option value="">All Fabrics</option>
          {FABRICS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">Price Range</h4>
        <div className="flex gap-2">
          <input type="number" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="input-field py-2 text-sm" />
          <input type="number" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input-field py-2 text-sm" />
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full text-sm text-red-600 hover:text-red-700 font-semibold py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title">
          {category ? category : debouncedSearch ? `Search: "${debouncedSearch}"` : 'All Products'}
        </h1>
        {pagination.total !== undefined && (
          <p className="text-gray-500 text-sm mt-1">{pagination.total} products found</p>
        )}
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field flex-1 min-w-[200px] py-2.5"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-auto py-2.5 pr-9 text-sm">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition-colors md:hidden ${
            showFilters || hasFilters ? 'bg-maroon-800 text-white border-maroon-800' : 'border-gray-200 text-gray-700 hover:border-maroon-400'
          }`}
        >
          <FiFilter size={16} /> Filters {hasFilters && '•'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - desktop */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white rounded-xl p-5 border border-cream-200 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-800">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-semibold">Clear All</button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-gray-800 text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}><FiX size={22} /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products */}
        <div className="flex-1 min-w-0">
          {error ? (
            <EmptyState icon="😢" title="Could not load products" subtitle={error} />
          ) : loading ? (
            <SkeletonGrid count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No products found"
              subtitle="Try adjusting your search or filters"
              action={<button onClick={clearFilters} className="btn-primary mt-2">Clear Filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
