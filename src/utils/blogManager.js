import { getPosts, setPosts } from './storage.js';

function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

export function getAllPosts() {
  const posts = getPosts();
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getPostById(id) {
  if (!id || typeof id !== 'string') {
    return null;
  }

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);
  return post || null;
}

export function canEditPost(post, session) {
  if (!post || !session) {
    return false;
  }

  if (session.role === 'admin') {
    return true;
  }

  return post.authorId === session.userId;
}

export function createPost({ title, content }, session) {
  if (!session || !session.userId) {
    return { success: false, error: 'You must be logged in to create a post.' };
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    return { success: false, error: 'Title is required.' };
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    return { success: false, error: 'Content is required.' };
  }

  const now = new Date().toISOString();
  const newPost = {
    id: generateId(),
    title: title.trim(),
    content: content.trim(),
    authorId: session.userId,
    authorName: session.displayName || session.username,
    createdAt: now,
    updatedAt: now,
  };

  const posts = getPosts();
  posts.push(newPost);
  setPosts(posts);

  return { success: true, post: newPost };
}

export function updatePost(id, { title, content }, session) {
  if (!session || !session.userId) {
    return { success: false, error: 'You must be logged in to update a post.' };
  }

  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Post ID is required.' };
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    return { success: false, error: 'Title is required.' };
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    return { success: false, error: 'Content is required.' };
  }

  const posts = getPosts();
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return { success: false, error: 'Post not found.' };
  }

  const post = posts[postIndex];

  if (!canEditPost(post, session)) {
    return { success: false, error: 'You do not have permission to edit this post.' };
  }

  const updatedPost = {
    ...post,
    title: title.trim(),
    content: content.trim(),
    updatedAt: new Date().toISOString(),
  };

  posts[postIndex] = updatedPost;
  setPosts(posts);

  return { success: true, post: updatedPost };
}

export function deletePost(id, session) {
  if (!session || !session.userId) {
    return { success: false, error: 'You must be logged in to delete a post.' };
  }

  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Post ID is required.' };
  }

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return { success: false, error: 'Post not found.' };
  }

  if (!canEditPost(post, session)) {
    return { success: false, error: 'You do not have permission to delete this post.' };
  }

  const updatedPosts = posts.filter((p) => p.id !== id);
  setPosts(updatedPosts);

  return { success: true };
}