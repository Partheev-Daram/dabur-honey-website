import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Heart, ShoppingBag, ShoppingCart, Search, User, QrCode } from 'lucide-react';
import Logo from './Logo.jsx';
import ConsentBanner from './ConsentBanner.jsx';
import { useCart, useSaved, track } from '../lib/store.js';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/recipes', label: 'Recipes' },
  { to: '/honeysnap', label: 'HoneySnap', badge: 'NEW' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Honey' },
];

function Header() {
  const cart = useCart();
  const saved = useSaved();
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const navigate = useNavigate();
  const link = ({ isActive }) =>
    `relative px-1 py-2 text-[15px] font-medium hover:text-brand ${isActive ? 'text-brand after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[3px] after:rounded after:bg-brand' : 'text-ink'}`;
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-line">
      <div className="container-x flex items-center justify-between h-14 md:h-[68px]">
        <Link to="/" aria-label="Dabur Honey home"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={link}>
              {n.label}
              {n.badge && <span className="ml-1.5 align-middle text-[10px] font-bold bg-honey text-ink rounded px-1.5 py-0.5">{n.badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button className="p-2.5 rounded-full hover:bg-cream-2" aria-label="Search recipes" onClick={() => navigate('/recipes?focus=search')}><Search size={20} /></button>
          <Link to="/saved" className="relative p-2.5 rounded-full hover:bg-cream-2 hidden md:block" aria-label="Saved recipes">
            <User size={20} />
            {saved.length > 0 && <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-honey text-[10px] font-bold grid place-items-center">{saved.length}</span>}
          </Link>
          <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-cream-2" aria-label={`Cart, ${count} items`}>
            <ShoppingCart size={20} />
            {count > 0 && <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] font-bold grid place-items-center">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const cart = useCart();
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const item = ({ isActive }) => `flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isActive ? 'text-brand' : 'text-ink-soft'}`;
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line grid" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Primary">
      <div className="flex">
        <NavLink to="/" end className={item}><Home size={22} />Home</NavLink>
        <NavLink to="/recipes" className={item}><BookOpen size={22} />Recipes</NavLink>
        <NavLink to="/discover" className={item}><span className="-mt-5 grid place-items-center w-12 h-12 rounded-full bg-brand text-white shadow-lg ring-4 ring-cream"><QrCode size={22} /></span><span className="-mt-0.5">Scan</span></NavLink>
        <NavLink to="/saved" className={item}><Heart size={22} />Saved</NavLink>
        <NavLink to="/shop" className={item}>
          <span className="relative"><ShoppingBag size={22} />{count > 0 && <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] font-bold grid place-items-center">{count}</span>}</span>Shop
        </NavLink>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-dark text-cream mt-16">
      <div className="container-x py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size="lg" className="[&>span:first-child]:bg-white [&>span:first-child]:!text-brand [&>span:last-child]:!text-cream" />
          <p className="mt-3 text-sm text-cream/80 max-w-sm">Simple everyday recipes and honey for every occasion. A prototype experience — product availability and pricing are illustrative.</p>
        </div>
        <div className="text-sm grid gap-2 content-start">
          <b className="text-white">Explore</b>
          <Link to="/recipes">Recipes</Link><Link to="/honeysnap">HoneySnap</Link><Link to="/shop">Shop</Link><Link to="/about">About Honey</Link>
        </div>
        <div className="text-sm grid gap-2 content-start">
          <b className="text-white">Info</b>
          <Link to="/privacy">Privacy &amp; Consent</Link><Link to="/saved">My Recipes</Link><Link to="/admin">Admin (demo)</Link>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-cream/70 px-4">
        Recipes describe food usage only; honey is not a medicine. © Dabur Honey prototype.
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); track('page_view', { path: pathname }); }, [pathname]);
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pb-safe md:pb-0"><Outlet /></main>
      <Footer />
      <BottomNav />
      <ConsentBanner />
    </div>
  );
}
