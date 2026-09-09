import express from "express";

import {z} from "zod";
import { validateRequest } from "zod-express-middleware";
import { loginUser, registerUser, verifyEmail, resetPasswordRequest, verifyResetPasswordTokenAndResetPassword } from "../controllers/auth-controller.js";
import { registrationSchema, loginSchema, verifyEmailSchema, resetPasswordSchema, workspaceSchema } from "../libs/validate-schema.js";
import { createWorkspace } from "../controllers/workspace.js";

const router = express.Router();

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

router.post("/register",
    validateRequest({
        body: registrationSchema,
    }),

    registerUser
);

router.post("/login",
    validateRequest({
        body: loginSchema,
        
    }),
    
    loginUser 
);

router.post(
    "/verify-email",
    validateRequest({
        body: verifyEmailSchema,
    }),

    verifyEmail
);

router.post(
    "/forgot-password",
    validateRequest({
        body: forgotPasswordSchema,
    }),
    resetPasswordRequest
);

router.post(
    "/reset-password",
    validateRequest({
        body: resetPasswordSchema,
    }),
    verifyResetPasswordTokenAndResetPassword 
);


export default router;