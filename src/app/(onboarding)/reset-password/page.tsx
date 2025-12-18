'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordApi } from '@/api/auth';
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import appConstant from "../../../../public/json/appConstant.json";

const FormSchema = z
  .object({
    newpassword: z
      .string()
      .max(50, { message: "Maximum length is 50" })
      .min(6, { message: "Minimum length is 6." }),
    confirmpassword: z.string()
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "The passwords must match.",
    path: ["confirmpassword"]
  });

const Page = () => {
  const { toast } = useToast();
  const routers: any = useSearchParams();
  const email = routers.get('email');
  const otpTokenLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_OTP_TOKEN}`;
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const togglePasswordVisibility = (type: any) => {
    if (type == "newpassword") {
      setNewPassword(!newPassword);
    } else {
      setConfirmPassword(!confirmPassword);
    }
  };

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      await resetPasswordApi(values.newpassword, values.confirmpassword);
      localStorage.removeItem(otpTokenLocalStorageKey);
      route.push('/');
      toast({
        title: 'Password reset successfully',
        description: 'You can now login with your new password',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'There was a problem with your request.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm mt-2">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-primary/10 border-2 border-primary/20">
          <KeyRound className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Reset Password
      </div>
      <p className="text-center text-muted-foreground mb-6">
        Enter your new password to reset your account
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={newPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          className="pr-11 transition-all duration-200"
                        />
                        <div
                          className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() =>
                            togglePasswordVisibility("newpassword")
                          }
                        >
                          {newPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={confirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                          className="pr-11 transition-all duration-200"
                        />
                        <div
                          className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() =>
                            togglePasswordVisibility("confirmpassword")
                          }
                        >
                          {confirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full !py-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {form.formState.isSubmitting ? (
                <Spinner size="medium" className="text-primary-foreground" />
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="text-center">
              <a 
                onClick={() => (localStorage.removeItem(otpTokenLocalStorageKey))} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline cursor-pointer" 
                href="/"
              >
                Back to Sign In
              </a>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
