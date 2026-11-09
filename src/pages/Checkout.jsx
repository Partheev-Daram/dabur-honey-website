import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Info } from 'lucide-react';
import { useCart, clearCart, track } from '../lib/store.js';
import { getProduct, inr, DELIVERY_FEE, FREE_DELIVERY_ABOVE } from '../data/products.js';

const field = 'w-full rounded-xl border border-line bg-white px-3 min-h-[44px] py-2 text-[15px]';

export default function Checkout() {
  const cartRaw = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', pincode: '', payment: 'cod' });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  if (order) {
    return (
      <div className="container-x py-12 max-w-xl text-center">
        <CheckCircle2 size={56} className="mx-auto text-leaf" aria-hidden="true" />
        <h1 className="h-display text-3xl md:text-4xl mt-3">Thank you!</h1>
        <p className="text-ink-soft mt-2">Your simulated order <b className="text-ink">{order.id}</b> is placed. No payment was taken.</p>
        <div className="card p-5 mt-6 text-left text-sm">
          <ul className="grid gap-2">
            {order.items.map((i) => <li key={i.id} className="flex justify-between gap-3"><span>{i.name} ({i.variant}) × {i.qty}</span><span>{inr(i.price * i.qty)}</span></li>)}
          </ul>
          <div className="border-t border-line mt-3 pt-3 grid gap-1">
            <div className="flex justify-between"><span>Delivery</span><span>{order.delivery ? inr(order.delivery) : 'Free'}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{inr(order.total)}</span></div>
            <div className="text-ink-soft">Payment: {order.payment === 'cod' ? 'Cash on delivery' : 'UPI (simulated)'}</div>
          </div>
        </div>
        <Link to="/recipes" className="btn btn-primary mt-6">Explore recipes</Link>
      </div>
    );
  }

  const cart = cartRaw.filter((i) => getProduct(i.id));
  if (cart.length === 0) return <Navigate to="/cart" replace />;
  const subtotal = cart.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your name.';
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) er.phone = 'Enter a valid 10-digit mobile number.';
    if (form.address.trim().length < 8) er.address = 'Please enter your full address.';
    if (!/^\d{6}$/.test(form.pincode.trim())) er.pincode = 'Enter a 6-digit pincode.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const id = 'DH' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);
    const items = cart.map((i) => { const p = getProduct(i.id); return { id: i.id, name: p.name, variant: p.variant, price: p.price, qty: i.qty }; });
    const o = { id, items, subtotal, delivery, total, payment: form.payment, customer: { name: form.name, phone: form.phone, address: form.address, pincode: form.pincode }, at: Date.now() };
    try { const prev = JSON.parse(localStorage.getItem('dh_orders') || '[]'); localStorage.setItem('dh_orders', JSON.stringify([...prev, o])); } catch { /* storage unavailable */ }
    track('purchase', { value: total, items: items.map((i) => ({ id: i.id, qty: i.qty })) });
    clearCart();
    setOrder(o);
  };

  const Field = ({ k, label, ...rest }) => (
    <div>
      <label htmlFor={k} className="block text-sm font-medium mb-1">{label}</label>
      <input id={k} className={field} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? k + '-err' : undefined} {...rest} />
      {errors[k] && <p id={k + '-err'} className="text-sm text-brand mt-1">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="container-x py-6 md:py-10">
      <h1 className="h-display text-3xl md:text-5xl">Checkout</h1>
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-cream-2 border border-honey px-4 py-3 text-sm" role="note">
        <Info size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
        <span><b>Prototype — no real payment is taken.</b> Your details stay in this browser only. Never enter card or bank details.</span>
      </div>
      <div className="mt-6 grid md:grid-cols-[1fr_340px] gap-6 items-start">
        <form onSubmit={submit} noValidate className="card p-5 grid gap-4">
          <Field k="name" label="Full name" autoComplete="name" />
          <Field k="phone" label="Mobile number" inputMode="numeric" autoComplete="tel" maxLength={10} />
          <Field k="address" label="Delivery address" autoComplete="street-address" />
          <Field k="pincode" label="Pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} />
          <fieldset>
            <legend className="text-sm font-medium mb-2">Payment method</legend>
            <div className="grid gap-2">
              {[['cod', 'Cash on delivery'], ['upi', 'UPI (simulated)']].map(([v, l]) => (
                <label key={v} className="flex items-center gap-3 rounded-xl border border-line px-3 min-h-[44px] cursor-pointer">
                  <input type="radio" name="payment" value={v} checked={form.payment === v} onChange={set('payment')} className="accent-[#b3121b] w-4 h-4" />{l}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="btn btn-primary w-full">Place simulated order · {inr(total)}</button>
        </form>
        <aside className="card p-5 md:sticky md:top-24" aria-label="Order summary">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {cart.map((i) => { const p = getProduct(i.id); return <li key={i.id} className="flex justify-between gap-3"><span>{p.name} ({p.variant}) × {i.qty}</span><span>{inr(p.price * i.qty)}</span></li>; })}
          </ul>
          <div className="border-t border-line mt-3 pt-3 grid gap-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery ? inr(delivery) : 'Free'}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{inr(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
