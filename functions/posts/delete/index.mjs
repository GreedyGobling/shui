import middy from '@middy/core';
import { authenticate } from '../../../middlewares/authenticate.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { ownerOnly } from '../../../middlewares/ownerOnly.mjs';
import { validate } from '../../../middlewares/validate.mjs';
import { postParamsSchema } from '../../../schemas/posts.mjs';
import { deletePost } from '../../../services/posts.mjs';

export const handler = middy(async (event) => {
    await deletePost(event.post);
    return { statusCode: 204 };
}).use(errorHandler())
    .use(authenticate())
    .use(validate(postParamsSchema, 'pathParameters'))
    .use(ownerOnly());
