'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { forgotPasswordApi } from '@/api/auth';

const formSchema = z.object({
  email: z.string().trim().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
});

const Page = () => {
  const route = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await forgotPasswordApi(values.email);
      route.push('/verify-code?email=' + values.email);
      toast({
        title: 'Email Sent.',
        description: 'A password reset email has been sent.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'Failed to send reset email',
      });
    }
  }

  return (
    <div className="mx-auto max-w-sm mt-2">
      <div className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Forgot Password
      </div>
      <p className="text-center text-muted-foreground mb-6">
        No worries, we'll send you reset instructions
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} className="transition-all duration-200" />
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
                "Send Reset Link"
              )}
            </Button>
            
            <div className="text-center">
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline" href="/">
                Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
