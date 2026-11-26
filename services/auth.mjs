import { createError } from "@middy/util";
import { comparePasswords, hashPassword } from "../utils/bcrypt.mjs";
import { addUser, getUserByUsername } from "./users.mjs"
import jwt from 'jsonwebtoken'


export const register = async ({ username, password }) => {
    await addUser({
        userId: crypto.randomUUID(),
        username,
        password: await hashPassword(password)
    });

    return { username };
};

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