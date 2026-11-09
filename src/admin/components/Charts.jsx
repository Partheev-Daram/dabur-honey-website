// Lightweight SVG/CSS charts (no chart library).
export function AreaChart({ data, series }) {
  const W = 600, H = 200, P = 28;
  const max = Math.max(1, ...data.flatMap((d) => series.map((s) => d[s.key])));
  const x = (i) => P + (i * (W - P * 2)) / (data.length - 1);
  const y = (v) => H - P - (v / max) * (H - P * 2);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="14-day trend">
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={P} x2={W - P} y1={y(max * f)} y2={y(max * f)} stroke="var(--color-line)" />
            <text x={P - 4} y={y(max * f) + 4} fontSize="10" textAnchor="end" fill="var(--color-ink-soft)">{Math.round(max * f)}</text>
          </g>
        ))}
        {series.map((s) => {
          const pts = data.map((d, i) => `${x(i)},${y(d[s.key])}`);
          return (
            <g key={s.key}>
              <polygon points={`${x(0)},${y(0)} ${pts.join(' ')} ${x(data.length - 1)},${y(0)}`} fill={s.color} opacity="0.15" />
              <polyline points={pts.join(' ')} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
            </g>
          );
        })}
        {data.map((d, i) => (i % 2 === 0 || i === data.length - 1) && (
          <text key={d.day} x={x(i)} y={H - 8} fontSize="10" textAnchor="middle" fill="var(--color-ink-soft)">{d.day.slice(5)}</text>
        ))}
      </svg>
      <div className="flex gap-4 text-xs mt-1">
        {series.map((s) => <span key={s.key} className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm inline-block" style={{ background: s.color }} />{s.label}</span>)}
      </div>
    </div>
  );
}

export function BarList({ items, color = 'var(--color-honey-deep)', empty = 'No data yet.' }) {
  if (!items.length) return <p className="text-sm text-ink-soft">{empty}</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex justify-between text-sm gap-3"><span className="truncate">{i.label}</span><b>{i.value}</b></div>
          <div className="h-2 rounded-full bg-cream-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(i.value / max) * 100}%`, background: color }} /></div>
        </li>
      ))}
    </ul>
  );
}

export function Funnel({ steps }) {
  const top = Math.max(steps[0]?.[1] || 0, 1);
  return (
    <ol className="space-y-2.5">
      {steps.map(([label, n], i) => {
        const prev = i ? steps[i - 1][1] : null;
        const conv = prev ? Math.round((n / prev) * 100) : null;
        return (
          <li key={label}>
            <div className="flex justify-between text-sm gap-3">
              <span>{i + 1}. {label}</span>
              <span><b>{n}</b>{conv != null && <span className="text-ink-soft"> · {conv}% of previous</span>}</span>
            </div>
            <div className="h-6 rounded-lg bg-cream-2 overflow-hidden">
              <div className="h-full rounded-lg" style={{ width: `${Math.max((n / top) * 100, n ? 2 : 0)}%`, background: `color-mix(in srgb, var(--color-brand) ${100 - i * 14}%, var(--color-honey))` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
