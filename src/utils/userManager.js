import { getUsers, setUsers } from './storage.js';

function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

const HARD_CODED_ADMIN_USERNAME = 'admin';

export function getAllUsers() {
  const users = getUsers();
  return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function createUser({ username, password, displayName, role }) {
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }

  if (!password || typeof password !== 'string' || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
    return { success: false, error: 'Display name is required.' };
  }

  const validRoles = ['admin', 'viewer'];
  const assignedRole = role && validRoles.includes(role) ? role : 'viewer';

  const trimmedUsername = username.trim().toLowerCase();
  const trimmedDisplayName = displayName.trim();

  if (trimmedUsername === HARD_CODED_ADMIN_USERNAME) {
    return { success: false, error: 'Username is already taken.' };
  }

  const users = getUsers();
  const exists = users.some((u) => u.username.toLowerCase() === trimmedUsername);

  if (exists) {
    return { success: false, error: 'Username is already taken.' };
  }

  const now = new Date().toISOString();
  const newUser = {
    id: generateId(),
    username: trimmedUsername,
    displayName: trimmedDisplayName,
    password: password,
    role: assignedRole,
    createdAt: now,
  };

  users.push(newUser);
  setUsers(users);

  return { success: true, user: newUser };
}

export function canDeleteUser(userId, session) {
  if (!userId || typeof userId !== 'string') {
    return false;
  }

  if (!session || !session.userId) {
    return false;
  }

  if (session.role !== 'admin') {
    return false;
  }

  if (userId === session.userId) {
    return false;
  }

  if (userId === 'admin') {
    return false;
  }

  const users = getUsers();
  const targetUser = users.find((u) => u.id === userId);

  if (!targetUser) {
    return false;
  }

  if (targetUser.username.toLowerCase() === HARD_CODED_ADMIN_USERNAME) {
    return false;
  }

  return true;
}

export function deleteUser(userId, session) {
  if (!session || !session.userId) {
    return { success: false, error: 'You must be logged in to delete a user.' };
  }

  if (session.role !== 'admin') {
    return { success: false, error: 'Only admins can delete users.' };
  }

  if (!userId || typeof userId !== 'string') {
    return { success: false, error: 'User ID is required.' };
  }

  if (userId === session.userId) {
    return { success: false, error: 'You cannot delete yourself.' };
  }

  if (userId === 'admin') {
    return { success: false, error: 'Cannot delete the built-in admin account.' };
  }

  const users = getUsers();
  const targetUser = users.find((u) => u.id === userId);

  if (!targetUser) {
    return { success: false, error: 'User not found.' };
  }

  if (targetUser.username.toLowerCase() === HARD_CODED_ADMIN_USERNAME) {
    return { success: false, error: 'Cannot delete the built-in admin account.' };
  }

  const updatedUsers = users.filter((u) => u.id !== userId);
  setUsers(updatedUsers);

  return { success: true };
}