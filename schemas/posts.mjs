import { z } from 'zod';

export const postSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    content: z.string().trim().min(1, 'Content is required')
});

export const postParamsSchema = z.object({
    postId: z.string().min(1, 'Post ID is required')
});

export const listPostsQuerySchema = z.strictObject({
    username: z.string().trim().min(1, 'Username must not be empty').optional()
});
