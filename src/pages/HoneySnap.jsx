import { Link } from 'react-router-dom';
import { Sparkles, Scale, Footprints, ShieldCheck, FoldVertical, Scissors, Hand, ArrowRight, QrCode } from 'lucide-react';

const BENEFITS = [
  { Icon: Sparkles, t: 'Mess-free' }, { Icon: Scale, t: 'Portion controlled (10–14 g)' },
  { Icon: Footprints, t: 'On-the-go' }, { Icon: ShieldCheck, t: 'Hygienic & safe' },
];
const STEPS = [
  { Icon: FoldVertical, t: 'Fold', d: 'Fold the pack along the crease.' },
  { Icon: Scissors, t: 'Open', d: 'Tear at the notch.' },
  { Icon: Hand, t: 'Squeeze', d: 'Squeeze out the honey.' },
];
const PERFECT = [['Breakfast', 'breakfast'], ['Beverages', 'beverages'], ['Salads', 'cooking'], ['Desserts', 'desserts']];
const PROGRESSION = [
  { n: 'HoneySnap', r: 'Trial', d: 'Try single-serve honey.' },
  { n: 'Squeezy', r: 'Habit', d: 'Everyday easy-squeeze bottle.' },
  { n: 'Classic / Premium', r: 'Premium', d: 'Treat yourself to more.' },
];

export default function HoneySnap() {
  return (
    <div>
      <section className="bg-cream-2">
        <div className="container-x py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block text-xs font-bold bg-honey text-ink rounded px-2 py-1">NEW</span>
            <h1 className="h-display text-4xl md:text-6xl mt-3">Dabur HoneySnap</h1>
            <p className="mt-4 text-lg text-ink-soft max-w-md">The convenient, single-serve honey format for your everyday needs.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop?family=honeysnap" className="btn btn-primary">Explore HoneySnap</Link>
              <Link to="/shop?family=honeysnap" className="btn btn-outline">Shop HoneySnap</Link>
            </div>
          </div>
          <div className="relative">
            <img src="/images/honeysnap-pack.webp" alt="Dabur HoneySnap single-serve pack" className="w-full max-w-md mx-auto rounded-[18px]" />
            <img src="/images/honeysnap-angle.webp" alt="Dabur HoneySnap pack at an angle" className="hidden md:block absolute -bottom-6 -left-6 w-32 rounded-[18px] border-4 border-cream shadow-lg" />
          </div>
        </div>
      </section>

      <section className="container-x py-10" aria-label="Benefits">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BENEFITS.map(({ Icon, t }) => (
            <li key={t} className="card p-4 text-center">
              <span className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-brand-soft text-brand"><Icon size={24} aria-hidden="true" /></span>
              <p className="mt-2 font-semibold text-sm">{t}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x py-6">
        <h2 className="section-title">How to use</h2>
        <ol className="mt-4 grid md:grid-cols-3 gap-3">
          {STEPS.map(({ Icon, t, d }, i) => (
            <li key={t} className="card p-5 flex items-center gap-4">
              <span className="grid place-items-center w-14 h-14 rounded-full bg-honey text-ink shrink-0"><Icon size={26} aria-hidden="true" /></span>
              <div><p className="font-bold">{i + 1}. {t}</p><p className="text-sm text-ink-soft">{d}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x py-8">
        <h2 className="section-title">Perfect for</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {PERFECT.map(([l, id]) => <li key={l}><Link className="chip" to={`/recipes?occasion=${id}`}>{l}</Link></li>)}
        </ul>
      </section>

      <section className="container-x py-8">
        <h2 className="section-title">Your honey journey</h2>
        <ol className="mt-4 grid md:grid-cols-3 gap-3">
          {PROGRESSION.map((s, i) => (
            <li key={s.n} className="card p-5 relative">
              <span className="text-xs font-bold bg-brand-soft text-brand rounded px-2 py-0.5">{s.r}</span>
              <p className="font-display italic font-bold text-xl mt-2 text-brand-dark">{s.n}</p>
              <p className="text-sm text-ink-soft">{s.d}</p>
              {i < 2 && <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-honey-deep z-10" aria-hidden="true" />}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-ink-soft">HoneySnap availability varies by city during pilot rollout.</p>
      </section>

      <section className="container-x py-8 grid md:grid-cols-2 gap-4">
        <div className="card md:flex md:flex-col">
          <img src="/images/young-walk.webp" alt="Young person on the go with a HoneySnap" loading="lazy" className="w-full h-56 object-cover" />
          <div className="p-5"><h2 className="section-title">Honey, wherever you go</h2><p className="text-sm text-ink-soft mt-1">Slip a pack in your bag for commutes, class or the gym.</p></div>
        </div>
        <Link to="/discover" className="card p-6 flex flex-col justify-center items-start bg-brand text-white !border-brand">
          <QrCode size={36} aria-hidden="true" />
          <h2 className="font-display italic font-bold text-2xl mt-3">Scan &amp; discover delicious recipes</h2>
          <span className="btn btn-honey mt-4">Try it <ArrowRight size={16} /></span>
        </Link>
      </section>
    </div>
  );
}
