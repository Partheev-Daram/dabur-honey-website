import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Logo from '../components/Logo.jsx';
import { captureAttribution, track } from '../lib/store.js';
import { OCCASIONS } from '../data/recipes.js';

export default function Discover() {
  const [params] = useSearchParams();
  const source = params.get('source') || 'direct';
  const campaign = params.get('campaign') || '';
  const pack = params.get('pack') || '';

  useEffect(() => {
    captureAttribution({ source, campaign, pack });
    track('qr_scan', { source, campaign, pack });
  }, [source, campaign, pack]);

  const [sim, setSim] = useState({ source: 'honeysnap', pack: '10g' });
  const qrUrl = `${window.location.origin}/discover?source=${sim.source}&campaign=pilot01&pack=${sim.pack}`;
  const img = source === 'honeysnap' ? '/images/honeysnap-pack.webp' : '/images/bottle-classic.webp';
  const sel = 'rounded-xl border border-line bg-white px-3 min-h-[44px] text-sm';

  return (
    <div className="container-x py-8 md:py-14 grid md:grid-cols-2 gap-10 items-start">
      <section className="text-center md:text-left">
        <Logo size="lg" />
        <p className="mt-6 inline-flex items-center gap-2 text-leaf font-semibold">
          <CheckCircle2 size={22} aria-hidden="true" /> You Scanned Dabur Honey!
        </p>
        <img src={img} alt={source === 'honeysnap' ? 'Dabur HoneySnap pack' : 'Dabur Honey bottle'} className="mx-auto md:mx-0 mt-4 w-56 h-56 md:w-72 md:h-72 object-cover rounded-[18px] bg-cream-2" />
        <h1 className="h-display text-3xl md:text-5xl mt-6">A little honey. A lot more possibilities.</h1>
        <div className="mt-6 grid gap-3 max-w-sm mx-auto md:mx-0">
          <Link to="/recipes" className="btn btn-primary">Explore Recipes →</Link>
          <Link to="/honeysnap" className="btn btn-outline">Know about HoneySnap</Link>
        </div>
        <ul className="mt-6 grid grid-cols-3 gap-2 max-w-md mx-auto md:mx-0">
          {OCCASIONS.map((o) => (
            <li key={o.id}><Link to={`/recipes?occasion=${o.id}`} className="chip w-full justify-center">{o.label}</Link></li>
          ))}
        </ul>
      </section>

      <section className="card p-6 hidden md:block" aria-labelledby="qr-h">
        <h2 id="qr-h" className="section-title">Try the QR experience</h2>
        <p className="text-sm text-ink-soft mt-1">Scan with your phone camera to open this page as a pack scan would.</p>
        <div className="mt-4 flex justify-center bg-white p-4 rounded-xl border border-line">
          <QRCodeSVG value={qrUrl} size={200} role="img" aria-label="QR code linking to the Dabur Honey discover page" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <label className="grid gap-1">Source
            <select className={sel} value={sim.source} onChange={(e) => setSim({ ...sim, source: e.target.value })}>
              <option value="honeysnap">HoneySnap</option><option value="squeezy">Squeezy</option><option value="classic">Classic</option>
            </select>
          </label>
          <label className="grid gap-1">Pack
            <select className={sel} value={sim.pack} onChange={(e) => setSim({ ...sim, pack: e.target.value })}>
              <option value="10g">10 g</option><option value="14g">14 g</option><option value="400g">400 g</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-ink-soft break-all">{qrUrl}</p>
        <p className="mt-3 text-xs text-ink-soft">Real packs carry campaign and pack identifiers only — no personal data is encoded.</p>
      </section>
    </div>
  );
}
