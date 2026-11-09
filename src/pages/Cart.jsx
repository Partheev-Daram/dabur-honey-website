import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart, setQty, removeFromCart, track } from '../lib/store.js';
import { getProduct, inr, DELIVERY_FEE, FREE_DELIVERY_ABOVE } from '../data/products.js';

export function cartTotals(cart) {
  const subtotal = cart.reduce((s, i) => s + (getProduct(i.id)?.price || 0) * i.qty, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery };
}

export default function Cart() {
  const cart = useCart().filter((i) => getProduct(i.id));
  const navigate = useNavigate();
  const { subtotal, delivery, total } = cartTotals(cart);
  const proceed = () => { track('begin_checkout', { value: total }); navigate('/checkout'); };

  if (cart.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <ShoppingBag size={56} className="mx-auto text-honey-deep" aria-hidden="true" />
        <h1 className="h-display text-3xl mt-4">Your cart is empty</h1>
        <p className="text-ink-soft mt-2">Add some honey to get started.</p>
        <Link to="/shop" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  const Summary = ({ cta }) => (
    <div className="card p-5">
      <h2 className="font-semibold text-lg">Order Summary</h2>
      <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
        <dt>Subtotal</dt><dd className="text-right">{inr(subtotal)}</dd>
        <dt>Delivery</dt><dd className="text-right">{delivery === 0 ? <span className="text-leaf font-semibold">Free</span> : inr(delivery)}</dd>
        <dt className="font-bold text-base pt-2 border-t border-line">Total</dt><dd className="font-bold text-base text-right pt-2 border-t border-line">{inr(total)}</dd>
      </dl>
      {delivery > 0 && <p className="text-xs text-ink-soft mt-2">Free delivery on orders of {inr(FREE_DELIVERY_ABOVE)} and above.</p>}
      {cta && <button className="btn btn-primary w-full mt-4" onClick={proceed}>Proceed to Checkout →</button>}
    </div>
  );

  return (
    <div className="container-x py-6 md:py-10">
      <h1 className="h-display text-3xl md:text-5xl">Your Cart</h1>
      <div className="mt-6 grid md:grid-cols-[1fr_340px] gap-6 items-start">
        <ul className="grid gap-3">
          {cart.map((i) => {
            const p = getProduct(i.id);
            return (
              <li key={i.id} className="card p-3 flex gap-3">
                <img src={p.image} alt={p.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-cream-2" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-semibold leading-tight">{p.name}</h3>
                      <p className="text-sm text-ink-soft">{p.variant}</p>
                    </div>
                    <button onClick={() => removeFromCart(i.id)} aria-label={`Remove ${p.name} ${p.variant}`} className="p-2.5 -m-1 h-11 w-11 grid place-items-center rounded-full text-ink-soft hover:text-brand hover:bg-brand-soft"><Trash2 size={18} /></button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center border border-line rounded-full">
                      <button className="h-11 w-11 grid place-items-center" aria-label="Decrease quantity" onClick={() => setQty(i.id, i.qty - 1)}><Minus size={16} /></button>
                      <span className="w-8 text-center font-semibold" aria-live="polite">{i.qty}</span>
                      <button className="h-11 w-11 grid place-items-center" aria-label="Increase quantity" onClick={() => setQty(i.id, i.qty + 1)}><Plus size={16} /></button>
                    </div>
                    <span className="font-bold text-brand-dark">{inr(p.price * i.qty)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="md:sticky md:top-24">
          <Summary cta={false} />
          <button className="btn btn-primary w-full mt-4 hidden md:inline-flex" onClick={proceed}>Proceed to Checkout →</button>
        </div>
      </div>
      <div className="md:hidden fixed inset-x-0 z-30 bg-white border-t border-line p-3 flex items-center gap-3" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 60px)' }}>
        <div className="leading-tight"><div className="text-xs text-ink-soft">Total</div><div className="font-bold">{inr(total)}</div></div>
        <button className="btn btn-primary flex-1" onClick={proceed}>Proceed to Checkout →</button>
      </div>
    </div>
  );
}
