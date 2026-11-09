import { Check } from 'lucide-react';
import { resetAdminData } from '../../lib/admin-data.js';
import { PageHeader, Panel } from '../components/ui.jsx';

const GUARDRAILS = [
  ['No unsupported health claims', 'Recipes and copy describe usage and taste only. The recipe editor flags risky words.'],
  ['Privacy and consent', 'Analytics events are stored only after consent. No personal data in event properties or QR URLs.'],
  ['No forced registration', 'Recipes, saving and browsing work without an account.'],
  ['Availability by geography', 'Show products only where they can be delivered; manage per city under Products.'],
  ['Food-safety validation', 'Every recipe is reviewed by a food-safety / R&D owner before publishing.'],
  ['No consumption incentives', 'Rewards or offers must not encourage eating more honey or more frequent consumption.'],
];

export default function SettingsPage() {
  const reset = () => { if (window.confirm('Clear all admin demo data (recipes, products, campaigns) from this browser?')) { resetAdminData(); window.location.reload(); } };
  return (
    <>
      <PageHeader title="Settings" />
      <div className="space-y-4">
        <Panel title="Guardrails checklist">
          <ul className="space-y-3">
            {GUARDRAILS.map(([t, d]) => (
              <li key={t} className="flex gap-3"><span className="mt-0.5 w-6 h-6 rounded-full bg-leaf text-white grid place-items-center shrink-0"><Check size={14} /></span><div><div className="font-medium text-sm">{t}</div><div className="text-sm text-ink-soft">{d}</div></div></li>
            ))}
          </ul>
        </Panel>
        <Panel title="Demo data">
          <p className="text-sm text-ink-soft mb-3">Clears every dh_admin_* key. Analytics events and the shopper cart are not touched.</p>
          <button className="btn btn-outline" onClick={reset}>Reset demo data</button>
        </Panel>
      </div>
    </>
  );
}
