import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { RECIPES, OCCASIONS, INGREDIENT_FILTERS } from '../data/recipes.js';
import RecipeCard from '../components/recipe/RecipeCard.jsx';

const TIMES = [{ l: 'Any', v: 0 }, { l: '≤ 2 min', v: 2 }, { l: '≤ 5 min', v: 5 }, { l: '≤ 10 min', v: 10 }];
const DIFFS = ['Any', 'Easy', 'Medium'];

function Group({ label, children }) {
  return (
    <div role="group" aria-label={label}>
      <div className="text-sm font-semibold mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function Recipes() {
  const [params, setParams] = useSearchParams();
  const occasion = params.get('occasion') || 'all';
  const [q, setQ] = useState('');
  const [time, setTime] = useState(0);
  const [diff, setDiff] = useState('Any');
  const [ings, setIngs] = useState([]);
  const [sort, setSort] = useState('popular');
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => { if (params.get('focus') === 'search') searchRef.current?.focus(); }, [params]);

  const setOccasion = (id) => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('occasion'); else next.set('occasion', id);
    setParams(next, { replace: true });
  };
  const toggleIng = (k) => setIngs((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  const filtersActive = q || time || diff !== 'Any' || ings.length || occasion !== 'all';
  const clear = () => { setQ(''); setTime(0); setDiff('Any'); setIngs([]); setOccasion('all'); };

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return RECIPES.filter((r) =>
      (occasion === 'all' || r.occasions.includes(occasion)) &&
      (!time || r.time <= time) &&
      (diff === 'Any' || r.difficulty === diff) &&
      ings.every((k) => r.ingredients.some((i) => i.key === k)) &&
      (!s || r.title.toLowerCase().includes(s) || r.ingredients.some((i) => i.name.toLowerCase().includes(s)))
    ).sort((a, b) => (sort === 'quick' ? a.time - b.time || b.popularity - a.popularity : b.popularity - a.popularity));
  }, [q, occasion, time, diff, ings, sort]);

  const filters = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Group label="Time">
        {TIMES.map((t) => <button key={t.v} type="button" className="chip" aria-pressed={time === t.v} onClick={() => setTime(t.v)}>{t.l}</button>)}
      </Group>
      <Group label="Difficulty">
        {DIFFS.map((d) => <button key={d} type="button" className="chip" aria-pressed={diff === d} onClick={() => setDiff(d)}>{d}</button>)}
      </Group>
      <Group label="Sort">
        <button type="button" className="chip" aria-pressed={sort === 'popular'} onClick={() => setSort('popular')}>Popular</button>
        <button type="button" className="chip" aria-pressed={sort === 'quick'} onClick={() => setSort('quick')}>Quickest</button>
      </Group>
      <div className="md:col-span-2 lg:col-span-4">
        <Group label="Ingredients">
          {INGREDIENT_FILTERS.map((k) => <button key={k} type="button" className="chip" aria-pressed={ings.includes(k)} onClick={() => toggleIng(k)}>{k}</button>)}
        </Group>
      </div>
    </div>
  );

  return (
    <div className="container-x py-6 md:py-10">
      <h1 className="h-display text-3xl md:text-5xl">Discover Honey Recipes</h1>

      <div className="mt-5 flex gap-2">
        <div className="relative grow">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            ref={searchRef} type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search recipes or ingredients" aria-label="Search recipes"
            className="w-full min-h-[48px] rounded-full border border-line bg-white pl-11 pr-4 text-base"
          />
        </div>
        <button type="button" className="btn btn-outline md:hidden" aria-expanded={open} aria-controls="filters-panel" aria-label="Toggle filters" onClick={() => setOpen((o) => !o)}>
          <SlidersHorizontal size={18} aria-hidden="true" /> Filters
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap" role="group" aria-label="Occasion">
        <button type="button" className="chip" aria-pressed={occasion === 'all'} onClick={() => setOccasion('all')}>All</button>
        {OCCASIONS.map((o) => <button key={o.id} type="button" className="chip" aria-pressed={occasion === o.id} onClick={() => setOccasion(o.id)}>{o.label}</button>)}
      </div>

      <div id="filters-panel" className={`${open ? 'block' : 'hidden'} md:block card mt-4 p-4`}>{filters}</div>

      <div className="mt-5 flex items-center justify-between">
        <p className="font-semibold" aria-live="polite">{list.length} {list.length === 1 ? 'recipe' : 'recipes'} found</p>
        {filtersActive && <button type="button" className="text-brand font-semibold inline-flex items-center gap-1 min-h-[44px]" onClick={clear}><X size={16} aria-hidden="true" />Clear filters</button>}
      </div>

      {list.length ? (
        <ul className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {list.map((r) => <li key={r.id}><RecipeCard recipe={r} /></li>)}
        </ul>
      ) : (
        <div className="card mt-6 p-10 text-center">
          <p className="font-display text-2xl font-bold text-brand-dark">No recipes match just yet</p>
          <p className="text-ink-soft mt-2">Try removing a filter or searching for something different.</p>
          <button type="button" className="btn btn-primary mt-5" onClick={clear}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
