import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Spinner } from "../ui/spinner";
import ConfigurationApi from "@/api/configurations";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"


const formSchema = z.object({
  platformCharge: z
    .string()
    .regex(/^[0-9]*\.?[0-9]*$/, { message: "Please enter a valid app charge (number only)." })
    .transform(Number)
    .refine((val) => val >= 1 && val <=100 , { message: "App charge value must be greater than 0 and less than or equal to 100." }),
});

const Addconfigurations = () => {
    
      const { toast } = useToast();
      const [configurationInfo, setConfigurationInfo]:any = useState(null);
        
      const { addConfig, getConfigData }: any = ConfigurationApi();
      const [circleLoader, setCircleLoader]: any = useState(false);
      const [formValues, setFormValues] = useState({});

    
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: formValues,
      });
    
      useEffect(() => {
        form.reset(formValues);
      }, [formValues, form]);

      useEffect(() => {
        getConfigDetail();
      }, []);

      const getConfigDetail = async () => {
        setCircleLoader(true);

        await getConfigData().then((res: any) => {
          if (!res.error) {
            setCircleLoader(false);
            setConfigurationInfo(res?.result);
            setFormValues(  {
              platformCharge:res?.result?.postPoint?.toString()
            }
            )
          } else {
            setFormValues({})
            setConfigurationInfo(null);
            setCircleLoader(false);
          }
        });
      };


    
    
      async function onSubmit(values: z.infer<typeof formSchema>) {

        const body: any = {
          postPoint: values?.platformCharge,
        };
      await addConfig(body).then((res: any) => {
          if (!res?.error) {
            toast({
              title: "Update successfully.",
            });
          } else {
            toast({
              variant: "destructive",
              title: res?.errorMessage
                ? res?.errorMessage
                : "Uh oh! Something went wrong.",
              description: res?.error,
            });
          }
        });
      }

      if (circleLoader) {
        return (
          <div className="flex justify-center items-center">
          <Card className="p-4 w-full max-w-md">
            <CardContent className="space-y-4">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" /> 
                    <Skeleton className="h-10 w-full" />
                  </div>
    
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-full sm:w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        );
      }

 return (
    <>
        <div className="flex justify-center items-center">
      <Card className="p-4 w-full max-w-md">
        <CardContent className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="platformCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Point<span className="text-red-700">*</span></FormLabel>
                    <FormControl>
                      <Input type="number"  placeholder="Enter post point" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full sm:w-auto min-w-full "
              >
                {form.formState.isSubmitting ? (
                  <Spinner size="small" />
                ) : (
                  `Submit`
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      </CardContent>
      </Card>
    </div>
    </>
  );
}

export default Addconfigurations