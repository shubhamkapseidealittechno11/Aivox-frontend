'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import appConstant from '../../../../public/json/appConstant.json';
import { verifyOtpApi, resendOtpApi } from '@/api/auth';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

const Page = () => {
  const { toast } = useToast();
  const routers: any = useSearchParams();
  const email = routers.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const otpTokenLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_OTP_TOKEN}`;
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [disableVerify, setDisableVerify] = useState(false);
  const [disableOtpInput, setDisableOtpInput] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setShowResend(true);
      setDisableVerify(true);
      setDisableOtpInput(true);
    }
  }, [timer]);

  // Reset timer and hide Resend button
  const resetTimer = () => {
    setTimer(60);
    setShowResend(false);
    setDisableVerify(false);
    setDisableOtpInput(false);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { pin: '' },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      await verifyOtpApi(values.pin);
      toast({
        title: 'OTP verified successfully',
        description: 'Redirecting to reset password...',
      });
      route.push('/reset-password?email=' + email);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'Failed to verify OTP',
      });
    }
  }

  const resendOtp = async () => {
    try {
      await resendOtpApi();
      toast({
        title: 'OTP resent successfully',
        description: 'Check your email for the new OTP',
      });
      resetTimer();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'Failed to resend OTP',
      });
    }
  };

  return (
    <>
    <div className="mx-auto max-w-sm space-y-4 lg:mt-0 mt-6">
        <div className="space-y-1 text-center">
          <div className="text-2xl font-bold text-center">OTP Verify</div>
          <div className="text-muted-foreground text-sm text-center">
            No worries, we’ll send you reset instructions.
          </div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-3">
              <div className="space-y-4">
              <div className="space-y-1">
                  <FormField
                 
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP  disabled={disableOtpInput} maxLength={6} {...field}>
                            <InputOTPGroup className="w-full flex justify-between" >
                              <InputOTPSlot index={0} className="border border-gray-700" />
                              <InputOTPSlot index={1} className="border border-gray-700" />
                              <InputOTPSlot index={2} className="border border-gray-700" />
                              <InputOTPSlot index={3} className="border border-gray-700"/>
                              <InputOTPSlot index={4}  className="border border-gray-700"/>
                              <InputOTPSlot index={5} className="border border-gray-700" />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Please enter the one-time password sent to your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                { !showResend && (
                    <p>Timer: {timer} seconds</p>
                )}
          
                <div className="space-y-2">
                  {showResend && (
                    <Button
                      type="button"
                      onClick={resendOtp}
                      className="w-full !py-[25px]"                    >
                      Resend
                    </Button>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || disableVerify}
                  className="w-full h-9 px-4 !py-[25px]"
                >
                  {form.formState.isSubmitting ? (
                    <Spinner size="small" className="text-black " />
                  ) : (
                    "Verify"
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
