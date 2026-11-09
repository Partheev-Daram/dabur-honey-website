import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Search, BookOpenCheck, ListChecks, Heart } from 'lucide-react';
import { RECIPES } from '../data/recipes.js';
import RecipeCard from '../components/recipe/RecipeCard.jsx';
import OccasionTiles from '../components/recipe/OccasionTiles.jsx';

const STEPS = [
  { icon: QrCode, t: 'Scan QR', d: 'Scan the code on your Dabur Honey pack.' },
  { icon: Search, t: 'Discover', d: 'Browse easy recipes for every occasion.' },
  { icon: BookOpenCheck, t: 'View recipe', d: 'See ingredients and what you need.' },
  { icon: ListChecks, t: 'Follow steps', d: 'Cook along, step by step.' },
  { icon: Heart, t: 'Save & Shop', d: 'Save favourites and shop honey.' },
];

export default function Home() {
  const popular = [...RECIPES].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  return (
    <div>
      {/* Hero */}
      <section className="container-x pt-6 md:pt-12 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className="order-2 md:order-1">
          <h1 className="h-display text-[38px] sm:text-5xl lg:text-6xl">
            Make Everyday<br />Healthier &amp; Tastier<br />
            <span className="block mt-1 text-[28px] sm:text-4xl lg:text-[42px] font-medium text-brand">with Dabur Honey</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-ink-soft max-w-md">
            Discover easy recipes, see what you need, and make delicious honey creations at home.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/recipes" className="btn btn-primary">Explore Recipes <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link to="/discover" className="btn btn-outline"><QrCode size={18} aria-hidden="true" /> Scan QR</Link>
            <a href="#how-it-works" className="btn text-brand underline-offset-4 hover:underline">How it works</a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <img src="/images/hero-honey-wide.webp" alt="Dabur Honey jar with golden honey dripping" className="w-full rounded-[24px] object-cover aspect-[16/10] shadow-[0_20px_60px_-20px_rgba(245,180,0,.7)]" />
        </div>
      </section>

      {/* Occasions */}
      <section className="container-x mt-12 md:mt-16" aria-labelledby="occ-h">
        <h2 id="occ-h" className="section-title mb-4">Explore by Occasion</h2>
        <OccasionTiles />
      </section>

      {/* Popular */}
      <section className="mt-12 md:mt-16" aria-labelledby="pop-h">
        <div className="container-x flex items-end justify-between mb-4">
          <h2 id="pop-h" className="section-title">Popular Recipes</h2>
          <Link to="/recipes" className="text-brand font-semibold inline-flex items-center gap-1 min-h-[44px]" aria-label="View all recipes">View All <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="container-x">
          <ul className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            {popular.map((r) => (
              <li key={r.id} className="snap-start shrink-0 w-[62%] sm:w-[40%] md:w-auto"><RecipeCard recipe={r} /></li>
            ))}
          </ul>
        </div>
      </section>

      {/* HoneySnap */}
      <section className="container-x mt-12 md:mt-16" aria-labelledby="hs-h">
        <div className="rounded-[24px] bg-gradient-to-br from-honey to-honey-deep overflow-hidden grid md:grid-cols-2 items-center">
          <div className="p-6 md:p-10 order-2 md:order-1">
            <span className="inline-block bg-white text-brand text-xs font-bold rounded-full px-3 py-1">Single serve 10 g</span>
            <h2 id="hs-h" className="h-display text-3xl md:text-4xl mt-3">Introducing Dabur HoneySnap</h2>
            <p className="mt-3 text-ink max-w-md">Pocket-sized honey sachets, made for toast, oats and drinks wherever your day takes you.</p>
            <Link to="/honeysnap" className="btn btn-primary mt-5" aria-label="Know more about Dabur HoneySnap">Know More <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="order-1 md:order-2 bg-cream-2/40 h-full">
            <img src="/images/honeysnap-pack.webp" alt="Dabur HoneySnap single-serve pack" loading="lazy" className="w-full h-full max-h-[340px] object-cover" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container-x mt-12 md:mt-16 scroll-mt-20" aria-labelledby="how-h">
        <h2 id="how-h" className="section-title mb-4">How it works</h2>
        <ol className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className={`card p-4 ${i === STEPS.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}>
              <span className="grid place-items-center w-11 h-11 rounded-full bg-brand text-white"><s.icon size={20} aria-hidden="true" /></span>
              <div className="mt-3 font-semibold"><span className="text-brand">{i + 1}.</span> {s.t}</div>
              <p className="text-sm text-ink-soft mt-1">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Audience */}
      <section className="container-x mt-12 md:mt-16 grid sm:grid-cols-2 gap-4" aria-label="Recipes for your day">
        {[
          { img: '/images/family-bowl.webp', alt: 'A family enjoying breakfast together', label: 'For busy families', to: '/recipes?occasion=breakfast' },
          { img: '/images/young-walk.webp', alt: 'A young person walking with a snack', label: 'For on-the-go days', to: '/recipes?occasion=onthego' },
        ].map((a) => (
          <Link key={a.label} to={a.to} className="card relative block group aspect-[16/10]" aria-label={a.label}>
            <img src={a.img} alt={a.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/70 to-transparent text-white font-display font-bold text-xl md:text-2xl italic inline-flex items-end justify-between">
              {a.label} <ArrowRight aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
