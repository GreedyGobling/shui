import { z } from (zod);

export const registerSchema = z.object({
    username: z.string().username('invalid email adress'),
    password: z.string().min(8, 'password must be at least 8 characters')
})

export const loginSchema = z.object({
    username: z.string().username('invalid username or passworld'),
    password: z.string().min(1,'passworld is required')
})