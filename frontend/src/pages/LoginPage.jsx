import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Sign in</h1>
        <p className="subtitle">Finance workspace</p>
        <details className="login-hint">
          <summary>Sample accounts</summary>
          <div className="hint-body">
            admin@finance.local / admin123
            <br />
            analyst@finance.local / analyst123
            <br />
            viewer@finance.local / viewer123
          </div>
        </details>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field-block">
              Email
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
            </label>
            <label className="field-block">
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
          </div>
          {error && <p className="alert-error">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
