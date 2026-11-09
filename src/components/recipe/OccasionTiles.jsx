import { Link } from 'react-router-dom';
import { OCCASIONS } from '../../data/recipes.js';

export default function OccasionTiles() {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {OCCASIONS.map((o) => (
        <li key={o.id}>
          <Link to={`/recipes?occasion=${o.id}`} className="card block group hover:-translate-y-0.5 transition-transform" aria-label={`${o.label} recipes`}>
            <div className="aspect-square bg-cream-2 overflow-hidden">
              <img src={o.image} alt={o.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="py-2.5 text-center font-semibold text-ink">{o.label}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
