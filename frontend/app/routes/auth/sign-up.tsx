import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema } from "@/lib/schema";
import { useNavigate } from "react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignUpMutation } from "@/hooks/use-auth";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const navigate = useNavigate();
    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { mutate, isPending } = useSignUpMutation();

    function handleSubmit(values: SignUpFormData) {
        mutate(values,{
            onSuccess: () => {
                toast.success("Email Verification Required",{
                    description:
                    "Please check your email for a verification link.If you don,t see it,please check your spam folder.",
            });

            form.reset();
            navigate("/sign-in");

            },
            onError: (error: any) => {
                const errorMessage =
                error.response?.data?.message || "An error occurred";
                console.log(error);
                toast.error(errorMessage);

                
            },
        });
        
        navigate("/sign-up");
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>

                    <CardDescription>
                        Enter your details below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {/* Username */}

                        <div>
                            <label>Username</label>

                            <Input
                                placeholder=""
                                {...form.register("username")}
                            />

                            {form.formState.errors.username && (
                                <p className="text-sm text-red-500">
                                    {
                                        form.formState.errors.username
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Email */}

                        <div>
                            <label>Email</label>

                            <Input
                                type="email"
                                placeholder=" "
                                {...form.register("email")}
                            />

                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {
                                        form.formState.errors.email
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Password */}

                        <div>
                            <label>Password</label>

                            <Input
                                type="password"
                                {...form.register("password")}
                            />

                            {form.formState.errors.password && (
                                <p className="text-sm text-red-500">
                                    {
                                        form.formState.errors.password
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}

                        <div>
                            <label>Confirm Password</label>

                            <Input
                                type="password"
                                {...form.register(
                                    "confirmPassword"
                                )}
                            />

                            {form.formState.errors
                                .confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {
                                        form.formState.errors
                                            .confirmPassword
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? "Signing up.." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}