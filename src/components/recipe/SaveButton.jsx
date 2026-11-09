import { Heart } from 'lucide-react';
import { useSaved, toggleSaved } from '../../lib/store.js';

// Round heart overlay button (used on cards).
export default function SaveButton({ id, title = 'recipe', className = '' }) {
  const saved = useSaved().includes(id);
  return (
    <button
      type="button"
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      aria-pressed={saved}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaved(id); }}
      className={`grid place-items-center w-11 h-11 rounded-full bg-white/90 shadow hover:bg-white ${className}`}
    >
      <Heart size={20} className={saved ? 'text-brand' : 'text-ink'} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
