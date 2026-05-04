const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('token');

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong');
  }

  return payload;
};

const authedRequest = async (path, options = {}) => {
  const token = getToken();

  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

export const authApi = {
  register: (data) => request('/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => authedRequest('/me'),
  updateProfile: (data) => authedRequest('/me/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) => authedRequest('/me/password', { method: 'PUT', body: JSON.stringify(data) }),
};

export const recipeApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, value);
      }
    });

    return request(`/recipes${query.toString() ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/recipes/${id}`),
  create: (data) => authedRequest('/recipes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authedRequest(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => authedRequest(`/recipes/${id}`, { method: 'DELETE' }),
  comment: (id, text) => authedRequest(`/recipes/${id}/comment`, { method: 'POST', body: JSON.stringify({ text }) }),
  rate: (id, value) => authedRequest(`/recipes/${id}/rate`, { method: 'POST', body: JSON.stringify({ value }) }),
};

export const favoriteApi = {
  toggle: (recipeId) => authedRequest(`/favorites/${recipeId}`, { method: 'POST' }),
  list: () => authedRequest('/favorites'),
};

export const adminApi = {
  users: () => authedRequest('/admin/users'),
};
