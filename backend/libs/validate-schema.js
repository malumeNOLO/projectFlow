import { z } from "zod";

/* ---------- Registration ---------- */

export const registrationSchema = z
    .object({
        username: z
            .string()
            .min(6, "Name must be at least 3 characters")
            .max(8, "Name must not exceed 8 characters"),

        email: z
            .string()
            .email("Please enter a valid email address"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z
            .string()
            .min(8, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

/* ---------- Login ---------- */

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

/*------------ Email ----------------*/

export const verifyEmailSchema = z.object({
    token: z 
    .string().min(1,"Token is required"),
});

/*----------- Reset Password ----------*/

export const resetPasswordSchema = z.object({
    token: z 
    .string().min(1,"Token is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
        confirmPassword: z
            .string()
            .min(8, "Please confirm your password"),
    });