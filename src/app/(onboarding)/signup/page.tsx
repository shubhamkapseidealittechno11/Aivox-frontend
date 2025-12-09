// src/app/(onboarding)/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import appConstant from "../../../../public/json/appConstant.json";
import {
  decryptAccessToken,
  encryptAccessToken,
} from "@/service/EncryptionUtil";
import { useToast } from "@/components/ui/use-toast";
import { signUp } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

// Zod schema for signup form
const signupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required." })
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

const SignupPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();
  const rememberMeKey = `${appConstant.NEXT_PUBLIC_REMEMBER_ME}`;

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const redirectToDashboard = async (data: any) => {
    try {
      const success :any = await login(data.email, data.password);
            if (success) {
        // Handle remember me
        if (data) {
          const rememberMeStorage = encryptAccessToken({
            email: data.email,
            password: data.password,
          });
          if (rememberMeStorage) {
            localStorage.setItem(rememberMeKey, rememberMeStorage);
          }
        } else {
          localStorage.removeItem(rememberMeKey);
        }

        toast({
          title: "Login successful!",
          description: "Redirecting to dashboard...",
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
              router.push("/");

      toast({
        variant: "destructive",
        title: "Login failed",
        description: error?.message || "Invalid email or password",
      });
    }
  };

  async function onSubmit(values: SignupFormValues) {
    try {
      const body = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const res = await signUp(body);

      if (!res.error) {
        redirectToDashboard(body).then(() => {
          toast({ title: "Account created successfully!" });
        });
      }
      // If needed, auto-login or redirect here...
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error?.message || "Unable to create your account",
      });
    }
  }

  return (
    <>
      <div className="mx-auto max-w-sm space-y-4 lg:mt-0 mt-6">
        <div className="space-y-1 text-center">
          <div className="text-2xl font-bold text-center">
            Create an Account
          </div>
          <div className="text-muted-foreground text-sm">
            Enter your details to create your account.
          </div>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-3"
            >
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password with show/hide (matches pattern from login page) */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                              className="pr-11"
                            />
                            <div
                              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-blue-500"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <Eye size={18} />
                              ) : (
                                <EyeOff size={18} />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full !py-[25px]"
                >
                  {form.formState.isSubmitting ? (
                    <Spinner size="small" className="text-black" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                {/* Link back to login */}
                <div className="text-center">
                  <Link className="px-8 text-sm text-muted-foreground" href="/">
                    Already have an account? Log in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
