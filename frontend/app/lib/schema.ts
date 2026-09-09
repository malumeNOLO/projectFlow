import { ProjectStatus } from "@/types";
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

  /*-----------Create Projects------------*/

export const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(10, "Start date is required"),
    dueDate: z.string().min(10, "Due date s required"),
    members: z
      .array(
        z.object({
            user: z.string(),
            role: z.enum(["admin", "member", "owner", "viewer"]),
        })
    )
    .optional(),
});

/* ---------- Types ---------- */

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;   
export type WorkspaceFormData = z.infer<typeof workspaceSchema>; 
export type ProjectStatusFormData = z.infer<typeof projectSchema>;
