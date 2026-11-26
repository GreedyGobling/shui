import { createError } from '@middy/util';
import { addPost, getPostById, getPosts } from '../models/posts.mjs';

const toPublicPost = ({ id, username, isGuest, title, content, createdAt, updatedAt }) => ({
    id, username, isGuest, title, content, createdAt, updatedAt
});

export const createPost = async ({ title, content }, username) => {
    const now = new Date().toISOString();
    const post = {
        id: crypto.randomUUID(),
        username,
        isGuest: false,
        title,
        content,
        createdAt: now,
        updatedAt: now
    };

    await addPost(post);
    return post;
};

export const getPost = async (postId) => {
    const post = await getPostById(postId);
    if (!post) throw createError(404, 'Post not found');
    return toPublicPost(post);
};

export const listPosts = async (username) => (await getPosts(username)).map(toPublicPost);
