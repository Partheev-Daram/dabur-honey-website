import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, SlidersHorizontal, Info } from 'lucide-react';
import { useSaved, useRecent } from '../lib/store.js';
import { getRecipe } from '../data/recipes.js';
import SavedRecipeRow from '../components/info/SavedRecipeRow.jsx';
import ConsentControls from '../components/info/ConsentControls.jsx';

function readOrders() {
  try {
    const v = JSON.parse(localStorage.getItem('dh_orders') || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

function Empty({ text, cta = true }) {
  return (
    <div className="card p-8 text-center">
      <Heart className="mx-auto text-honey-deep" size={36} aria-hidden="true" />
      <p className="mt-3 text-ink-soft">{text}</p>
      {cta && <Link to="/recipes" className="btn btn-primary mt-5">Explore Recipes</Link>}
    </div>
  );
}

function Grid({ ids, saved }) {
  const list = ids.map(getRecipe).filter(Boolean);
  if (!list.length) return null;
  return (
    <div className="grid gap-3 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {list.map((r) => <SavedRecipeRow key={r.id} recipe={r} saved={saved.includes(r.id)} />)}
    </div>
  );
}

export default function Saved() {
  const saved = useSaved();
  const recent = useRecent();
  const [section, setSection] = useState('recipes');
  const [tab, setTab] = useState('saved');
  const orders = section === 'orders' ? readOrders() : [];
  const savedList = saved.filter((id) => getRecipe(id));
  const recentList = recent.filter((id) => getRecipe(id));

  const side = [
    ['recipes', 'Saved Recipes', Heart],
    ['orders', 'My Orders', Package],
    ['prefs', 'Preferences', SlidersHorizontal],
  ];

  return (
    <div className="container-x py-6 md:py-10">
      <h1 className="h-display text-4xl md:text-5xl">My Recipes</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
        <Info size={16} aria-hidden="true" /> Saved on this device. Create an account later to sync.
      </p>

      <div className="mt-6 grid md:grid-cols-[220px_1fr] gap-6 md:gap-10">
        <nav aria-label="My Account" className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
          <b className="hidden md:block font-display text-brand-dark mb-1">My Account</b>
          {side.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={section === id}
              onClick={() => setSection(id)}
              className={`chip md:justify-start md:rounded-xl md:w-full md:py-3 ${section === id ? 'active' : ''}`}
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>

        <section aria-live="polite">
          {section === 'recipes' && (
            <>
              <div role="tablist" aria-label="Recipe lists" className="flex gap-2 mb-5">
                <button role="tab" aria-selected={tab === 'saved'} className={`chip ${tab === 'saved' ? 'active' : ''}`} onClick={() => setTab('saved')}>Saved ({savedList.length})</button>
                <button role="tab" aria-selected={tab === 'recent'} className={`chip ${tab === 'recent' ? 'active' : ''}`} onClick={() => setTab('recent')}>Recently viewed</button>
              </div>
              {tab === 'saved' ? (
                savedList.length ? <Grid ids={savedList} saved={saved} /> : <Empty text="Save recipes to build your personal collection." />
              ) : (
                recentList.length ? <Grid ids={recentList} saved={saved} /> : <Empty text="Recipes you open will show up here." />
              )}
            </>
          )}

          {section === 'orders' && (
            orders.length === 0 ? (
              <Empty text="No orders yet. Orders placed on this device will appear here." cta={false} />
            ) : (
              <ul className="grid gap-3">
                {orders.map((o) => (
                  <li key={o.id} className="card p-4">
                    <div className="flex justify-between gap-3 font-semibold">
                      <span>Order {o.id}</span>
                      <span>₹{o.total}</span>
                    </div>
                    {(o.at || o.date) && <p className="text-sm text-ink-soft">{new Date(o.at || o.date).toLocaleDateString()}</p>}
                    <ul className="mt-2 text-sm text-ink-soft">
                      {(o.items || []).map((it, i) => <li key={i}>{it.name} × {it.qty}</li>)}
                    </ul>
                  </li>
                ))}
              </ul>
            )
          )}

          {section === 'prefs' && (
            <div className="card p-5 md:p-6">
              <h2 className="section-title">Preferences</h2>
              <p className="mt-2 mb-4 text-sm text-ink-soft">Choose whether anonymous analytics may be used. Your saved recipes and cart stay on this device.</p>
              <ConsentControls />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
