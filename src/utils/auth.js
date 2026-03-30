import { getUsers, setUsers, getSession, setSession, clearSession } from './storage.js';

function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

const HARD_CODED_ADMIN = {
  id: 'admin',
  username: 'admin',
  displayName: 'Administrator',
  password: 'admin',
  role: 'admin',
  createdAt: new Date(0).toISOString(),
};

export function login(username, password) {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return { success: false, error: 'Username is required.' };
  }

  if (!password || typeof password !== 'string') {
    return { success: false, error: 'Password is required.' };
  }

  const trimmedUsername = username.trim().toLowerCase();

  if (trimmedUsername === HARD_CODED_ADMIN.username && password === HARD_CODED_ADMIN.password) {
    const session = {
      userId: HARD_CODED_ADMIN.id,
      role: HARD_CODED_ADMIN.role,
      username: HARD_CODED_ADMIN.username,
      displayName: HARD_CODED_ADMIN.displayName,
      loginAt: new Date().toISOString(),
    };
    setSession(session);
    return { success: true, user: session };
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === trimmedUsername && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid credentials.' };
  }

  const session = {
    userId: user.id,
    role: user.role,
    username: user.username,
    displayName: user.displayName,
    loginAt: new Date().toISOString(),
  };
  setSession(session);
  return { success: true, user: session };
}

export function register({ username, password, displayName }) {
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }

  if (!password || typeof password !== 'string' || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
    return { success: false, error: 'Display name is required.' };
  }

  const trimmedUsername = username.trim().toLowerCase();
  const trimmedDisplayName = displayName.trim();

  if (trimmedUsername === HARD_CODED_ADMIN.username) {
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
    role: 'viewer',
    createdAt: now,
  };

  users.push(newUser);
  setUsers(users);

  const session = {
    userId: newUser.id,
    role: newUser.role,
    username: newUser.username,
    displayName: newUser.displayName,
    loginAt: now,
  };
  setSession(session);
  return { success: true, user: session };
}

export function logout() {
  clearSession();
}

export function getCurrentUser() {
  return getSession();
}