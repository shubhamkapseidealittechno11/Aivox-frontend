'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { forgotPasswordApi } from '@/api/auth';
import { MailCheck } from 'lucide-react';

const Page = () => {
  const routers: any = useSearchParams();
  const email = routers.get('email');
  const route = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const resend = async () => {
    setIsLoading(true);
    try {
      await forgotPasswordApi(email);
      toast({
        title: 'Email Resent.',
        description: 'A password reset email has been sent.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'Failed to resend email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense>
      <div className="mx-auto max-w-sm mt-2">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10 border-2 border-primary/20">
            <MailCheck className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Check Your Email
        </div>
        <p className="text-center text-muted-foreground mb-6">
          We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>
        </p>

        <div className="space-y-4">
          <Button
            disabled={isLoading}
            onClick={() => resend()}
            className="w-full !py-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {isLoading ? <Spinner size="medium" className="text-primary-foreground" /> : "Resend Email"}
          </Button>
          
          <div className="text-center">
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline" href="/">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
