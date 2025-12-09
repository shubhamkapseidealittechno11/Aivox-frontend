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
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error?.message || 'Invalid email or password',
      });
    }
  }



  return (
    <>
<div className="container relative min-h-screen flex items-center justify-center">
      
        <div className="lg:p-8 w-full " >
          <div className="justify-end flex items-center gap-2 absolute top-2 right-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            ></Button>
            <ModeToggle />
          </div>

          {/* <div className="mx-auto flex w-full flex-col justify-center space-y-6 "> */}


            <section className="lg:mt-6 mt-4 max-w-[980px] flex-col items-center gap-2 lg:p-6 p-4  mx-auto border border-input rounded-md "> 
              {/* <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]"> */}
              {/* <div className="flex justify-center lg:hidden block" >
                <Image
                  className="object-contain w-full text-center lg:size-[100px] size-[70px]"
                  src={"logo.svg"}
                  alt="Logo"
                  width={100}
                  height={100}
                  priority
                />
              </div> */}
              {/* </h1> */}
              <div className="mx-auto max-w-sm mt-6">
                {/* <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
              </CardHeader> */}
                {/* <CardContent> */}
                <div className="text-2xl font-bold text-center">Login</div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-3"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  {...field}
                                  className="border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              <FormLabel className="text-sm font-medium">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...field}
                                    className="pr-11 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-blue-500"
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 bg-blue-50 dark:bg-blue-950/20">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-blue-500 bg-blue-500"
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
                        className="w-full !py-[25px] bg-[#DCEDC0] hover:bg-[#e3fcbc] text-white font-semibold transition-colors"
                      >
                        {form.formState.isSubmitting ? (
                          <Spinner size="small" className="text-white" />
                        ) : (
                          'Login'
                        )}
                      </Button>
                      <div className="text-center">
                        <Link
                          className="px-8 text-sm text-muted-foreground"
                          href="/signup"
                        >  
                          Register a new account
                        </Link>
                      </div>
                    </div>
                  </form>
                </Form>
                {/* </CardContent> */}
              </div>
            </section>
          </div>
        {/* </div> */}
        <div className="z-20 justify-center w-full lg:mt-auto sticky bottom-0 flex lg:hidden dark:bg-black bg-white">
          <blockquote className="space-y-2">
            <footer className="text-sm">
              <div className="container flex flex-col items-center justify-center gap-4 lg:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                  © {currentYear}, Retell AI

                </p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </>
  );
}
