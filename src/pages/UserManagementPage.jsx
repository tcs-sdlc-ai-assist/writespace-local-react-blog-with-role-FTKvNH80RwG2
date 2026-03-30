import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/auth.js';
import { getAllUsers, createUser, deleteUser, canDeleteUser } from '../utils/userManager.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Avatar from '../components/Avatar.jsx';

function UserManagementPage() {
  const user = getCurrentUser();

  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  function resetForm() {
    setUsername('');
    setDisplayName('');
    setPassword('');
    setRole('viewer');
    setError('');
  }

  function handleToggleForm() {
    if (showCreateForm) {
      resetForm();
    }
    setShowCreateForm(!showCreateForm);
    setSuccessMessage('');
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const result = createUser({
      username,
      password,
      displayName,
      role,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setUsers(getAllUsers());
    resetForm();
    setShowCreateForm(false);
    setSuccessMessage('User created successfully.');
  }

  function handleDeleteUser(userId) {
    const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    setSuccessMessage('');

    const result = deleteUser(userId, user);

    if (!result.success) {
      return;
    }

    setUsers(getAllUsers());
    setSuccessMessage('User deleted successfully.');
  }

  const hardCodedAdmin = {
    id: 'admin',
    username: 'admin',
    displayName: 'Administrator',
    role: 'admin',
    createdAt: new Date(0).toISOString(),
  };

  const allUsersWithAdmin = [hardCodedAdmin, ...users];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage users and their roles on the platform.
              </p>
            </div>
            <button
              onClick={handleToggleForm}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              {showCreateForm ? 'Cancel' : '➕ Create User'}
            </button>
          </div>

          {successMessage && (
            <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Create User Form */}
          {showCreateForm && (
            <div className="mb-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>
              <form onSubmit={handleCreateUser} className="space-y-5">
                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="newUsername"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      id="newUsername"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newDisplayName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Display Name
                    </label>
                    <input
                      id="newDisplayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter display name"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Create a password"
                      autoComplete="new-password"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newRole"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="newRole"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleToggleForm}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users List */}
          {allUsersWithAdmin.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allUsersWithAdmin.map((u) => {
                      const canDelete = canDeleteUser(u.id, user);

                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <Avatar role={u.role} size="sm" />
                              <span className="text-sm font-medium text-gray-900">
                                {u.displayName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">
                              {u.username}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {u.role === 'admin' ? 'Admin' : 'Viewer'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500">
                              {formatDate(u.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={!canDelete}
                              className={`p-1.5 rounded-md transition-colors ${
                                canDelete
                                  ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                  : 'text-gray-200 cursor-not-allowed'
                              }`}
                              title={
                                canDelete
                                  ? 'Delete user'
                                  : u.id === 'admin'
                                  ? 'Cannot delete built-in admin'
                                  : u.id === user?.userId
                                  ? 'Cannot delete yourself'
                                  : 'Cannot delete this user'
                              }
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="sm:hidden space-y-4">
                {allUsersWithAdmin.map((u) => {
                  const canDelete = canDeleteUser(u.id, user);

                  return (
                    <div
                      key={u.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar role={u.role} size="md" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {u.displayName}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{u.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={!canDelete}
                          className={`p-1.5 rounded-md transition-colors ${
                            canDelete
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-200 cursor-not-allowed'
                          }`}
                          title={
                            canDelete
                              ? 'Delete user'
                              : u.id === 'admin'
                              ? 'Cannot delete built-in admin'
                              : u.id === user?.userId
                              ? 'Cannot delete yourself'
                              : 'Cannot delete this user'
                          }
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {u.role === 'admin' ? 'Admin' : 'Viewer'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(u.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="text-4xl mb-4">👥</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users yet
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first user.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-block px-5 py-2.5 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Create Your First User
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UserManagementPage;