import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShoppingBag, FiUser, FiSearch, FiMenu, FiX,
  FiLogOut, FiSettings, FiPackage, FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useDebounce } from '../../hooks';

const NAV_LINKS = [
  { label: 'Sarees',    to: '/products?category=Sarees' },
  { label: 'Kurtis',   to: '/products?category=Kurtis' },
  { label: 'Lehengas', to: '/products?category=Lehengas' },
  { label: 'Dupattas', to: '/products?category=Dupattas' },
  { label: 'Sets',     to: '/products?category=Sets' },
  { label: 'All',      to: '/products' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount }             = useCart();
  const navigate                  = useNavigate();
  const location                  = useLocation();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const dropdownRef     = useRef(null);
  const searchRef       = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [location]);

  // Auto-focus search on open
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) { navigate(`/products?search=${encodeURIComponent(q)}`); setSearchOpen(false); setSearchQuery(''); }
  };

  const UserAvatar = ({ size = 8 }) => {
    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className={`w-${size} h-${size} rounded-full object-cover border-2 border-cream-200`}
        />
      );
    }
    return (
      <div className={`w-${size} h-${size} bg-maroon-100 rounded-full flex items-center justify-center`}>
        <span className="text-maroon-800 font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-cream-200 shadow-sm">
      {/* Announcement strip */}
      <div className="bg-maroon-800 text-cream-100 text-center text-xs py-1.5 font-body tracking-widest hidden sm:block">
        🌸 FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;·&nbsp; COD AVAILABLE &nbsp;·&nbsp; EASY 7-DAY RETURNS 🌸
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-maroon-800 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-gold-400 font-display text-base sm:text-lg font-bold">व</span>
            </div>
            <div className="hidden xs:block">
              <p className="font-display text-maroon-900 font-semibold text-lg sm:text-xl leading-none">Vasudha</p>
              <p className="font-hindi text-gold-600 text-xs leading-none hidden sm:block">वसुधा स्टोर</p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="font-body text-xs font-semibold text-gray-600 hover:text-maroon-800 transition-colors tracking-wide uppercase px-3 py-2 rounded-lg hover:bg-cream-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-maroon-800 hover:bg-cream-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-maroon-800 hover:bg-cream-100 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-maroon-800 text-white text-xs rounded-full flex items-center justify-center font-bold animate-fade-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 p-1 rounded-lg hover:bg-cream-100 transition-colors"
                  aria-label="Account"
                >
                  <UserAvatar size={8} />
                  <FiChevronDown
                    size={14}
                    className={`text-gray-500 hidden sm:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-cream-200 py-2 animate-fade-in z-50">
                    <div className="px-4 py-2.5 border-b border-cream-200 flex items-center gap-3">
                      <UserAvatar size={9} />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.authProvider === 'google' && (
                          <span className="text-xs text-blue-500 font-medium">via Google</span>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream-100 transition-colors"
                    >
                      <FiPackage size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-maroon-700 hover:bg-cream-100 transition-colors font-semibold"
                      >
                        <FiSettings size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-cream-200 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <FiLogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FiUser size={15} /> Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-cream-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (slides in below) */}
        {searchOpen && (
          <div className="pb-3 animate-slide-up">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, kurtis, lehengas..."
                className="input-field flex-1 text-sm py-2.5"
              />
              <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
                Search
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500"
              >
                <FiX size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-cream-200 animate-slide-up">
            <ul className="flex flex-col gap-0.5 mt-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="block px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-cream-100 hover:text-maroon-800 rounded-lg transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <div className="border-t border-cream-200 mt-2 pt-2">
                {!user ? (
                  <Link
                    to="/login"
                    className="block px-3 py-2.5 text-sm font-semibold text-maroon-800 hover:bg-cream-100 rounded-lg transition-colors"
                  >
                    <FiUser className="inline mr-2" size={14} />Login / Sign Up
                  </Link>
                ) : (
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                )}
              </div>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
