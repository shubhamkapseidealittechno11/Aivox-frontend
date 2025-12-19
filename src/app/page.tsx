'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/demo/mode-toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  decryptAccessToken,
  encryptAccessToken,
} from '@/service/EncryptionUtil';
import appConstant from '../../public/json/appConstant.json';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from 'next-themes';
import moment from 'moment';
import { useAuth } from '@/context/AuthContext';
const formSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  password: z
  .string()
  .trim()
  .min(1, { message: "Password is required." })
  .min(8, { message: "Password must be at least 8 characters." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),

  remember: z.boolean().default(false).optional()
});

export default function HomePage() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const currentYear = moment().format('YYYY');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const rememberMeKey = `${appConstant.NEXT_PUBLIC_REMEMBER_ME}`;

  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const { isAuthenticated, isLoading } = useAppSelector(
    (state: any) => state.auth
  );

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load remember me data
  useEffect(() => {
    const rememberMeStorage = localStorage.getItem(rememberMeKey);
    if (rememberMeStorage) {
      const rememberMeData = decryptAccessToken(rememberMeStorage);
      if (rememberMeData) {
        setFormValues({
          email: rememberMeData.email || '',
          password: rememberMeData.password || '',
          remember: true,
        });
      }
    }
  }, [rememberMeKey]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  });

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const success = await login(values.email, values.password);

      if (success) {
        // Handle remember me
        if (values.remember) {
          const rememberMeStorage = encryptAccessToken({
            email: values.email,
            password: values.password,
          });
          if (rememberMeStorage) {
            localStorage.setItem(rememberMeKey, rememberMeStorage);
          }
        } else {
          localStorage.removeItem(rememberMeKey);
        }

        toast({
          title: 'Login successful!',
          description: 'Redirecting to dashboard...',
        });

        router.push('/dashboard');
      }
    } catch (error: any) {
      console.log("===> , error", error)
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error?.message || 'Invalid email or password',
      });
    }
  }



  return (
    <>
<div className="container relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      
        <div className="justify-end flex items-center gap-3 fixed top-4 right-4 z-50">
          <ModeToggle />
        </div>

        <div className="lg:p-8 w-full animate-fade-in" >

          {/* Login Card with modern styling */}
          <section className="lg:mt-6 mt-4 max-w-[480px] flex-col items-center gap-2 lg:p-8 p-6 mx-auto border-2 border-border rounded-2xl bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"> 
            <div className="mx-auto max-w-sm mt-2">
              <div className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome Back
              </div>
              <p className="text-center text-muted-foreground mb-6">Sign in to your account</p>
              
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                {...field}
                                className="transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Enter your password"
                                  {...field}
                                  className="pr-11 transition-all duration-200"
                                />
                                <div
                                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg p-4 bg-muted/50 border border-border">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium cursor-pointer">Remember Me</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full !py-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      {form.formState.isSubmitting ? (
                        <Spinner size="medium" className="text-primary-foreground" />
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                    <div className="text-center">
                      <Link
                        className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                        href="/signup"
                      >  
                        Don't have an account? Register
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </section>
        </div>
        
        <div className="z-20 justify-center w-full lg:mt-auto sticky bottom-0 flex lg:hidden bg-background/80 backdrop-blur-sm border-t border-border">
          <blockquote className="space-y-2">
            <footer className="text-sm py-4">
              <div className="container flex flex-col items-center justify-center gap-4">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                  © {currentYear}, Aivox
                </p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </>
  );
}
