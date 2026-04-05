import axios from 'axios';

const api = axios.create({
  baseURL: typeof import.meta.env.VITE_API_BASE === 'string' ? import.meta.env.VITE_API_BASE : '',
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
