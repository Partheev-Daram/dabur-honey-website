import { Link } from 'react-router-dom';
import { useConsent, setConsent } from '../lib/store.js';

export default function ConsentBanner() {
  const consent = useConsent();
  if (consent !== null) return null;
  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed z-50 left-3 right-3 md:right-auto md:left-6 md:bottom-6 md:w-[380px] card p-4 shadow-xl"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 72px)' }}
    >
      <style>{`@media (min-width:768px){[aria-label="Analytics consent"]{bottom:24px !important}}`}</style>
      <p className="text-sm text-ink">We use anonymous analytics to improve recipes. No sign-up needed.</p>
      <div className="mt-3 flex items-center gap-2">
        <button type="button" className="btn btn-outline flex-1" onClick={() => setConsent('declined')}>Decline</button>
        <button type="button" className="btn btn-primary flex-1" onClick={() => setConsent('granted')}>Accept</button>
      </div>
      <Link to="/privacy" className="mt-2 inline-block text-sm font-medium text-brand underline py-2">Learn more</Link>
    </div>
  );
}
