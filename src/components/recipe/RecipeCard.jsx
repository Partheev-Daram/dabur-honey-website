import { Link } from 'react-router-dom';
import { Clock, ChefHat } from 'lucide-react';
import SaveButton from './SaveButton.jsx';

export default function RecipeCard({ recipe }) {
  return (
    <article className="card relative h-full flex flex-col">
      <div className="relative aspect-[4/3] bg-cream-2">
        <img src={recipe.image} alt={recipe.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <SaveButton id={recipe.id} title={recipe.title} className="absolute top-2 right-2" />
      </div>
      <div className="p-3 md:p-4 flex flex-col gap-2 grow">
        <h3 className="font-display font-bold text-base md:text-lg leading-snug text-ink">
          <Link to={`/recipes/${recipe.id}`} className="after:absolute after:inset-0 after:content-[''] after:z-0 focus-visible:underline">{recipe.title}</Link>
        </h3>
        <div className="mt-auto flex items-center gap-3 text-xs md:text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden="true" />{recipe.time} min</span>
          <span className="inline-flex items-center gap-1"><ChefHat size={14} aria-hidden="true" />{recipe.difficulty}</span>
        </div>
      </div>
    </article>
  );
}
