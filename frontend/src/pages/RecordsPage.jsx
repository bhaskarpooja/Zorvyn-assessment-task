import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as recordsService from '../services/recordsService';

const emptyForm = {
  amount: '',
  type: 'EXPENSE',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
};

function TypeTag({ type }) {
  const cls = type === 'INCOME' ? 'tag tag-income' : 'tag tag-expense';
  return <span className={cls}>{type}</span>;
}

export default function RecordsPage() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', category: '', type: '' });
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function load() {
    setError('');
    const params = {};
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (filters.category.trim()) params.category = filters.category.trim();
    if (filters.type) params.type = filters.type;
    recordsService
      .fetchRecords(params)
      .then(setRecords)
      .catch((e) => setError(e.response?.data?.message || e.message || 'Failed to load'));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    const body = {
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      description: form.description || null,
    };
    try {
      if (editingId) {
        await recordsService.updateRecord(editingId, body);
      } else {
        await recordsService.createRecord(body);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Save failed');
    }
  }

  function startEdit(r) {
    setEditingId(r.id);
    setForm({
      amount: String(r.amount),
      type: r.type,
      category: r.category,
      date: r.date,
      description: r.description || '',
    });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return;
    setError('');
    try {
      await recordsService.deleteRecord(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed');
    }
  }

  return (
    <div>
      <h1 className="page-title">Financial records</h1>

      <section className="panel">
        <h2 className="section-title">Filters</h2>
        <div className="filter-row">
          <div className="field">
            <label htmlFor="f-from">From</label>
            <input
              id="f-from"
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="f-to">To</label>
            <input id="f-to" type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="f-cat">Category</label>
            <input
              id="f-cat"
              type="text"
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="f-type">Type</label>
            <select id="f-type" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
              <option value="">Any</option>
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>
          </div>
          <button type="button" className="btn" onClick={load}>
            Apply
          </button>
        </div>
      </section>

      {isAdmin && (
        <section className="panel">
          <h2 className="section-title">{editingId ? 'Edit record' : 'New record'}</h2>
          <form onSubmit={handleSave} className="form-grid">
            <label className="field-block">
              Amount
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </label>
            <label className="field-block">
              Type
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </label>
            <label className="field-block">
              Category
              <input required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
            </label>
            <label className="field-block">
              Date
              <input type="date" required value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </label>
            <label className="field-block">
              Description
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      {error && <p className="alert-error">{error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th className="num">Amount</th>
            <th>Description</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>
                <TypeTag type={r.type} />
              </td>
              <td>{r.category}</td>
              <td className="num">{Number(r.amount).toFixed(2)}</td>
              <td>{r.description ? r.description : <span className="cell-empty">-</span>}</td>
              {isAdmin && (
                <td className="table-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => startEdit(r)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
