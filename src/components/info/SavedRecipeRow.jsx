import { Link } from 'react-router-dom';
import { Clock, Heart, X } from 'lucide-react';
import { toggleSaved } from '../../lib/store.js';

export default function SavedRecipeRow({ recipe, saved }) {
  return (
    <article className="card flex md:flex-col relative">
      <Link to={`/recipes/${recipe.id}`} className="flex md:flex-col flex-1 min-w-0" aria-label={recipe.title}>
        <img src={recipe.image} alt={recipe.title} loading="lazy" className="w-28 h-28 md:w-full md:h-44 object-cover shrink-0" />
        <div className="p-3 md:p-4 min-w-0 flex flex-col justify-center">
          <h3 className="font-display font-bold text-brand-dark leading-snug">{recipe.title}</h3>
          <p className="mt-1 text-sm text-ink-soft flex items-center gap-1.5">
            <Clock size={14} aria-hidden="true" /> {recipe.time} min · {recipe.difficulty}
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleSaved(recipe.id)}
        aria-label={saved ? `Remove ${recipe.title} from saved` : `Save ${recipe.title}`}
        className="absolute top-1 right-1 md:top-2 md:right-2 w-11 h-11 grid place-items-center rounded-full md:bg-white/90 hover:bg-cream-2 text-brand"
      >
        {saved ? <X size={20} /> : <Heart size={20} />}
      </button>
    </article>
  );
}
