import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { authenticate } from '../../../middlewares/authenticate.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { ownerOnly } from '../../../middlewares/ownerOnly.mjs';
import { validate } from '../../../middlewares/validate.mjs';
import { postParamsSchema, postSchema } from '../../../schemas/posts.mjs';
import { updatePost } from '../../../services/posts.mjs';

export const handler = middy(async (event) => {
    const post = await updatePost(event.post, event.body);
    return sendResponse(200, { message: 'Post updated successfully', post });
}).use(errorHandler())
    .use(authenticate())
    .use(validate(postParamsSchema, 'pathParameters'))
    .use(httpJsonBodyParser())
    .use(validate(postSchema))
    .use(ownerOnly());
