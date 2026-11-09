// Seed product catalogue. Prices/availability are illustrative and must be configured per geography at launch.
const SEED = [
  {
    id: 'honeysnap-10', name: 'Dabur HoneySnap', variant: '10 g × 10 packs', family: 'honeysnap', price: 99, mrp: 110,
    image: '/images/honeysnap-pack.webp', badge: 'NEW',
    description: 'Single-serve, pre-portioned honey sachets. Mess-free and easy to carry.',
    available: true,
  },
  {
    id: 'honeysnap-30', name: 'Dabur HoneySnap', variant: '10 g × 30 packs', family: 'honeysnap', price: 279, mrp: 330,
    image: '/images/honeysnap-pack.webp', badge: 'NEW',
    description: 'A month of single-serve honey in one pack.',
    available: true,
  },
  {
    id: 'squeezy-400', name: 'Dabur Honey Squeezy', variant: '400 g', family: 'squeezy', price: 199, mrp: 225,
    image: '/images/bottle-classic.webp', badge: null,
    description: 'Easy-squeeze bottle for drizzling over toast, oats and more.',
    available: true,
  },
];
export const SEED_PRODUCTS = SEED;

// Live catalogue: seed products with admin overrides (price, availability) from localStorage 'dh_admin_products'.
export const PRODUCTS = [];
export function refreshProducts() {
  let store = {};
  try { store = JSON.parse(localStorage.getItem('dh_admin_products') || '{}') || {}; } catch { store = {}; }
  PRODUCTS.splice(0, PRODUCTS.length, ...SEED.map((p) => {
    const o = store[p.id] || {};
    return { ...p, price: Number(o.price) || p.price, available: o.available ?? p.available };
  }));
}
refreshProducts();

export const PRODUCT_FILTERS = [
  { id: 'all', label: 'All Products' }, { id: 'squeezy', label: 'Squeezy' }, { id: 'honeysnap', label: 'HoneySnap' },
];
export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_ABOVE = 499;
export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
