// User page functionality
let currentUser = null;

// Load user information
async function loadUserInfo() {
    try {
        currentUser = await fetchApi('/user/info');
        renderUserTable();
    } catch (error) {
        showAlert('Error loading user information', 'danger');
    }
}

// Render user table
function renderUserTable() {
    if (!currentUser) return;

    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = `
        <tr>
            <td>${currentUser.id}</td>
            <td>${currentUser.username}</td>
            <td>${currentUser.lastName}</td>
            <td>${currentUser.age}</td>
            <td>${currentUser.email}</td>
            <td>${formatRoles(currentUser.roles)}</td>
        </tr>
    `;
}

// Initialize user page
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
}); 