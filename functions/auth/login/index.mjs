import middy from "@middy/core";
import { validate } from "../../../middlewares/validate.mjs";
import { loginSchema } from "../../../schemas/auth.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { sendResponse } from "../../../responses/index.mjs";
import { login } from "../../../services/auth.mjs";


export const handler = middy(async (event) =>{
    const result = await login(event.body);

    return sendResponse(200, { message: 'Login successful', ...result });
}).use(httpJsonBodyParser())
  .use(errorHandler())
  .use(validate(loginSchema));
