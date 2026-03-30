const KEYS = {
  USERS: 'ws_users',
  POSTS: 'ws_posts',
  SESSION: 'ws_session',
  SCHEMA_VERSION: 'ws_schema_version',
};

let memoryFallback = {
  [KEYS.USERS]: [],
  [KEYS.POSTS]: [],
  [KEYS.SESSION]: null,
};

let useMemoryFallback = false;

function isLocalStorageAvailable() {
  try {
    const testKey = '__ws_storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

if (!isLocalStorageAvailable()) {
  useMemoryFallback = true;
  console.warn('WriteSpace: localStorage is unavailable. Using in-memory fallback. Data will not persist across page reloads.');
}

function readFromStorage(key, fallback) {
  if (useMemoryFallback) {
    return memoryFallback[key] !== undefined ? memoryFallback[key] : fallback;
  }

  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error(`WriteSpace: Failed to read "${key}" from localStorage. Returning fallback.`, error);
    try {
      localStorage.removeItem(key);
    } catch {
      // silent
    }
    return fallback;
  }
}

function writeToStorage(key, value) {
  if (useMemoryFallback) {
    memoryFallback[key] = value;
    return;
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`WriteSpace: Failed to write "${key}" to localStorage. Falling back to memory.`, error);
    memoryFallback[key] = value;
  }
}

function removeFromStorage(key) {
  if (useMemoryFallback) {
    memoryFallback[key] = key === KEYS.SESSION ? null : [];
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`WriteSpace: Failed to remove "${key}" from localStorage.`, error);
    memoryFallback[key] = key === KEYS.SESSION ? null : [];
  }
}

export function getUsers() {
  const users = readFromStorage(KEYS.USERS, []);
  if (!Array.isArray(users)) {
    console.warn('WriteSpace: Corrupted users data detected. Resetting to empty array.');
    setUsers([]);
    return [];
  }
  return users;
}

export function setUsers(users) {
  if (!Array.isArray(users)) {
    console.error('WriteSpace: setUsers expects an array.');
    return;
  }
  writeToStorage(KEYS.USERS, users);
}

export function getPosts() {
  const posts = readFromStorage(KEYS.POSTS, []);
  if (!Array.isArray(posts)) {
    console.warn('WriteSpace: Corrupted posts data detected. Resetting to empty array.');
    setPosts([]);
    return [];
  }
  return posts;
}

export function setPosts(posts) {
  if (!Array.isArray(posts)) {
    console.error('WriteSpace: setPosts expects an array.');
    return;
  }
  writeToStorage(KEYS.POSTS, posts);
}

export function getSession() {
  const session = readFromStorage(KEYS.SESSION, null);
  if (session !== null && (typeof session !== 'object' || Array.isArray(session))) {
    console.warn('WriteSpace: Corrupted session data detected. Clearing session.');
    clearSession();
    return null;
  }
  return session;
}

export function setSession(session) {
  if (!session || typeof session !== 'object' || Array.isArray(session)) {
    console.error('WriteSpace: setSession expects a valid session object.');
    return;
  }
  writeToStorage(KEYS.SESSION, session);
}

export function clearSession() {
  removeFromStorage(KEYS.SESSION);
}