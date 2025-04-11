// Admin panel functionality
let users = [];

// Load users table
async function loadUsers() {
    try {
        users = await fetchApi('/admin/users');
        renderUsersTable();
    } catch (error) {
        showAlert('Error loading users', 'danger');
    }
}

// Render users table
function renderUsersTable() {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${formatRoles(user.roles)}</td>
            <td>
                <button type="button" class="btn btn-info text-white btn-sm" 
                        onclick="showEditModal(${user.id})">
                    Edit
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" 
                        onclick="showDeleteModal(${user.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Show edit modal
function showEditModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const modalHtml = `
        <div class="modal fade" id="editModal${userId}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit user</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <form id="editForm${userId}">
                            <input type="hidden" name="id" value="${user.id}"/>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">ID</label>
                                <input type="text" class="form-control" value="${user.id}" disabled/>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">First name</label>
                                <input type="text" class="form-control" name="username" value="${user.username}"/>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Last name</label>
                                <input type="text" class="form-control" name="lastName" value="${user.lastName}"/>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Age</label>
                                <input type="number" class="form-control" name="age" value="${user.age}"/>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Email</label>
                                <input type="email" class="form-control" name="email" value="${user.email}"/>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Password</label>
                                <input type="password" class="form-control" name="password" placeholder="Leave empty to keep current"/>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Role</label>
                                <select name="role" class="form-select" multiple size="2">
                                    <option value="1" ${user.roles.some(r => r.name === 'ROLE_ADMIN') ? 'selected' : ''}>ADMIN</option>
                                    <option value="2" ${user.roles.some(r => r.name === 'ROLE_USER') ? 'selected' : ''}>USER</option>
                                </select>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Edit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById(`editModal${userId}`);
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById(`editModal${userId}`));
    modal.show();

    // Handle form submission
    document.getElementById(`editForm${userId}`).addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            lastName: formData.get('lastName'),
            age: parseInt(formData.get('age')),
            email: formData.get('email'),
            password: formData.get('password') || null
        };

        const roles = Array.from(e.target.querySelector('select[name="role"]').selectedOptions)
            .map(option => parseInt(option.value));

        try {
            await fetchApi(`/admin/users/${userId}`, {
                method: 'PUT',
                body: JSON.stringify({ ...userData, roles })
            });
            modal.hide();
            loadUsers();
            showAlert('User updated successfully');
        } catch (error) {
            showAlert('Error updating user', 'danger');
        }
    });
}

// Show delete modal
function showDeleteModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const modalHtml = `
        <div class="modal fade" id="deleteModal${userId}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Delete user</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p>Are you sure you want to delete user "${user.username}"?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" onclick="deleteUser(${userId})">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById(`deleteModal${userId}`);
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById(`deleteModal${userId}`));
    modal.show();
}

// Delete user
async function deleteUser(userId) {
    try {
        await fetchApi(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
        const modal = bootstrap.Modal.getInstance(document.getElementById(`deleteModal${userId}`));
        modal.hide();
        loadUsers();
        showAlert('User deleted successfully');
    } catch (error) {
        showAlert('Error deleting user', 'danger');
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
}); 