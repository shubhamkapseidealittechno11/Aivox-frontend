'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import appConstant from "../../../../public/json/appConstant.json";

const FormSchema = z
  .object({
    newpassword: z
      .string()
      .max(50, { message: "Maximum length is 50" })
      .min(6, { message: "Minimun length is 6." }),
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
      route.push('/login');
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
    <>
      <div className="mx-auto max-w-sm space-y-4 lg:mt-0 mt-6">
        <div className="space-y-1 text-center">
          <div className="text-2xl font-bold text-center">OTP Verify</div>
          <div className="text-muted-foreground text-sm">
            No worries, we’ll send you reset instructions.
          </div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-3">
              <div className="space-y-4">
              <div className="space-y-1">
              <Label htmlFor="current">New password</Label>
              <FormField
                control={form.control}
                name="newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={newPassword ? "text" : "password"}
                          placeholder="Enter New password"
                          {...field}
                          className="pr-11"
                        />
                        <div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("newpassword")
                          }
                        >
                          {newPassword ? <Eye /> : <EyeOff />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="new">Confirm New password</Label>
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={confirmPassword ? "text" : "password"}
                          placeholder="Enter Confirm Password"
                          {...field}
                          className="pr-11"
                        />
                        <div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("confirmpassword")
                          }
                        >
                          {confirmPassword ? <Eye /> : <EyeOff />}
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
                  className="w-full h-9 px-4 !py-[25px] "
                >
                  {form.formState.isSubmitting ? (
                    <Spinner size="small" className="text-black " />
                  ) : (
                    "Update"
                  )}
                </Button>
                
                <div className="text-center">
                  <a onClick={()=>(localStorage.removeItem(otpTokenLocalStorageKey))} className="px-8 text-sm text-muted-foreground" href="/">
                    Back to log In
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
