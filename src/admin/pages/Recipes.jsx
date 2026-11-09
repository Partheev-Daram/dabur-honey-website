import { useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Download, Upload, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { getAllRecipes, saveRecipe, deleteRecipe, exportRecipesJSON, importRecipesJSON, healthClaimHits } from '../../lib/admin-data.js';
import { PageHeader, Notice } from '../components/ui.jsx';
import RecipeForm from '../components/RecipeForm.jsx';

export default function Recipes() {
  const [list, setList] = useState(getAllRecipes);
  const [editing, setEditing] = useState(null); // null | 'new' | recipe
  const [msg, setMsg] = useState('');
  const file = useRef(null);
  const refresh = () => setList(getAllRecipes());

  const onSave = (r) => { saveRecipe(r); refresh(); setEditing(null); };
  const togglePublish = (r) => { saveRecipe({ ...r, status: r.status === 'published' ? 'draft' : 'published' }); refresh(); };
  const remove = (r) => { if (window.confirm(`Delete "${r.title}"?`)) { deleteRecipe(r.id); refresh(); } };
  const doExport = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([exportRecipesJSON()], { type: 'application/json' }));
    a.download = 'dabur-honey-recipes.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
  };
  const doImport = async (e) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    try { setMsg(`Imported ${importRecipesJSON(await f.text())} recipes.`); refresh(); } catch (err) { setMsg(`Import failed: ${err.message}`); }
  };

  if (editing) return <RecipeForm initial={editing === 'new' ? null : editing} onSave={onSave} onCancel={() => setEditing(null)} />;

  return (
    <>
      <PageHeader title="Recipes" sub={`${list.length} recipes`}>
        <button className="btn btn-primary" onClick={() => setEditing('new')}><Plus size={16} />Add recipe</button>
        <button className="btn btn-outline" onClick={doExport}><Download size={16} />Export JSON</button>
        <button className="btn btn-outline" onClick={() => file.current.click()}><Upload size={16} />Import JSON</button>
        <input ref={file} type="file" accept="application/json" hidden onChange={doImport} />
      </PageHeader>
      <div className="space-y-3 mb-4">
        <Notice>Prototype: changes are stored in this browser; production would publish to the database. Published recipes appear on this browser's public site immediately; drafts and deleted recipes are hidden.</Notice>
        {msg && <Notice tone="warn">{msg}</Notice>}
      </div>
      <div className="grid gap-3">
        {list.map((r) => {
          const claims = healthClaimHits(r);
          return (
            <article key={r.id} className="card p-3 flex gap-3 items-center">
              <img src={r.image} alt="" className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover bg-cream-2 shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">{r.title}</h2>
                <p className="text-xs text-ink-soft truncate">{(r.occasions || []).join(', ')} · {r.time} min · {r.difficulty}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`text-xs rounded-full px-2 py-0.5 ${r.status === 'published' ? 'bg-leaf/15 text-leaf' : 'bg-cream-2 text-ink-soft'}`}>{r.status}</span>
                  {claims.length > 0 && <span className="text-xs rounded-full px-2 py-0.5 bg-amber-100 text-amber-900 inline-flex items-center gap-1"><AlertTriangle size={12} />health-claim warning</span>}
                </div>
              </div>
              <div className="flex shrink-0">
                <button className="p-2.5" aria-label={r.status === 'published' ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(r)}>{r.status === 'published' ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                <button className="p-2.5" aria-label="Edit" onClick={() => setEditing(r)}><Pencil size={18} /></button>
                <button className="p-2.5 text-brand" aria-label="Delete" onClick={() => remove(r)}><Trash2 size={18} /></button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
