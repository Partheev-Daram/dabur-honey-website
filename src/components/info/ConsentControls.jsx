import { useConsent, setConsent } from '../../lib/store.js';

export function clearMyData() {
  if (!window.confirm('Clear saved recipes, cart, preferences and analytics data on this device? This cannot be undone.')) return;
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('dh_')).forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch { /* storage unavailable */ }
  window.location.reload();
}

export default function ConsentControls() {
  const consent = useConsent();
  const label = consent === 'granted' ? 'Analytics: On' : consent === 'declined' ? 'Analytics: Off' : 'Analytics: Not chosen yet';
  const opt = (value, text) => (
    <button
      type="button"
      className={`btn ${consent === value ? 'btn-primary' : 'btn-outline'}`}
      aria-pressed={consent === value}
      onClick={() => setConsent(value)}
    >
      {text}
    </button>
  );
  return (
    <div>
      <p className="font-semibold" role="status">{label}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {opt('granted', 'Allow analytics')}
        {opt('declined', 'Decline analytics')}
      </div>
      <button type="button" className="btn btn-outline mt-4" onClick={clearMyData}>Clear my data on this device</button>
    </div>
  );
}
