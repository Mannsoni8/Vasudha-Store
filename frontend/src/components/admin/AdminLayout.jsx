import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiMenu, FiX, FiLogOut, FiPlusCircle, FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin',           label: 'Dashboard',   icon: FiGrid,       end: true },
  { to: '/admin/products',  label: 'Products',    icon: FiShoppingBag },
  { to: '/admin/products/new', label: 'Add Product', icon: FiPlusCircle },
  { to: '/admin/orders',    label: 'Orders',      icon: FiPackage },
  { to: '/admin/users',     label: 'Customers',   icon: FiUsers },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-maroon-700">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">व</span>
          </div>
          <div>
            <p className="text-white font-display font-semibold text-base leading-none">Vasudha</p>
            <p className="text-gold-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                  : 'text-cream-300 hover:bg-maroon-700 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-maroon-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-cream-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-cream-400 hover:text-red-400 text-sm w-full transition-colors">
          <FiLogOut size={15} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-maroon-900 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-maroon-900 flex flex-col animate-slide-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <button onClick={() => setOpen(true)} className="md:hidden p-2 text-gray-600">
            <FiMenu size={22} />
          </button>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>Admin</span>
            <FiChevronRight size={14} />
            <span className="text-gray-800 font-semibold">Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-800 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
