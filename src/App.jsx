import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Recipes = lazy(() => import('./pages/Recipes.jsx'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail.jsx'));
const HoneySnap = lazy(() => import('./pages/HoneySnap.jsx'));
const Shop = lazy(() => import('./pages/Shop.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Discover = lazy(() => import('./pages/Discover.jsx'));
const Saved = lazy(() => import('./pages/Saved.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

export default function App() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-ink-soft">Loading…</div>}>
      <Routes>
        {/* Admin has its own shell */}
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="honeysnap" element={<HoneySnap />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="discover" element={<Discover />} />
          <Route path="saved" element={<Saved />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
