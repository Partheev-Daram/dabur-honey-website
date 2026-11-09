import { useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Trash2 } from 'lucide-react';
import { getEvents } from '../../lib/store.js';
import { getCampaigns, saveCampaign, deleteCampaign, campaignUrl, scansByCampaign, CITIES } from '../../lib/admin-data.js';
import { PageHeader, Panel, Field, Notice, inputCls } from '../components/ui.jsx';

const PACKS = ['honeysnap-10', 'honeysnap-30', 'squeezy-400', 'classic'];
const clean = (s) => s.toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 40);

export default function Campaigns() {
  const [form, setForm] = useState({ source: 'honeysnap', campaign: 'launch-2026', pack: 'honeysnap-10', geo: '' });
  const [list, setList] = useState(getCampaigns);
  const [copied, setCopied] = useState('');
  const box = useRef(null);
  const scans = useMemo(() => scansByCampaign(getEvents()), []);
  const f = { ...form, campaign: clean(form.campaign) };
  const url = campaignUrl(f);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const copy = async (u) => { try { await navigator.clipboard.writeText(u); setCopied(u); setTimeout(() => setCopied(''), 1500); } catch { window.prompt('Copy this URL', u); } };
  const svgEl = () => box.current?.querySelector('svg');
  const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); };
  const dlSvg = () => download(new Blob([new XMLSerializer().serializeToString(svgEl())], { type: 'image/svg+xml' }), `qr-${f.campaign}.svg`);
  const dlPng = () => {
    const src = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svgEl())], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 1024, 1024); x.drawImage(img, 0, 0, 1024, 1024); URL.revokeObjectURL(src); c.toBlob((b) => download(b, `qr-${f.campaign}.png`)); };
    img.src = src;
  };
  const add = (e) => {
    e.preventDefault();
    if (!f.campaign) return;
    saveCampaign({ ...f, key: `${f.source}|${f.campaign}|${f.pack}|${f.geo}`, createdAt: Date.now() });
    setList(getCampaigns());
  };

  return (
    <>
      <PageHeader title="Campaigns / QR" sub="Create tracked QR links for packs and activations." />
      <Notice tone="warn">Never put personal information in QR URLs. Use only source, campaign, pack and a coarse geography.</Notice>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Panel title="New campaign">
          <form onSubmit={add} className="space-y-3">
            <Field label="Source"><select className={inputCls} value={form.source} onChange={set('source')}><option value="honeysnap">honeysnap</option><option value="squeezy">squeezy</option><option value="classic">classic</option></select></Field>
            <Field label="Campaign ID" hint="Lowercase letters, numbers, dashes."><input className={inputCls} value={form.campaign} onChange={set('campaign')} required /></Field>
            <Field label="Pack"><select className={inputCls} value={form.pack} onChange={set('pack')}>{PACKS.map((p) => <option key={p}>{p}</option>)}</select></Field>
            <Field label="Geography (optional)"><select className={inputCls} value={form.geo} onChange={set('geo')}><option value="">All</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <button className="btn btn-primary w-full" type="submit">Save campaign</button>
          </form>
        </Panel>
        <Panel title="Tracking URL and QR">
          <p className="text-xs break-all bg-cream-2 rounded-lg p-3 mb-3">{url}</p>
          <div ref={box} className="bg-white p-3 rounded-xl border border-line w-fit mx-auto"><QRCodeSVG value={url} size={200} marginSize={2} level="M" /></div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <button className="btn btn-outline" onClick={() => copy(url)}><Copy size={16} />{copied === url ? 'Copied' : 'Copy URL'}</button>
            <button className="btn btn-outline" onClick={dlPng}><Download size={16} />PNG</button>
            <button className="btn btn-outline" onClick={dlSvg}><Download size={16} />SVG</button>
          </div>
        </Panel>
      </div>
      <Panel title="Saved campaigns" className="mt-4">
        {!list.length ? <p className="text-sm text-ink-soft">No saved campaigns yet.</p> : (
          <ul className="divide-y divide-line">
            {list.map((c) => (
              <li key={c.key} className="py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]"><div className="font-medium text-sm">{c.campaign}</div><div className="text-xs text-ink-soft">{c.source} · {c.pack}{c.geo ? ` · ${c.geo}` : ''}</div></div>
                <span className="text-sm"><b>{scans[c.campaign] || 0}</b> scans</span>
                <button className="btn btn-outline !py-1.5" onClick={() => copy(campaignUrl(c))}><Copy size={14} />{copied === campaignUrl(c) ? 'Copied' : 'Copy'}</button>
                <button className="btn btn-outline !py-1.5" aria-label={`Use ${c.campaign}`} onClick={() => setForm({ source: c.source, campaign: c.campaign, pack: c.pack, geo: c.geo || '' })}>Load</button>
                <button aria-label={`Delete ${c.campaign}`} className="p-2 text-brand" onClick={() => { deleteCampaign(c.key); setList(getCampaigns()); }}><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-ink-soft mt-3">Scan counts come from real consented events in this browser.</p>
      </Panel>
    </>
  );
}
