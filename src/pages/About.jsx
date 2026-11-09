import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Filter, BadgeCheck, Package, ChevronDown, ArrowRight } from 'lucide-react';
import { OCCASIONS } from '../data/recipes.js';

const STEPS = [
  [Droplets, 'Collected', 'Honey is collected from beekeepers.'],
  [Filter, 'Filtered', 'Carefully filtered for a clean, smooth pour.'],
  [BadgeCheck, 'Quality-checked', 'Checked against quality standards.'],
  [Package, 'Packed', 'Packed to keep it fresh for your kitchen.'],
];

const FAQ = [
  ['How should I store honey?', 'Keep it in a tightly closed jar at room temperature, away from direct sunlight and moisture. Use a clean, dry spoon.'],
  ['Crystallised honey — is it spoiled?', 'No. Crystallisation is natural. To return it to a smooth texture, place the closed jar in warm (not boiling) water and stir gently.'],
  ['Is HoneySnap available near me?', 'HoneySnap is in a pilot rollout, so availability varies by area. Check the HoneySnap page or Shop for what is available.'],
  ['Can I use honey in cooking?', 'Yes. Honey works in glazes, dressings, baking and drinks. Browse our recipes for simple ideas.'],
];

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="w-full min-h-12 px-4 py-3 flex items-center justify-between gap-3 text-left font-semibold">
          {q}
          <ChevronDown size={20} aria-hidden="true" className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      {open && <p className="px-4 pb-4 text-ink-soft">{a}</p>}
    </div>
  );
}

export default function About() {
  return (
    <div>
      <section className="relative">
        <img src="/images/raw-honey-wide.webp" alt="Golden honey flowing in a jar" className="w-full h-64 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent flex items-end">
          <div className="container-x pb-6 md:pb-10">
            <h1 className="h-display !text-white text-4xl md:text-6xl">About Dabur Honey</h1>
          </div>
        </div>
      </section>

      <div className="container-x py-10 md:py-14 grid gap-12">
        <section className="max-w-3xl">
          <h2 className="section-title">Pure &amp; trusted</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">Dabur Honey is quality-checked before it reaches your kitchen. We focus on honey you can use every day, in simple recipes for every occasion. Honey is a food, not a medicine.</p>
        </section>

        <section>
          <h2 className="section-title">From hive to home</h2>
          <ol className="mt-5 grid gap-4 grid-cols-2 md:grid-cols-4">
            {STEPS.map(([Icon, t, d], i) => (
              <li key={t} className="card p-4 text-center">
                <span className="mx-auto w-12 h-12 rounded-full bg-cream-2 grid place-items-center text-brand"><Icon size={24} aria-hidden="true" /></span>
                <p className="mt-3 font-semibold"><span className="text-honey-deep">{i + 1}.</span> {t}</p>
                <p className="mt-1 text-sm text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="section-title">Ways to enjoy</h2>
          <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {OCCASIONS.map((o) => (
              <Link key={o.id} to={`/recipes?occasion=${o.id}`} className="card block">
                <img src={o.image} alt="" loading="lazy" className="w-full h-24 md:h-28 object-cover" />
                <p className="p-3 font-semibold text-center min-h-11">{o.label}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-3xl w-full">
          <h2 className="section-title">Frequently asked questions</h2>
          <div className="mt-5 grid gap-3">{FAQ.map(([q, a]) => <Faq key={q} q={q} a={a} />)}</div>
        </section>

        <section className="card p-6 md:p-10 text-center bg-cream-2">
          <h2 className="h-display text-3xl md:text-4xl">Ready to try something new?</h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/recipes" className="btn btn-primary">Explore Recipes <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link to="/shop" className="btn btn-outline">Shop Honey</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
