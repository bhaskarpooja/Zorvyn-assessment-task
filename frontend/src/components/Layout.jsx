import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, role } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-brand">Ledger</span>
        <nav className="app-nav">
          <Link to="/">Dashboard</Link>
          {(role === 'ANALYST' || role === 'ADMIN') && <Link to="/records">Records</Link>}
          {role === 'ADMIN' && <Link to="/admin">Users</Link>}
        </nav>
        <span className="app-user">
          <strong>{user?.name}</strong>
          <span className="muted"> ({role})</span>
        </span>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Sign out
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
