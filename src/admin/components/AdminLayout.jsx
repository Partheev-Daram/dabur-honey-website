import { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, BookOpen, Package, QrCode, Settings, Menu, X, ArrowLeft } from 'lucide-react';
import Logo from '../../components/Logo.jsx';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/recipes', label: 'Recipes', icon: BookOpen },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/campaigns', label: 'Campaigns / QR', icon: QrCode },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function Nav({ onNavigate }) {
  return (
    <nav className="space-y-1" aria-label="Admin">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={onNavigate}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 min-h-[44px] text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-ink hover:bg-cream-2'}`}>
          <Icon size={18} />{label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const title = NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))?.label || 'Admin';
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden md:flex md:w-60 shrink-0 flex-col gap-6 bg-white border-r border-line p-4 sticky top-0 h-screen">
        <Logo />
        <Nav />
        <Link to="/" className="mt-auto flex items-center gap-2 text-sm text-ink-soft min-h-[44px]"><ArrowLeft size={16} />Back to site</Link>
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white p-4 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between"><Logo /><button aria-label="Close menu" className="p-2" onClick={() => setOpen(false)}><X /></button></div>
            <Nav onNavigate={() => setOpen(false)} />
            <Link to="/" className="mt-auto flex items-center gap-2 text-sm text-ink-soft min-h-[44px]"><ArrowLeft size={16} />Back to site</Link>
          </div>
          <button aria-label="Close menu" className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-line">
          <div className="flex items-center gap-3 px-4 md:px-8 h-14">
            <button className="md:hidden p-2 -ml-2" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button>
            <span className="md:hidden"><Logo size="sm" /></span>
            <span className="hidden md:inline font-semibold text-brand-dark">{title}</span>
            <span className="ml-auto text-xs font-semibold bg-honey text-ink rounded-full px-3 py-1">Admin</span>
          </div>
          <div className="bg-brand-soft text-brand-dark text-xs md:text-sm px-4 md:px-8 py-1.5 text-center">Demo admin — no authentication in this prototype</div>
        </header>
        <main className="px-4 md:px-8 py-6 max-w-6xl"><Outlet /></main>
      </div>
    </div>
  );
}
