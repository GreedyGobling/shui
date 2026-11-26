import { createError } from '@middy/util';
import { addPost, deletePostById, getPostById, getPosts, updatePostById } from '../models/posts.mjs';

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

export const updatePost = async (post, { title, content }) => {
    const updated = await updatePostById(post.id, post.username, {
        title, content, updatedAt: new Date().toISOString()
    });
    return toPublicPost(updated);
};

export const deletePost = (post) => deletePostById(post.id, post.username);
