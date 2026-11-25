import middy from "@middy/core";
import { addUser } from "../../../services/users.mjs";
import { hashPassword } from "../../../utils/bcrypt.mjs";
import { sendResponse } from "../../../responses/index.mjs";

export const handler = middy(async (event) => {
    const { username, password } = event.body;
    const user = await addUser({
        userId : crypto.randomUUID(),
        username,
        password : await hashPassword(password)
    })
    const { password: _hash, ...safeUser } = user;
    return sendResponse(200, { message : 'User created successfully', user : safeUser});
})
