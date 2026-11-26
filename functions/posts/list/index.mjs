import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { validate } from '../../../middlewares/validate.mjs';
import { listPostsQuerySchema } from '../../../schemas/posts.mjs';
import { listPosts } from '../../../services/posts.mjs';

export const handler = middy(async (event) => {
    const result = await listPosts(event.queryStringParameters.username);
    return sendResponse(200, result);
}).use(errorHandler())
    .use(validate(listPostsQuerySchema, 'queryStringParameters'));
