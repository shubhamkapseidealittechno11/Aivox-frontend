'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { forgotPasswordApi } from '@/api/auth';

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
    }
  };

  return (
    <>
      <Suspense>
        <div className="mx-auto max-w-sm space-y-4 lg:mt-0 mt-6">
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Password Reset</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              We&apos;ve sent {email} password reset instruction to.
            </CardDescription>
          </div>
          <div>
            <Button
              disabled={isLoading}
              onClick={() => resend()}
              className="w-full !py-[25px]"
              >
              {isLoading ? <Spinner size="small" className="text-black" /> : "Resend"}
            </Button>
            <div className="text-center mt-3">
              <Link className="px-8 text-sm text-muted-foreground" href="/">
                Back to log In
              </Link>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Page;
