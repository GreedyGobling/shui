import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { authenticate } from '../../../middlewares/authenticate.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { validate } from '../../../middlewares/validate.mjs';
import { createPostSchema } from '../../../schemas/posts.mjs';
import { createPost } from '../../../services/posts.mjs';

export const handler = middy(async (event) => {
    const post = await createPost(event.body, event.user.username);
    return sendResponse(201, { message: 'Post created successfully', post });
}).use(errorHandler())
    .use(authenticate())
    .use(httpJsonBodyParser())
    .use(validate(createPostSchema));
