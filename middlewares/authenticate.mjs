import { createError } from '@middy/util';
import jwt from 'jsonwebtoken';

export const authenticate = () => ({
    before: ({ event }) => {
        const authorization = Object.entries(event.headers ?? {})
            .find(([name]) => name.toLowerCase() === 'authorization')?.[1];
        const token = typeof authorization === 'string'
            ? /^Bearer +(\S+)$/i.exec(authorization)?.[1]
            : undefined;

        if (!token) throw createError(401, 'Missing or invalid token');
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        } catch {
            throw createError(401, 'Missing or invalid token');
        }

        if (typeof payload.username !== 'string' || !payload.username.trim()) {
            throw createError(401, 'Missing or invalid token');
        }

        event.user = { username: payload.username };
    }
});
