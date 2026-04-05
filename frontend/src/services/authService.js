import api, { setAuthToken } from './api';

const STORAGE_KEY = 'finance_auth';

export function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.token) setAuthToken(data.token);
    return data;
  } catch {
    return null;
  }
}

export function persistAuth({ token, email, name, role }) {
  const payload = { token, email, name, role };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  setAuthToken(token);
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
  setAuthToken(null);
}

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  persistAuth(data);
  return data;
}

export function logout() {
  clearAuth();
}
