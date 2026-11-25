import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().trim().min(1, 'invalid username'),
    password: z.string().min(8, 'password must be at least 8 characters')
        .max(48, 'password must be at most 48 characters')
        // bcrypt ignores password bytes beyond 72, including multibyte characters.
        .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, 'password must be at most 72 UTF-8 bytes')
})

export const loginSchema = z.object({
    username: z.string().trim().min(1, 'invalid username or passworld'),
    password: z.string().min(1,'passworld is required')
})