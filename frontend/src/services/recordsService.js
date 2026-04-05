import api from './api';

export function fetchRecords(params) {
  return api.get('/api/financial-records', { params }).then((res) => res.data);
}

export function getRecord(id) {
  return api.get('/api/financial-records/' + id).then((res) => res.data);
}

export function createRecord(body) {
  return api.post('/api/financial-records', body).then((res) => res.data);
}

export function updateRecord(id, body) {
  return api.put('/api/financial-records/' + id, body).then((res) => res.data);
}

export function deleteRecord(id) {
  return api.delete('/api/financial-records/' + id);
}
