import { addPost } from '../models/posts.mjs';

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
