import middy from "@middy/core";
import { addUser } from "../../../services/users.mjs";
import { hashPassword } from "../../../utils/bcrypt.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { validate } from "../../../middlewares/validate.mjs";
import { registerSchema } from "../../../schemas/auth.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import httpJsonBodyParser from '@middy/http-json-body-parser';

export const handler = middy(async (event) => {
    const { username, password } = event.body;
    const user = await addUser({
        userId : crypto.randomUUID(),
        username,
        password : await hashPassword(password)
    })
    const { password: _hash } = user;
    return sendResponse(201, { message : 'User registered successfully', username});
}).use(httpJsonBodyParser())
.use(errorHandler())
.use(validate(registerSchema));
