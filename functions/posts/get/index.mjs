import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { validate } from '../../../middlewares/validate.mjs';
import { postParamsSchema } from '../../../schemas/posts.mjs';
import { getPost } from '../../../services/posts.mjs';

export const handler = middy(async (event) => {
    const result = await getPost(event.pathParameters.postId);
    return sendResponse(200, result);
}).use(errorHandler())
    .use(validate(postParamsSchema, 'pathParameters'));
