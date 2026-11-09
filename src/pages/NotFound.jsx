import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="h-display text-4xl">Page not found</h1>
      <p className="mt-3 text-ink-soft">That page doesn't exist. Let's get you back to the recipes.</p>
      <Link to="/recipes" className="btn btn-primary mt-6">Explore Recipes</Link>
    </div>
  );
}
