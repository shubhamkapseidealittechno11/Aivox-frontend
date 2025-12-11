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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import appConstant from '../../../../public/json/appConstant.json';
import { verifyOtpApi, resendOtpApi } from '@/api/auth';
import { ShieldCheck } from 'lucide-react';

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
    <div className="mx-auto max-w-sm mt-2">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-primary/10 border-2 border-primary/20">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Verify OTP
      </div>
      <p className="text-center text-muted-foreground mb-6">
        Enter the one-time password sent to your email
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP disabled={disableOtpInput} maxLength={6} {...field}>
                        <InputOTPGroup className="w-full flex justify-between gap-2">
                          <InputOTPSlot index={0} className="border-2 border-input h-12 w-12 text-lg rounded-lg transition-all duration-200 focus:border-ring" />
                          <InputOTPSlot index={1} className="border-2 border-input h-12 w-12 text-lg rounded-lg transition-all duration-200 focus:border-ring" />
                          <InputOTPSlot index={2} className="border-2 border-input h-12 w-12 text-lg rounded-lg transition-all duration-200 focus:border-ring" />
                          <InputOTPSlot index={3} className="border-2 border-input h-12 w-12 text-lg rounded-lg transition-all duration-200 focus:border-ring" />
                          <InputOTPSlot index={4} className="border-2 border-input h-12 w-12 text-lg rounded-lg transition-all duration-200 focus:border-ring" />
                          <InputOTPSlot index={5} className="border-2 border-input h-12 w-12 text-lg rounded-lg transition-all duration-200 focus:border-ring" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className="text-center">
                      {!showResend && (
                        <span className="text-muted-foreground">
                          Code expires in <span className="font-semibold text-foreground">{timer}s</span>
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showResend && (
              <Button
                type="button"
                onClick={resendOtp}
                variant="outline"
                className="w-full !py-6 text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Resend OTP
              </Button>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || disableVerify}
              className="w-full !py-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {form.formState.isSubmitting ? (
                <Spinner size="medium" className="text-primary-foreground" />
              ) : (
                "Verify OTP"
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
