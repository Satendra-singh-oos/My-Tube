import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Must be 3 or more characters long" })
    .max(50),
  email: z.string().email({ message: "Invalid email address" }),
  fullName: z.string().min(4).max(55),
  password: z
    .string()
    .min(4, { message: "Must be 4 or more characters long" })
    .max(25, { message: "Less then 25 characters" }),

  avatar: z.string().optional(),
  coverImage: z.string().optional(),
});
