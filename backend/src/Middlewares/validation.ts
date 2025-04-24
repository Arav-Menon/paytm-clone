import z from 'zod'

export const userInputSchema = z.object({
    userName: z.string().min(3, "Username should be at least 3 characters long"),
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(30, "Password too long")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/[a-z]/, "Must include at least one lowercase letter")
        .regex(/[0-9]/, "Must include at least one number")
        .regex(/[@$!%*?&]/, "Must include at least one special character"),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    bankName: z.string().min(1),
})
