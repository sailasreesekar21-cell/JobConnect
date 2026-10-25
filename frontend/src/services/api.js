const API_URL = import.meta.env.VITE_API_URL || 'https://jobconnect-k49o.onrender.com/api';

function getToken() {
  return localStorage.getItem('jobconnect_token');
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const authToken = token ?? getToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error(
      'Cannot reach the JobConnect API. Please check your connection and try again.'
    );
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }
  return data;
}

export const authApi = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  me: () => apiRequest('/auth/me'),
};

export const userApi = {
  getProfile: () => apiRequest('/users/profile'),
  updateProfile: (payload) => apiRequest('/users/profile', { method: 'PUT', body: payload }),
};

export const jobApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, value]) => value))
    ).toString();
    return apiRequest(`/jobs${query ? `?${query}` : ''}`);
  },
  get: (id) => apiRequest(`/jobs/${id}`),
  create: (payload) => apiRequest('/jobs', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/jobs/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/jobs/${id}`, { method: 'DELETE' }),
  mine: () => apiRequest('/jobs/recruiter/mine'),
};

export const applicationApi = {
  apply: (payload) => apiRequest('/applications', { method: 'POST', body: payload }),
  mine: () => apiRequest('/applications/mine'),
  byJob: (jobId) => apiRequest(`/applications/job/${jobId}`),
  get: (id) => apiRequest(`/applications/${id}`),
  updateStatus: (id, status) =>
    apiRequest(`/applications/${id}/status`, { method: 'PATCH', body: { status } }),
};

export const adminApi = {
  stats: () => apiRequest('/admin/stats'),
  users: () => apiRequest('/admin/users'),
  recruiters: () => apiRequest('/admin/recruiters'),
  jobs: () => apiRequest('/admin/jobs'),
  applications: () => apiRequest('/admin/applications'),
  deleteJob: (id) => apiRequest(`/admin/jobs/${id}`, { method: 'DELETE' }),
};

export const contactApi = {
  send: (payload) => apiRequest('/contact', { method: 'POST', body: payload }),
};
