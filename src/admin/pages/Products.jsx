import { useState } from 'react';
import { getAllProducts, patchProduct, CITIES } from '../../lib/admin-data.js';
import { inr } from '../../data/products.js';
import { PageHeader, Notice, Toggle, inputCls } from '../components/ui.jsx';

export default function Products() {
  const [items, setItems] = useState(getAllProducts);
  const update = (id, patch) => { patchProduct(id, patch); setItems(getAllProducts()); };
  const toggleCity = (p, c) => update(p.id, { cities: { ...p.cities, [c]: !p.cities[c] } });
  return (
    <>
      <PageHeader title="Products" sub="Availability and price. Stored in this browser (key dh_admin_products)." />
      <Notice>Prototype: changes are stored in this browser; production would publish to the database. Cities are demo geographies.</Notice>
      <div className="grid gap-4 mt-4">
        {items.map((p) => (
          <article key={p.id} className="card p-4 flex flex-col md:flex-row gap-4">
            <img src={p.image} alt="" className="w-24 h-24 object-cover rounded-xl bg-cream-2 shrink-0" />
            <div className="flex-1 min-w-0 space-y-3">
              <div><h2 className="font-semibold text-brand-dark">{p.name}</h2><p className="text-sm text-ink-soft">{p.variant}</p></div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm flex items-center gap-2">Price (INR)
                  <input type="number" min="0" className={`${inputCls} !w-28`} value={p.price} onChange={(e) => update(p.id, { price: Math.max(0, Number(e.target.value)) })} />
                </label>
                <span className="text-xs text-ink-soft">Currently {inr(p.price)}</span>
                <label className="flex items-center gap-2 text-sm">Available<Toggle checked={p.available} onChange={(v) => update(p.id, { available: v })} label={`${p.name} available`} /></label>
              </div>
              <div>
                <div className="text-xs font-medium mb-1.5">Available in</div>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => <button key={c} type="button" aria-pressed={p.cities[c]} className="chip" onClick={() => toggleCity(p, c)}>{c}</button>)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
