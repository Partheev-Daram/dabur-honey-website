import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { OCCASIONS } from '../../data/recipes.js';
import { RECIPE_IMAGES, validateRecipe, slugify, getAllRecipes } from '../../lib/admin-data.js';
import { Field, Notice, inputCls } from './ui.jsx';

const blank = () => ({ id: '', title: '', description: '', occasions: [], time: 5, difficulty: 'Easy', serves: 1, honey: '1 tsp', image: RECIPE_IMAGES[0], ingredients: [{ name: '', qty: '' }], steps: [''], status: 'draft' });

export default function RecipeForm({ initial, onSave, onCancel }) {
  const isNew = !initial;
  const [r, setR] = useState(() => initial ? { ...blank(), ...initial } : blank());
  const [errs, setErrs] = useState([]);
  const set = (k, v) => setR((p) => ({ ...p, [k]: v }));
  const setRow = (key, i, v) => set(key, r[key].map((x, j) => (j === i ? v : x)));
  const { warnings } = validateRecipe(r);

  const submit = (e) => {
    e.preventDefault();
    const { errors } = validateRecipe(r);
    let id = r.id || slugify(r.title);
    if (isNew && getAllRecipes({ includeDeleted: true }).some((x) => x.id === id)) id += '-' + Date.now().toString(36).slice(-4);
    if (errors.length) return setErrs(errors);
    onSave({
      ...r, id, title: r.title.trim(), time: Number(r.time) || 0, serves: Number(r.serves) || 1,
      ingredients: r.ingredients.filter((i) => i.name.trim()), steps: r.steps.map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="card p-4 md:p-6 space-y-4">
      <h2 className="font-semibold text-brand-dark text-lg">{isNew ? 'New recipe' : `Edit: ${initial.title}`}</h2>
      {errs.length > 0 && <Notice tone="error">{errs.map((e) => <div key={e}>{e}</div>)}</Notice>}
      {warnings.length > 0 && <Notice tone="warn"><b>Health-claim warning:</b> text contains "{warnings.join('", "')}". Remove wording that implies health benefits before publishing.</Notice>}
      <Field label="Title *"><input className={inputCls} value={r.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Short description"><textarea className={inputCls} rows={2} value={r.description} onChange={(e) => set('description', e.target.value)} /></Field>
      <div>
        <div className="text-sm font-medium mb-1.5">Occasions</div>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => <button key={o.id} type="button" aria-pressed={r.occasions.includes(o.id)} className="chip" onClick={() => set('occasions', r.occasions.includes(o.id) ? r.occasions.filter((x) => x !== o.id) : [...r.occasions, o.id])}>{o.label}</button>)}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Time (min)"><input type="number" min="1" className={inputCls} value={r.time} onChange={(e) => set('time', e.target.value)} /></Field>
        <Field label="Difficulty"><select className={inputCls} value={r.difficulty} onChange={(e) => set('difficulty', e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select></Field>
        <Field label="Serves"><input type="number" min="1" className={inputCls} value={r.serves} onChange={(e) => set('serves', e.target.value)} /></Field>
        <Field label="Honey qty"><input className={inputCls} value={r.honey} onChange={(e) => set('honey', e.target.value)} /></Field>
      </div>
      <div>
        <div className="text-sm font-medium mb-1.5">Image</div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {RECIPE_IMAGES.map((src) => (
            <button key={src} type="button" onClick={() => set('image', src)} aria-pressed={r.image === src} aria-label={src.split('/').pop()}
              className={`shrink-0 rounded-xl overflow-hidden border-2 ${r.image === src ? 'border-brand' : 'border-transparent'}`}><img src={src} alt="" className="w-20 h-20 object-cover" loading="lazy" /></button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-1.5">Ingredients</div>
        <div className="space-y-2">
          {r.ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input aria-label="Ingredient" placeholder="Ingredient" className={inputCls} value={ing.name} onChange={(e) => setRow('ingredients', i, { ...ing, name: e.target.value })} />
              <input aria-label="Quantity" placeholder="Qty" className={`${inputCls} !w-32`} value={ing.qty} onChange={(e) => setRow('ingredients', i, { ...ing, qty: e.target.value })} />
              <button type="button" aria-label="Remove ingredient" className="p-2 text-brand" onClick={() => set('ingredients', r.ingredients.filter((_, j) => j !== i))}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline mt-2 !py-1.5" onClick={() => set('ingredients', [...r.ingredients, { name: '', qty: '' }])}><Plus size={14} />Ingredient</button>
      </div>
      <div>
        <div className="text-sm font-medium mb-1.5">Steps *</div>
        <div className="space-y-2">
          {r.steps.map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-3 text-sm text-ink-soft w-5">{i + 1}.</span>
              <textarea aria-label={`Step ${i + 1}`} rows={2} className={inputCls} value={s} onChange={(e) => setRow('steps', i, e.target.value)} />
              <button type="button" aria-label="Remove step" className="p-2 text-brand" onClick={() => set('steps', r.steps.filter((_, j) => j !== i))}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline mt-2 !py-1.5" onClick={() => set('steps', [...r.steps, ''])}><Plus size={14} />Step</button>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <button className="btn btn-primary" type="submit">Save recipe</button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
