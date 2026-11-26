import { createError } from "@middy/util";
import { comparePasswords } from "../utils/bcrypt.mjs";
import { getUserByUsername } from "./users.mjs"
import jwt from 'jsonwebtoken'


export const login = async ({ username, password}) => {
    const user = await getUserByUsername(username);

    if (!user || !(await comparePasswords(password, user.password))){
        throw createError(401, 'Invalid username or password')
    }

    const token = jwt.sign(
        { username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
    );

    return { token, username: user.username};
}