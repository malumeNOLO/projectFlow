import React, { useState } from "react";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router";

import { useForgotPasswordMutation } from "@/hooks/use-auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

    const onSubmit = (data: ForgotPasswordFormData) => {
        console.log("Submitting:", data);
    
        forgotPassword(data, {
            onSuccess: (response) => {
                console.log("Success:", response);
                setIsSuccess(true);
            },
            onError: (error) => {
                console.error("Error:", error);
            },
        });
    };

    return (
        <div className="w-full max-w-md rounded-2xl">
            <Card className="w-full max-w-md rounded-2xl justify-center bg-linear-to-br from-slate-950 via-indigo-900 to-purple-900 p-6">
                <CardHeader className="space-y-2 pb-6">
                    <CardTitle className="text-2xl text-white">
                        Forgot Password?
                    </CardTitle>

                    <CardDescription>
                        Enter your email address to reset your password below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                            <h1 className="text-2xl font-bold">
                                Password reset email sent
                            </h1>
                            <p className="text-muted-foreground">
                                Check your email for a link to reset your password
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Email */}

                            <div className="space-y-4">
                                <label className="text-xl font-medium">
                                    Email Address
                                </label>

                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...form.register("email")}
                                />

                                {form.formState.errors.email && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? "Sending..." : "Send Reset Link"}
                            </Button>

                            {/* Back to Sign In */}

                            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <ArrowLeft className="w-4 h-4" />
                                <Link
                                    to="/sign-in"
                                    className="font-medium hover:underline"
                                >
                                    Remember your password?
                                </Link>
                            </p>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;