import middy from "@middy/core";
import { register } from "../../../services/auth.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { validate } from "../../../middlewares/validate.mjs";
import { registerSchema } from "../../../schemas/auth.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import httpJsonBodyParser from '@middy/http-json-body-parser';

export const handler = middy(async (event) => {
    const result = await register(event.body);

    return sendResponse(201, { message : 'User registered successfully', ...result });
}).use(httpJsonBodyParser())
.use(errorHandler())
.use(validate(registerSchema));
