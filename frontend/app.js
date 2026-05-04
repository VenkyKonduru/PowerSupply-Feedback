const API_URL = 'http://localhost:5000/api';

async function callAPI(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        return { message: 'Network error or server down' };
    }
}

function showMessage(msg, type = 'info') {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    messageDiv.innerText = msg;
    messageDiv.style.color = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#94a3b8');
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }
    return JSON.parse(localStorage.getItem('user'));
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Password Visibility Toggle Logic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-password') || e.target.closest('.toggle-password')) {
        const btn = e.target.classList.contains('toggle-password') ? e.target : e.target.closest('.toggle-password');
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('svg');

        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>';
        } else {
            input.type = 'password';
            icon.innerHTML = '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/>';
        }
    }
});
