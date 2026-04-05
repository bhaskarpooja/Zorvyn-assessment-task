import { useEffect, useState } from 'react';
import * as usersService from '../services/usersService';

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'VIEWER',
  status: 'ACTIVE',
};

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  function load() {
    setError('');
    usersService
      .fetchUsers()
      .then(setUsers)
      .catch((e) => setError(e.response?.data?.message || e.message || 'Failed to load users'));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const body = {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        };
        if (form.password.trim()) body.password = form.password;
        await usersService.updateUser(editingId, body);
      } else {
        await usersService.createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          status: form.status,
        });
      }
      setForm(emptyUser);
      setEditingId(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Save failed';
      setError(msg);
    }
  }

  function startEdit(u) {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      status: u.status,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      await usersService.deleteUser(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed');
    }
  }

  return (
    <div>
      <h1 className="page-title">Users</h1>

      <section className="panel">
        <h2 className="section-title">{editingId ? 'Edit user' : 'Create user'}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field-block">
            Name
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </label>
          <label className="field-block">
            Email
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </label>
          <label className="field-block">
            Password
            {editingId && <span className="muted"> Optional when editing.</span>}
            <input
              type="password"
              required={!editingId}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </label>
          <label className="field-block">
            Role
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="VIEWER">VIEWER</option>
              <option value="ANALYST">ANALYST</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <label className="field-block">
            Status
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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
                  setForm(emptyUser);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {error && <p className="alert-error">{error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td className="table-actions">
                <button type="button" className="btn btn-ghost" onClick={() => startEdit(u)}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
