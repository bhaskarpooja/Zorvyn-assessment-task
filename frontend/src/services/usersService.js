import api from './api';

export function fetchUsers() {
  return api.get('/api/users').then((res) => res.data);
}

export function createUser(body) {
  return api.post('/api/users', body).then((res) => res.data);
}

export function updateUser(id, body) {
  return api.put('/api/users/' + id, body).then((res) => res.data);
}

export function deleteUser(id) {
  return api.delete('/api/users/' + id);
}
