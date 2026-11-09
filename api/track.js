// Vercel serverless function: receives consented analytics events (prototype — logs only, no persistence).
// Privacy: only an allow-list of coarse fields is read; free-form props are never logged.
const ALLOWED = new Set(['qr_scan', 'page_view', 'recipe_view', 'recipe_start', 'recipe_save', 'recipe_unsave', 'shop_click', 'shop_add', 'add_to_cart', 'begin_checkout', 'recipe_complete', 'purchase']);
const clean = (v) => (typeof v === 'string' ? v.slice(0, 64).replace(/[^\w.\- ]/g, '') : undefined);

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();
  try {
    const ev = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!ev || !ALLOWED.has(ev.name)) return res.status(400).end();
    console.log('[track]', JSON.stringify({ name: ev.name, source: clean(ev.source), campaign: clean(ev.campaign), pack: clean(ev.pack), t: Number(ev.t) || Date.now() }));
  } catch { return res.status(400).end(); }
  res.status(204).end();
}
