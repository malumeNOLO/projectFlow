import { useState } from "react";
import { z } from "zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useAuth } from "@/provider/auth-context";

import axios from "axios";

import { signInSchema } from "@/lib/schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const navigate = useNavigate();

const { login: authLogin } = useAuth();

const { mutate: login, isPending } = useLoginMutation();

function handleSubmit(values: SignInFormData) {
  console.log("Submitting login", values);
  
  login(values, {
    onSuccess: (response: any) => {
      console.log("Login success:", response);

      authLogin(response.token);

      navigate("/dashboard"); 
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
      } else {
        console.error(error);
      }
    },
  });
}

  return (
    
      <Card className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In to Your Account
          </CardTitle>

          <CardDescription>
            Sign in to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            {/* Email */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
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

            {/* Password */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Password
              </label>

              <Input
                type="password"
                placeholder="Enter your password"
                {...form.register("password")}
              />

              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
               {isPending ? "Signing in.." : "Sign In"}
            </Button>

            {/* Sign Up */}

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-primary hover:underline">
                  Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    
  );
}