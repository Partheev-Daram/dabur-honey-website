import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { addToCart, track } from '../../lib/store.js';
import { inr } from '../../data/products.js';

export default function ProductCard({ product: p }) {
  const [added, setAdded] = useState(false);
  const add = () => {
    addToCart(p.id, 1);
    track('shop_add', { product: p.id });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };
  return (
    <article className="card flex flex-col h-full">
      <div className="relative bg-cream-2 aspect-square">
        <img src={p.image} alt={`${p.name}, ${p.variant}`} loading="lazy" className={`absolute inset-0 w-full h-full ${p.family === 'squeezy' ? 'object-contain p-3' : 'object-cover'}`} />
        {p.badge && <span className="absolute top-2 left-2 text-[10px] font-bold bg-honey text-ink rounded px-2 py-0.5">{p.badge}</span>}
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[15px] leading-tight">{p.name}</h3>
        <p className="text-sm text-ink-soft mt-0.5">{p.variant}</p>
        <p className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-bold text-brand-dark">{inr(p.price)}</span>
          {p.mrp > p.price && <span className="text-sm text-ink-soft line-through" aria-label={`MRP ${inr(p.mrp)}`}>{inr(p.mrp)}</span>}
        </p>
        <div className="mt-auto pt-3">
          {p.available === false ? (
            <button className="btn btn-outline w-full opacity-60 cursor-not-allowed !text-xs" disabled>Currently unavailable in your area</button>
          ) : (
            <button className="btn btn-primary w-full whitespace-nowrap !px-3 !text-sm" onClick={add} aria-label={`Add ${p.name} ${p.variant} to cart`}>
              {added ? <><Check size={18} /> Added ✓</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
