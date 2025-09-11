import {z} from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string({error: "Username is required"}).min(1, {error: "Username is required"}),
  email: z.email({error: "Email is required"}),
  password: z.string({error: "Password is required"}).min(1, {error: "Password is required"}),
  avatar: z.string()
})
export type User = z.infer<typeof userSchema>;

export const getUserSchema = userSchema.omit({password: true});
export type GetUser = z.infer<typeof getUserSchema>;

export const createUserSchema = userSchema.clone()
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema.pick({username: true, avatar: true})
export type UpdateUser = z.infer<typeof updateUserSchema>;

export const registerSchema = userSchema.clone()
export type RegisterUser = z.infer<typeof registerSchema>;

export const loginSchema = userSchema.pick({email: true, password: true})
export type LoginUser = z.infer<typeof loginSchema>;

