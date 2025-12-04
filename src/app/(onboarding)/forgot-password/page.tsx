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
    <>
      <div className="mx-auto max-w-sm space-y-4 lg:mt-0 mt-6">
        <div className="space-y-1 text-center">
          <div className="text-2xl font-bold text-center">Forgot Your Password</div>
          <div className="text-muted-foreground text-sm">
            No worries, we’ll send you reset instructions.
          </div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-3">
              <div className="space-y-4">
                <div className="space-y-2 pb-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-9 px-4 !py-[25px]"
                  >
                  {form.formState.isSubmitting ? (
                    <Spinner size="small" className="text-black" />
                  ) : (
                    "Send"
                  )}
                </Button>
                <div className="text-center">
                  <Link className="px-8 text-sm text-muted-foreground" href="/">
                    Back to log In
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

export default Page;
