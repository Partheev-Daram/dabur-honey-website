// Admin data layer (prototype): localStorage-backed CMS + analytics helpers.
// Production would replace these with API calls + a database.
import { RECIPES, OCCASIONS } from '../data/recipes.js';
import { PRODUCTS } from '../data/products.js';

export const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune'];
export const RECIPE_IMAGES = [
  'recipe-apple-toast', 'recipe-banana-smoothie', 'recipe-banana-toast', 'recipe-chicken-skewers', 'recipe-glazed-tofu',
  'recipe-honey-cake', 'recipe-lemon-drink', 'recipe-oat-bowl', 'recipe-pancakes', 'recipe-panna-cotta', 'recipe-roasted-veg',
  'recipe-yogurt-bowl', 'cat-beverages', 'cat-breakfast', 'cat-cooking', 'cat-desserts', 'cat-onthego', 'cat-snacks',
].map((n) => `/images/${n}.webp`);

const K = { recipes: 'dh_admin_recipes', products: 'dh_admin_products', campaigns: 'dh_admin_campaigns' };
const load = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

export function resetAdminData() {
  try { Object.keys(localStorage).filter((k) => k.startsWith('dh_admin_')).forEach((k) => localStorage.removeItem(k)); } catch { /* ignore */ }
}

// ---------- Recipes ----------  store: { [id]: recipe | { id, _deleted: true } }
const recipeStore = () => load(K.recipes, {});
export function getAllRecipes({ includeDeleted = false } = {}) {
  const store = recipeStore();
  const seedIds = new Set(RECIPES.map((r) => r.id));
  const merged = RECIPES.map((r) => ({ status: 'published', ...r, ...(store[r.id] || {}) }));
  const added = Object.values(store).filter((r) => !seedIds.has(r.id)).map((r) => ({ status: 'draft', ...r }));
  return [...merged, ...added].filter((r) => includeDeleted || !r._deleted);
}
export const getRecipeById = (id) => getAllRecipes().find((r) => r.id === id);
export function saveRecipe(recipe) {
  const store = recipeStore();
  store[recipe.id] = { ...recipe, _deleted: false };
  save(K.recipes, store);
}
export function deleteRecipe(id) {
  const store = recipeStore();
  if (RECIPES.some((r) => r.id === id)) store[id] = { id, _deleted: true }; else delete store[id];
  save(K.recipes, store);
}
export const exportRecipesJSON = () => JSON.stringify(getAllRecipes(), null, 2);
export function importRecipesJSON(text) {
  const arr = JSON.parse(text);
  if (!Array.isArray(arr)) throw new Error('Expected a JSON array of recipes');
  const store = recipeStore();
  arr.forEach((r) => { if (r && r.id && r.title) store[r.id] = { ...r, _deleted: false }; });
  save(K.recipes, store);
  return arr.length;
}
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CLAIM_RE = /\b(cure[sd]?|curing|treat(s|ed|ing|ment)?|prevent(s|ed|ing|ion)?|heal(s|ed|ing)?|disease[s]?|immunity|immune|detox(ify)?|diabetes|remedy|therapy|medicine)\b/gi;
export function healthClaimHits(recipe) {
  const text = [recipe.title, recipe.description, ...(recipe.steps || []), ...(recipe.ingredients || []).map((i) => i.name)].join(' \n ');
  return [...new Set((text.match(CLAIM_RE) || []).map((w) => w.toLowerCase()))];
}
export function validateRecipe(r) {
  const errors = [];
  if (!r.title?.trim()) errors.push('Title is required.');
  if (!(r.steps || []).some((s) => s.trim())) errors.push('Add at least one step.');
  if (!(r.occasions || []).length) errors.push('Pick at least one occasion.');
  return { errors, warnings: healthClaimHits(r) };
}

// ---------- Products ----------  store: { [id]: { price, available, cities: { [city]: bool } } }
const productStore = () => load(K.products, {});
export function getAllProducts() {
  const s = productStore();
  return PRODUCTS.map((p) => {
    const o = s[p.id] || {};
    const cities = Object.fromEntries(CITIES.map((c) => [c, o.cities?.[c] ?? true]));
    return { ...p, price: o.price ?? p.price, available: o.available ?? p.available, cities };
  });
}
export function patchProduct(id, patch) {
  const s = productStore();
  s[id] = { ...(s[id] || {}), ...patch };
  save(K.products, s);
}

// ---------- Campaigns ----------
export const getCampaigns = () => load(K.campaigns, []);
export function saveCampaign(c) {
  const list = getCampaigns().filter((x) => x.key !== c.key);
  save(K.campaigns, [c, ...list]);
}
export function deleteCampaign(key) { save(K.campaigns, getCampaigns().filter((c) => c.key !== key)); }
export function campaignUrl({ source, campaign, pack, geo }, origin = window.location.origin) {
  const q = new URLSearchParams({ source, campaign, pack });
  if (geo) q.set('geo', geo);
  return `${origin}/discover?${q.toString()}`;
}

// ---------- Illustrative demo events (deterministic) ----------
function rng(seed) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
export function makeDemoEvents(now = Date.now()) {
  const rand = rng(42);
  const pick = (a) => a[Math.floor(rand() * a.length)];
  const DAY = 86400000;
  const ids = RECIPES.map((r) => r.id);
  const sources = [['honeysnap', 'bottle-launch', 'honeysnap-10'], ['honeysnap', 'metro-sampling', 'honeysnap-30'], ['squeezy', 'festive-promo', 'squeezy-400'], ['classic', 'classic-label', 'classic']];
  const out = [];
  for (let i = 0; i < 160; i++) {
    const sid = 'demo' + i;
    const [source, campaign, pack] = pick(sources);
    const day0 = Math.floor(rand() * rand() * 14); // weighted to recent days = growth
    const t0 = now - (13 - Math.min(13, 13 - day0 + 0)) * DAY - Math.floor(rand() * DAY * 0.9);
    const base = { sid, source, campaign, pack };
    const ev = (name, t, props = {}) => out.push({ ...base, name, props, t });
    ev('qr_scan', t0);
    if (rand() < 0.82) {
      const rid = pick(ids);
      ev('recipe_view', t0 + 20000, { recipe: rid });
      if (rand() < 0.5) ev('recipe_view', t0 + 90000, { recipe: pick(ids) });
      if (rand() < 0.55) ev('recipe_start', t0 + 150000, { recipe: rid });
      if (rand() < 0.38) {
        ev('recipe_save', t0 + 200000, { recipe: rid });
        if (rand() < 0.42) { ev('shop_click', t0 + 300000); if (rand() < 0.4) ev('shop_add', t0 + 330000); if (rand() < 0.3) ev('purchase', t0 + 600000); }
      } else if (rand() < 0.12) ev('shop_click', t0 + 250000);
    }
    if (rand() < 0.22) { const back = t0 + (1 + Math.floor(rand() * 40)) * DAY; if (back < now) { ev('qr_scan', back); ev('recipe_view', back + 15000, { recipe: pick(ids) }); } }
  }
  return out.sort((a, b) => a.t - b.t);
}

// ---------- Metrics ----------
const dayKey = (t) => new Date(t).toISOString().slice(0, 10);
const sessionsWith = (events, pred) => new Set(events.filter(pred).map((e) => e.sid));
const SHOP = new Set(['shop_click', 'shop_add']);
export function computeMetrics(events, now = Date.now()) {
  const has = (n) => (e) => e.name === n;
  const all = new Set(events.map((e) => e.sid));
  const scan = sessionsWith(events, has('qr_scan'));
  const view = sessionsWith(events, has('recipe_view'));
  const start = sessionsWith(events, (e) => e.name === 'recipe_start' || e.name === 'recipe_save');
  const engaged = new Set([...view].filter((s) => start.has(s)));
  const saved = sessionsWith(events, has('recipe_save'));
  const shop = sessionsWith(events, (e) => SHOP.has(e.name));
  const bought = sessionsWith(events, has('purchase'));
  const count = (n) => events.filter(has(n)).length;
  const funnel = [['QR scan', scan.size], ['Recipe view', view.size], ['Recipe saved', saved.size], ['Shop click', shop.size], ['Purchase', bought.size]];

  const DAY = 86400000;
  const today = new Date(now); today.setUTCHours(0, 0, 0, 0);
  const trend = Array.from({ length: 14 }, (_, i) => ({ day: dayKey(today.getTime() - (13 - i) * DAY), events: 0, scans: 0 }));
  const idx = Object.fromEntries(trend.map((d, i) => [d.day, i]));
  events.forEach((e) => { const i = idx[dayKey(e.t)]; if (i != null) { trend[i].events++; if (e.name === 'qr_scan') trend[i].scans++; } });

  const recipeViews = {}; const occ = {}; const byPack = {}; const byCampaign = {};
  const rmap = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
  events.forEach((e) => {
    if (e.name === 'recipe_view' && e.props?.recipe) {
      recipeViews[e.props.recipe] = (recipeViews[e.props.recipe] || 0) + 1;
      (rmap[e.props.recipe]?.occasions || []).forEach((o) => { occ[o] = (occ[o] || 0) + 1; });
    }
    if (e.name === 'qr_scan') {
      const p = `${e.source || 'direct'} / ${e.pack || 'n/a'}`; byPack[p] = (byPack[p] || 0) + 1;
      const c = e.campaign || '(none)'; byCampaign[c] = (byCampaign[c] || 0) + 1;
    }
  });
  const sortObj = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
  const topRecipes = sortObj(recipeViews).slice(0, 8).map(([id, n]) => ({ label: rmap[id]?.title || id, value: n }));
  const occasions = sortObj(occ).map(([id, n]) => ({ label: OCCASIONS.find((o) => o.id === id)?.label || id, value: n }));

  // repeat: per session, scan days and first-to-later gaps
  const scanDays = {}; const scanTimes = {};
  events.filter(has('qr_scan')).forEach((e) => { (scanDays[e.sid] ||= new Set()).add(dayKey(e.t)); (scanTimes[e.sid] ||= []).push(e.t); });
  let repeat = 0; let r30 = 0; let r90 = 0;
  Object.entries(scanTimes).forEach(([sid, ts]) => {
    ts.sort((a, b) => a - b);
    if (scanDays[sid].size >= 2) repeat++;
    const later = ts.filter((t) => dayKey(t) !== dayKey(ts[0])).map((t) => t - ts[0]);
    if (later.some((d) => d <= 30 * DAY)) r30++;
    if (later.some((d) => d <= 90 * DAY)) r90++;
  });
  return {
    visitors: all.size, scans: count('qr_scan'), uniqueScans: scan.size, recipeViews: count('recipe_view'), saves: count('recipe_save'),
    shopClicks: count('shop_click') + count('shop_add'), orders: count('purchase'),
    engagementRate: view.size ? engaged.size / view.size : 0, commerceCtr: view.size ? shop.size / view.size : 0,
    repeat, r30, r90, scannerBase: scan.size, funnel, trend, topRecipes, occasions,
    byPack: sortObj(byPack).map(([label, value]) => ({ label, value })),
    byCampaign, 
  };
}
export const scansByCampaign = (events) => {
  const m = {}; events.filter((e) => e.name === 'qr_scan').forEach((e) => { m[e.campaign] = (m[e.campaign] || 0) + 1; }); return m;
};
