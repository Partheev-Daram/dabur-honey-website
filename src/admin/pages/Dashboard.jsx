import { useMemo, useState } from 'react';
import { getEvents } from '../../lib/store.js';
import { computeMetrics, makeDemoEvents } from '../../lib/admin-data.js';
import { PageHeader, Panel, Notice, Collapsible } from '../components/ui.jsx';
import { AreaChart, BarList, Funnel } from '../components/Charts.jsx';

const pct = (x) => `${Math.round(x * 100)}%`;
const Kpi = ({ label, value, sub }) => (
  <div className="card p-4"><div className="text-xs text-ink-soft">{label}</div><div className="font-display text-3xl font-bold text-brand-dark">{value}</div>{sub && <div className="text-xs text-ink-soft mt-0.5">{sub}</div>}</div>
);

export default function Dashboard() {
  const real = useMemo(() => getEvents(), []);
  const lowData = real.length < 20;
  const [useDemo, setUseDemo] = useState(lowData);
  const demo = useMemo(() => makeDemoEvents(), []);
  const events = useDemo ? demo : real;
  const m = useMemo(() => computeMetrics(events), [events]);

  return (
    <>
      <PageHeader title="Dashboard" sub="Engagement from QR scan to recipe to shop.">
        <button className="btn btn-outline" onClick={() => setUseDemo(!useDemo)}>{useDemo ? 'Show my real events' : 'Show illustrative data'}</button>
      </PageHeader>
      <div className="space-y-4">
        {useDemo && <Notice tone="warn"><b>Illustrative demo data.</b> {lowData ? `Only ${real.length} real consented events recorded so far, so sample data is shown.` : 'You are viewing sample data.'}</Notice>}
        {!useDemo && <Notice>Showing {real.length} real events recorded in this browser (consented sessions only).</Notice>}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Kpi label="Unique visitors" value={m.visitors} sub="distinct sessions" />
          <Kpi label="QR scans" value={m.scans} sub={`${m.uniqueScans} unique scanners`} />
          <Kpi label="Recipe views" value={m.recipeViews} sub={`Engagement ${pct(m.engagementRate)}`} />
          <Kpi label="Saved recipes" value={m.saves} />
          <Kpi label="Shop clicks" value={m.shopClicks} sub={`Commerce CTR ${pct(m.commerceCtr)}`} />
          <Kpi label="Orders" value={m.orders} />
        </div>

        <Panel title="Events, last 14 days">
          <AreaChart data={m.trend} series={[{ key: 'events', label: 'All events', color: 'var(--color-brand)' }, { key: 'scans', label: 'QR scans', color: 'var(--color-honey-deep)' }]} />
        </Panel>

        <div className="grid lg:grid-cols-2 gap-4">
          <Panel title="Funnel: Scan to Purchase"><Funnel steps={m.funnel} /></Panel>
          <Panel title="Top recipes (views)"><BarList items={m.topRecipes} empty="No recipe views yet." /></Panel>
          <Panel title="Occasion interest"><BarList items={m.occasions} color="var(--color-brand)" empty="No recipe views yet." /></Panel>
          <Panel title="QR source / pack"><BarList items={m.byPack} color="var(--color-leaf)" empty="No QR scans yet." /></Panel>
          <Panel title="Repeat metrics">
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[['Repeat scanners', m.repeat], ['Back within 30 days', m.r30], ['Back within 90 days', m.r90]].map(([l, v]) => (
                <div key={l}><dd className="font-display text-2xl font-bold text-brand-dark">{v}</dd><dt className="text-xs text-ink-soft">{l}</dt><div className="text-xs text-ink-soft">{m.scannerBase ? pct(v / m.scannerBase) : '0%'}</div></div>
              ))}
            </dl>
            <p className="text-xs text-ink-soft mt-3">Approximate: measured per device/browser session, not per person.</p>
          </Panel>
        </div>

        <Collapsible title="Metric definitions">
          <p><b>Unique scans</b>: distinct consented sessions with a qr_scan event.</p>
          <p><b>Recipe engagement</b>: sessions with recipe_view AND (recipe_start or recipe_save), divided by recipe-view sessions.</p>
          <p><b>Commerce CTR</b>: shop clicks (shop_click + shop_add) / recipe-view sessions.</p>
          <p><b>Repeat scanners</b>: sessions with qr_scan on 2 or more distinct days (approximate; per device).</p>
          <p><b>30-day / 90-day repeat</b>: scanners who scan again on a later day within 30 / 90 days of their first scan.</p>
          <p><b>Orders</b>: purchase events. A QR scan is not proof of purchase or consumption.</p>
        </Collapsible>
        <p className="text-xs text-ink-soft text-center">Illustrative dashboard data, not actual Dabur performance.</p>
      </div>
    </>
  );
}
