import { z } from "zod";

/* ---------- Sign Up ---------- */

export const signUpSchema = z
    .object({
        username: z
            .string()
            .min(6, "Name must be at least 6 characters"),

        email: z
            .string()
            .email("Please enter a valid email"),

        password: z
            .string()
            .min(8, "Password must be at least 6 characters"),

        confirmPassword: z
            .string()
            .min(8, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    /* ---------- Sign In ---------- */

export const signInSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

/* ------------ Forgot Password ------------ */

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
});

/* ---------- RESET PASSWORD ---------- */

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(
                8,
                "Password must be at least 6 characters"
            ),

        confirmPassword: z
            .string()
            .min(
                8,
                "Please confirm your password"
            ),
    })
    .refine(
        (data) =>
            data.newPassword ===
            data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

    /*--------- Workspace ---------*/

export const workspaceSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    color: z.string().min(3, "Color must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
});

/* ---------- Types ---------- */

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;    
