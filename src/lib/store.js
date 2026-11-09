// Tiny client-side store (localStorage-backed, React-subscribable). This is a prototype data layer:
// in production these would be API calls + a database.
import { useSyncExternalStore } from 'react';

const listeners = new Set();
const read = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const cache = {};
function get(key, fallback) {
  if (!(key in cache)) cache[key] = read(key, fallback);
  return cache[key];
}
function set(key, value) {
  cache[key] = value;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  listeners.forEach((l) => l());
}
const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
const useKey = (key, fallback) => useSyncExternalStore(subscribe, () => get(key, fallback), () => fallback);

// ---------- Saved recipes ----------
const EMPTY = [];
export const useSaved = () => useKey('dh_saved', EMPTY);
export const getSaved = () => get('dh_saved', EMPTY);
export function toggleSaved(id) {
  const cur = getSaved();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  set('dh_saved', next);
  track(cur.includes(id) ? 'recipe_unsave' : 'recipe_save', { recipe: id });
  return next.includes(id);
}

// ---------- Recently viewed ----------
export const useRecent = () => useKey('dh_recent', EMPTY);
export function addRecent(id) {
  const cur = get('dh_recent', EMPTY).filter((x) => x !== id);
  set('dh_recent', [id, ...cur].slice(0, 12));
}

// ---------- Cart ----------  items: [{ id, qty }]
export const useCart = () => useKey('dh_cart', EMPTY);
export const getCart = () => get('dh_cart', EMPTY);
export function addToCart(id, qty = 1) {
  const cur = getCart();
  const found = cur.find((i) => i.id === id);
  set('dh_cart', found ? cur.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i)) : [...cur, { id, qty }]);
  track('add_to_cart', { product: id });
}
export function setQty(id, qty) {
  set('dh_cart', qty <= 0 ? getCart().filter((i) => i.id !== id) : getCart().map((i) => (i.id === id ? { ...i, qty } : i)));
}
export const removeFromCart = (id) => setQty(id, 0);
export const clearCart = () => set('dh_cart', []);

// ---------- Consent ----------  'granted' | 'declined' | null (not asked yet)
export const useConsent = () => useKey('dh_consent', null);
export const getConsent = () => get('dh_consent', null);
export function setConsent(v) { set('dh_consent', v); if (v === 'declined') set('dh_events', []); }

// ---------- QR / campaign attribution ----------
export const getAttribution = () => get('dh_attr', null);
export function captureAttribution(params) {
  const { source = 'direct', campaign = '', pack = '' } = params;
  set('dh_attr', { source, campaign, pack, at: Date.now() });
}

// ---------- Analytics ----------  Events are stored locally only when consent is granted.
// Never put personal data in properties. The Admin dashboard reads these via getEvents().
const sid = (() => {
  try { let s = sessionStorage.getItem('dh_sid'); if (!s) { s = Math.random().toString(36).slice(2); sessionStorage.setItem('dh_sid', s); } return s; }
  catch { return 'anon'; }
})();
export const getEvents = () => get('dh_events', EMPTY);
export function track(name, props = {}) {
  if (getConsent() !== 'granted') return;
  const attr = getAttribution();
  const ev = { name, props, sid, t: Date.now(), source: attr?.source, campaign: attr?.campaign, pack: attr?.pack };
  set('dh_events', [...getEvents(), ev].slice(-3000));
  try { navigator.sendBeacon?.('/api/track', JSON.stringify(ev)); } catch { /* ignore */ }
}
