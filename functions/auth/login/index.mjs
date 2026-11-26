import middy from "@middy/core";
import { getUserByUsername } from "../../../services/users.mjs";
import { createError } from "@middy/util";
import { validate } from "../../../middlewares/validate.mjs";
import { loginSchema } from "../../../schemas/auth.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { sendResponse } from "../../../responses/index.mjs";
import { comparePasswords } from "../../../utils/bcrypt.mjs";
import jwt from 'jsonwebtoken';


export const handler = middy(async (event) =>{
    const { username, password } = event.body;
    const user = await getUserByUsername(username);
    
    if (!user || !(await comparePasswords(password, user.password))) {
        throw createError(401, 'Invalid username or password');
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return sendResponse(200, { message: 'Login successful', token, username: user.username });
}).use(httpJsonBodyParser())
  .use(errorHandler())
  .use(validate(loginSchema));
