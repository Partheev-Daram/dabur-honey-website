import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, PRODUCT_FILTERS } from '../data/products.js';
import ProductCard from '../components/shop/ProductCard.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const family = params.get('family') || 'all';
  const list = family === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.family === family);
  const pick = (id) => setParams(id === 'all' ? {} : { family: id });
  return (
    <div className="container-x py-6 md:py-10">
      <h1 className="h-display text-3xl md:text-5xl">Shop Dabur Honey</h1>
      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0" role="tablist" aria-label="Product families">
        {PRODUCT_FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={family === f.id} aria-pressed={family === f.id} className="chip" onClick={() => pick(f.id)}>{f.label}</button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {list.length === 0 && <p className="mt-8 text-ink-soft">No products in this category yet.</p>}
      <p className="mt-8 text-xs text-ink-soft">Prices and availability are illustrative and may vary by location. Orders in this prototype are simulated.</p>
    </div>
  );
}
