import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const PageHeader = ({ title, children, sub }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
    <div><h1 className="h-display text-3xl md:text-4xl">{title}</h1>{sub && <p className="text-sm text-ink-soft mt-1 max-w-2xl">{sub}</p>}</div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export const Panel = ({ title, children, className = '' }) => (
  <section className={`card p-4 md:p-5 ${className}`}>
    {title && <h2 className="font-semibold text-brand-dark mb-3">{title}</h2>}
    {children}
  </section>
);

export const Field = ({ label, children, hint }) => (
  <label className="block text-sm">
    <span className="font-medium">{label}</span>
    <div className="mt-1">{children}</div>
    {hint && <span className="text-xs text-ink-soft">{hint}</span>}
  </label>
);
export const inputCls = 'w-full rounded-xl border border-line bg-white px-3 py-2.5 text-base md:text-sm min-h-[44px]';

export const Notice = ({ tone = 'info', children }) => (
  <div className={`rounded-xl px-4 py-3 text-sm border ${tone === 'warn' ? 'bg-amber-50 border-amber-300 text-amber-900' : tone === 'error' ? 'bg-brand-soft border-brand text-brand-dark' : 'bg-cream-2 border-line text-ink'}`}>{children}</div>
);

export function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <button type="button" className="w-full flex items-center justify-between px-4 py-3 font-semibold text-brand-dark min-h-[44px]" aria-expanded={open} onClick={() => setOpen(!open)}>
        {title}<ChevronDown size={18} className={open ? 'rotate-180 transition' : 'transition'} />
      </button>
      {open && <div className="px-4 pb-4 text-sm space-y-2">{children}</div>}
    </div>
  );
}

export const Toggle = ({ checked, onChange, label }) => (
  <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
    className={`relative w-12 h-7 rounded-full transition shrink-0 ${checked ? 'bg-leaf' : 'bg-line'}`}>
    <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
  </button>
);
