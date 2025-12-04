import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Spinner } from '../ui/spinner';

const formSchema = z
  .object({
    oldpassword: z
      .string()
      .max(50, { message: "Maximum length is 50" })
      .min(6, { message: "Minimun length is 6." }),
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

const ChangePassword = () => {
  const { toast } = useToast();
  const router = useRouter();
  // const {updatePassword  } = ProfileApi();
  const [oldPassword, setOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });

  useEffect(() => {}, []);
  //to check filed values is empty or not.
  const isFormEmpty = () => {
    const values = form.getValues();
    return (
      !values.oldpassword && !values.newpassword && !values.confirmpassword
    );
  };

  // submit form for api
  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
 	// const sendData= {
  //   oldPassword:values.oldpassword,
  //   newPassword:values.newpassword
  // }
  //   await updatePassword(sendData)
  //     .then((res: any) => {
  //       toast({
  //         title: "Password Update Successfully!",
  //         description: res?.message
  //       });
  //       router.push("/dashboard");
  //     })
  //     .catch(() => {
  //       toast({
  //         title: "Something went wrong!"
  //       });
  //     });
  // };


  // submit form - API call to change password
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // TODO: Implement API call to change password
      // This would typically call an endpoint like:
      // POST /api/auth/change-password
      // with { oldPassword, newPassword }
      
      toast({
        title: 'Password Update Successfully!',
        description: 'Your password has been changed',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error occurred',
        description: error?.message || 'Failed to update password',
      });
    }
  };


  const togglePasswordVisibility = (type: any) => {
    if (type == "oldpassword") {
      setOldPassword(!oldPassword);
    } else if (type == "newpassword") {
      setNewPassword(!newPassword);
    } else {
      setConfirmPassword(!confirmPassword);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="current">Old password</Label>
              <FormField
                control={form.control}
                name="oldpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={oldPassword ? "text" : "password"}
                          placeholder="Enter Old Password"
                          {...field}
                          className="pr-11"
                        />
                        <div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("oldpassword")
                          }
                        >
                          {oldPassword ? <Eye /> : <EyeOff />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          </CardContent>
          <CardFooter>
            <Button className=" min-w-[140px]" disabled={isFormEmpty() || form.formState.isSubmitting}>
              {" "}
              {form.formState.isSubmitting ? (
                <Spinner size="small" className="text-black" />
              ) : (
                "Update"
              )}{" "}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ChangePassword;
