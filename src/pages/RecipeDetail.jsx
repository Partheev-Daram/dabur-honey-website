import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Droplet, Heart, ShoppingBag, Share2, Minus, Plus, X, PlayCircle, Check } from 'lucide-react';
import { RECIPES, getRecipe } from '../data/recipes.js';
import { useSaved, toggleSaved, addRecent, track } from '../lib/store.js';
import RecipeCard from '../components/recipe/RecipeCard.jsx';

const FRACS = { 0.25: '1/4', 0.33: '1/3', 0.5: '1/2', 0.67: '2/3', 0.75: '3/4' };
const parseNum = (s) => {
  s = s.trim();
  let m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return +m[1] + m[2] / m[3];
  m = s.match(/^(\d+)\/(\d+)$/);
  if (m) return m[1] / m[2];
  return parseFloat(s);
};
const fmt = (n) => {
  const whole = Math.floor(n + 0.001);
  const frac = Math.round((n - whole) * 100) / 100;
  if (frac < 0.05 || frac > 0.95) return String(Math.round(n));
  const f = FRACS[frac] || Object.entries(FRACS).find(([k]) => Math.abs(k - frac) < 0.04)?.[1];
  if (f) return whole ? `${whole} ${f}` : f;
  return String(Math.round(n * 10) / 10);
};
const NUM = '(\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d*\\.?\\d+)';
const LEAD = new RegExp(`^${NUM}(\\s*[–-]\\s*${NUM})?`);
// Scale leading number (or range) in a quantity string; leave non-numeric strings alone.
function scaleQty(qty, factor) {
  if (factor === 1) return qty;
  const m = qty.match(LEAD);
  if (!m) return qty;
  const a = fmt(parseNum(m[1]) * factor);
  const b = m[3] ? `–${fmt(parseNum(m[3]) * factor)}` : '';
  return a + b + qty.slice(m[0].length);
}

function CookMode({ recipe, onClose }) {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const saved = useSaved().includes(recipe.id);
  const total = recipe.steps.length;
  const done = i >= total;
  useEffect(() => { if (done) track('recipe_complete', { recipe: recipe.id }); }, [done, recipe.id]);
  const another = () => {
    const others = RECIPES.filter((r) => r.id !== recipe.id);
    onClose();
    navigate(`/recipes/${others[Math.floor(Math.random() * others.length)].id}`);
  };
  return (
    <div role="dialog" aria-modal="true" aria-label={`Cooking ${recipe.title}`} className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex items-center justify-between p-4">
        <span className="text-sm font-semibold text-ink-soft">{done ? 'Done' : `Step ${i + 1} of ${total}`}</span>
        <button type="button" aria-label="Exit cooking mode" onClick={onClose} className="w-11 h-11 grid place-items-center rounded-full bg-white border border-line"><X size={20} /></button>
      </div>
      <div className="h-1.5 mx-4 rounded bg-line"><div className="h-full rounded bg-brand transition-all" style={{ width: `${(Math.min(i, total) / total) * 100}%` }} /></div>
      <div className="grow overflow-y-auto p-6 flex flex-col justify-center text-center items-center gap-5">
        {done ? (
          <>
            <span className="grid place-items-center w-16 h-16 rounded-full bg-leaf text-white"><Check size={34} aria-hidden="true" /></span>
            <h2 className="h-display text-3xl">Ready! Enjoy your {recipe.title}</h2>
            <div className="grid gap-3 w-full max-w-xs">
              <button type="button" className="btn btn-primary" aria-pressed={saved} onClick={() => toggleSaved(recipe.id)}>
                <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /> {saved ? 'Saved' : 'Save Recipe'}
              </button>
              <Link to="/shop" className="btn btn-honey" onClick={() => track('shop_click', { recipe: recipe.id })}><ShoppingBag size={18} aria-hidden="true" /> Shop Dabur Honey</Link>
              <button type="button" className="btn btn-outline" onClick={another}>Try Another Recipe</button>
            </div>
          </>
        ) : (
          <>
            <span className="grid place-items-center w-16 h-16 rounded-full bg-brand text-white text-2xl font-bold">{i + 1}</span>
            <p className="text-2xl font-display font-semibold leading-snug max-w-md">{recipe.steps[i]}</p>
          </>
        )}
      </div>
      {!done && (
        <div className="p-4 flex gap-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
          <button type="button" className="btn btn-outline grow" disabled={i === 0} onClick={() => setI(i - 1)} aria-label="Previous step">Back</button>
          <button type="button" className="btn btn-primary grow" onClick={() => setI(i + 1)} aria-label={i === total - 1 ? 'Finish' : 'Next step'}>{i === total - 1 ? 'Finish' : 'Next'}</button>
        </div>
      )}
    </div>
  );
}

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = getRecipe(id);
  const saved = useSaved().includes(id);
  const [serves, setServes] = useState(recipe?.serves || 1);
  const [cooking, setCooking] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setServes(recipe?.serves || 1);
    setCooking(false);
    window.scrollTo(0, 0);
    if (recipe) { addRecent(recipe.id); track('recipe_view', { recipe: recipe.id }); }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(() => {
    if (!recipe) return [];
    return RECIPES.filter((r) => r.id !== recipe.id && r.occasions.some((o) => recipe.occasions.includes(o)))
      .sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="h-display text-3xl">We couldn't find that recipe</h1>
        <p className="text-ink-soft mt-3">It may have moved or no longer be available.</p>
        <Link to="/recipes" className="btn btn-primary mt-6">Back to all recipes</Link>
      </div>
    );
  }

  const factor = serves / (recipe.serves || 1);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: recipe.title, url }); return; }
      await navigator.clipboard.writeText(url);
      setToast('Link copied');
    } catch { setToast('Could not share'); }
    setTimeout(() => setToast(''), 2000);
  };
  const startCooking = () => { track('recipe_start', { recipe: recipe.id }); setCooking(true); };

  return (
    <div className="container-x py-4 md:py-8">
      <Link to="/recipes" className="inline-flex items-center gap-1 text-brand font-semibold min-h-[44px]"><ArrowLeft size={18} aria-hidden="true" /> Back to recipes</Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 mt-2 items-start">
        <img src={recipe.image} alt={recipe.title} className="w-full aspect-[4/3] object-cover rounded-[24px] shadow-[0_20px_50px_-24px_rgba(122,90,72,.6)]" />
        <div>
          <h1 className="h-display text-3xl md:text-5xl">{recipe.title}</h1>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {[[Clock, `${recipe.time} min`], [Users, `Serves ${recipe.serves}`], [ChefHat, recipe.difficulty], [Droplet, `Honey: ${recipe.honey}`]].map(([Icon, t]) => (
              <li key={t} className="chip cursor-default"><Icon size={16} className="text-brand" aria-hidden="true" />{t}</li>
            ))}
          </ul>
          <p className="mt-4 text-ink-soft text-base md:text-lg">{recipe.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" aria-pressed={saved} aria-label={saved ? 'Remove from saved recipes' : 'Save recipe'} onClick={() => toggleSaved(recipe.id)}>
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /> {saved ? 'Saved' : 'Save Recipe'}
            </button>
            <Link to="/shop" className="btn btn-honey" onClick={() => track('shop_click', { recipe: recipe.id })}><ShoppingBag size={18} aria-hidden="true" /> Shop Dabur Honey</Link>
            <button type="button" className="btn btn-outline" aria-label="Share recipe" onClick={share}><Share2 size={18} aria-hidden="true" /> Share</button>
          </div>
          <p role="status" className="text-sm text-leaf mt-2 min-h-5">{toast}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[2fr_3fr] gap-6 md:gap-10 mt-8">
        <section className="card p-5 self-start" aria-labelledby="ing-h">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 id="ing-h" className="section-title">Ingredients</h2>
            <div className="inline-flex items-center gap-1" role="group" aria-label="Serves">
              <button type="button" aria-label="Decrease servings" disabled={serves <= 1} onClick={() => setServes((s) => Math.max(1, s - 1))} className="w-11 h-11 grid place-items-center rounded-full border border-line bg-white disabled:opacity-40"><Minus size={16} /></button>
              <span className="min-w-[72px] text-center text-sm font-semibold" aria-live="polite">Serves {serves}</span>
              <button type="button" aria-label="Increase servings" disabled={serves >= 12} onClick={() => setServes((s) => Math.min(12, s + 1))} className="w-11 h-11 grid place-items-center rounded-full border border-line bg-white disabled:opacity-40"><Plus size={16} /></button>
            </div>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name} className={`flex justify-between gap-3 py-2.5 ${ing.honey ? 'text-brand font-bold' : ''}`}>
                <span>{ing.name}</span><span className={ing.honey ? '' : 'text-ink-soft'}>{scaleQty(ing.qty, factor)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="steps-h">
          <div className="flex items-center justify-between gap-3">
            <h2 id="steps-h" className="section-title">Step-by-step</h2>
            <button type="button" className="btn btn-primary md:hidden" onClick={startCooking}><PlayCircle size={18} aria-hidden="true" /> Start Cooking</button>
          </div>
          <ol className="mt-4 grid gap-4">
            {recipe.steps.map((s, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-brand text-white font-bold grid place-items-center" aria-hidden="true">{i + 1}</span>
                <p className="pt-1"><span className="sr-only">Step {i + 1}: </span>{s}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="rel-h">
          <h2 id="rel-h" className="section-title mb-4">You might also like</h2>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {related.map((r) => <li key={r.id}><RecipeCard recipe={r} /></li>)}
          </ul>
        </section>
      )}

      {cooking && <CookMode recipe={recipe} onClose={() => setCooking(false)} />}
    </div>
  );
}
