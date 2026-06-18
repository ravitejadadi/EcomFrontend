const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function handleUnauthorized() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const isAdmin = window.location.pathname.startsWith('/admin');
    window.location.href = isAdmin ? '/admin/login' : '/auth';
}

async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error('Session expired. Please log in again.');
    }

    return res;
}

async function apiUpload(path, formData) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData });

    if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error('Session expired. Please log in again.');
    }

    return res;
}

export { BASE_URL, apiFetch, apiUpload };
