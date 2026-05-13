import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ── Spinner ──────────────────────────────────────────
export function Spinner({ size = 'md', color = 'maroon' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = { maroon: 'border-maroon-800', gold: 'border-gold-500', white: 'border-white' };
  return (
    <div className={`${sizes[size]} ${colors[color]} border-4 border-t-transparent rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-maroon-600 font-body text-sm animate-pulse">Loading...</p>
    </div>
  );
}

// ── Skeleton Card ─────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-cream-200">
      <div className="skeleton h-64 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-5 w-1/3 rounded mt-2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// ── Empty State ──────────────────────────────────────
export function EmptyState({ icon = '🌸', title, subtitle, action }) {
  return (
    <div className="text-center py-16 px-4 animate-fade-in">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="font-display text-2xl text-maroon-900 mb-2">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mb-6">{subtitle}</p>}
      {action}
    </div>
  );
}

// ── Protected Route ─────────────────────────────────
export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, authChecked } = useAuth();
  if (!authChecked) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

// ── Pagination ────────────────────────────────────────
export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const range = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
    range.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:border-maroon-400 disabled:opacity-40 transition-colors"
      >
        ‹ Prev
      </button>

      {range[0] > 1 && (
        <>
          <PageBtn p={1} current={page} onClick={onPageChange} />
          {range[0] > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}

      {range.map((p) => <PageBtn key={p} p={p} current={page} onClick={onPageChange} />)}

      {range[range.length - 1] < pages && (
        <>
          {range[range.length - 1] < pages - 1 && <span className="px-1 text-gray-400">…</span>}
          <PageBtn p={pages} current={page} onClick={onPageChange} />
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:border-maroon-400 disabled:opacity-40 transition-colors"
      >
        Next ›
      </button>
    </div>
  );
}

function PageBtn({ p, current, onClick }) {
  return (
    <button
      onClick={() => onClick(p)}
      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
        p === current ? 'bg-maroon-800 text-white' : 'border border-gray-200 hover:border-maroon-400 text-gray-700'
      }`}
    >
      {p}
    </button>
  );
}

// ── Star Rating ──────────────────────────────────────
export function StarRating({ rating = 0, size = 'sm' }) {
  const s = size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <div className={`flex ${s}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-gold-500' : 'text-gray-300'}>★</span>
      ))}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────
export function CategoryBadge({ category }) {
  return (
    <span className="badge bg-maroon-100 text-maroon-700">{category}</span>
  );
}
