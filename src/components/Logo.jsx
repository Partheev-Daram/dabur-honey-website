// Stylised wordmark placeholder (not the official Dabur logo asset — swap for the brand SVG at launch).
export default function Logo({ className = '', size = 'md' }) {
  const s = size === 'lg' ? 1.3 : size === 'sm' ? 0.8 : 1;
  return (
    <span className={`inline-flex items-center gap-1 select-none ${className}`} aria-label="Dabur Honey" style={{ fontSize: 16 * s }}>
      <span className="font-display italic font-bold text-white bg-brand rounded-lg px-2 py-0.5 leading-none" style={{ transform: 'skew(-6deg)' }}>Dabur</span>
      <span className="font-display italic font-bold text-brand-dark leading-none" style={{ fontSize: '1.5em' }}>Honey</span>
    </span>
  );
}
