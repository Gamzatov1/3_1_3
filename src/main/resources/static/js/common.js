// Common utility functions
const API_BASE_URL = '/api';

// Fetch wrapper with error handling
async function fetchApi(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container-fluid').insertBefore(alertDiv, document.querySelector('.row'));
    setTimeout(() => alertDiv.remove(), 5000);
}

// Format roles for display
function formatRoles(roles) {
    return roles.map(role => role.name.replace('ROLE_', '')).join(', ');
}

// Get current user info
async function getCurrentUser() {
    try {
        const user = await fetchApi('/auth/current-user');
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Update user info in navbar
async function updateNavbarUserInfo() {
    const user = await getCurrentUser();
    if (user) {
        const userInfoSpan = document.querySelector('.navbar .text-white');
        if (userInfoSpan) {
            userInfoSpan.innerHTML = `
                <strong>${user.email}</strong> with roles: ${formatRoles(user.roles)}
            `;
        }
    }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarUserInfo();
}); 