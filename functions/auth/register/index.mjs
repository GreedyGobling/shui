import middy from "@middy/core";
import { addUser } from "../../../services/users.mjs";
import { hashPassword } from "../../../utils/bcrypt.mjs";
import { sendResponse } from "../../../responses/index.mjs";

export const handler = middy(async (event) => {
    const { username, password } = JSON.parse(event.body);
    const user = await addUser({
        userId : crypto.randomUUID(),
        username,
        password : await hashPassword(password)
    })
    const { password: _hash, ...safeUser } = user;
    return sendResponse(201, { message : 'User registered successfully', username});
})