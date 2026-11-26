import { createError } from '@middy/util';
import { getPost } from '../services/posts.mjs';

export const ownerOnly = () => ({
    before: async ({ event }) => {
        const post = await getPost(event.pathParameters.postId);
        if (post.isGuest !== false || post.username !== event.user.username) {
            throw createError(403, 'Forbidden');
        }
        event.post = post;
    }
});
