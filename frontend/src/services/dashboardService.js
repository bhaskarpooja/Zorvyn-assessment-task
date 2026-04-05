import api from './api';

export function fetchDashboard() {
  return api.get('/api/dashboard').then((r) => r.data);
}
