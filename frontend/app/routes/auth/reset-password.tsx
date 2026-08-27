import { z } from "zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useParams } from "react-router";
import { CheckCircle } from "lucide-react";

import { resetPasswordSchema } from "@/lib/schema";

import { useResetPasswordMutation } from "@/hooks/use-auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type ResetPasswordFormData = z.infer<
    typeof resetPasswordSchema
>;

export default function ResetPassword() {
    const { token } = useParams();
    
    const [isSuccess, setIsSuccess] = useState  (false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(
            resetPasswordSchema
        ),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
    },
    });

    const { mutate: resetPassword, isPending } =
    useResetPasswordMutation();

    const onSubmit = (data: ResetPasswordFormData) => {
    
        if (!token) return;

        resetPassword(
        {
            token,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        },
        {
            onSuccess: () => {
                setIsSuccess(true);
            },
            onError: (error) => {
                console.error(error);
            },
        }
    );
};

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-lg justify-center bg-linear-to-br from-slate-950 via-indigo-900 to-purple-900 p-6">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Reset Password
                    </CardTitle>

                    <CardDescription>
                        Please enter your new password
                        below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                            <h1 className="text-2xl font-bold">
                                Password reset successfully
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                You can now sign in with your new password
                            </p>
                            <Link
                                to="/sign-in"
                                className="font-medium hover:underline"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : ( 
                    <form
                        onSubmit={form.handleSubmit(
                            onSubmit
                        )}
                        className="space-y-4"
                    >
                        {/* Password */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                New Password
                            </label>

                            <Input
                                type="password"
                                placeholder="Enter your new password"
                                {...form.register(
                                    "newPassword"
                                )}
                            />

                            {form.formState.errors
                                .newPassword && (
                                <p className="text-sm text-red-500">
                                    {
                                        form
                                            .formState
                                            .errors
                                            .newPassword
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Confirm Password
                            </label>

                            <Input
                                type="password"
                                placeholder="Confirm your password"
                                {...form.register(
                                    "confirmPassword"
                                )}
                            />

                            {form.formState.errors
                                .confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {
                                        form
                                            .formState
                                            .errors
                                            .confirmPassword
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}

                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Reset Password
                        </Button>

                        {/* Back to Sign In */}

                        <p className="text-center text-sm text-muted-foreground">
                            Back to{" "}
                            <Link
                                to="/sign-in"
                                className="font-medium hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
