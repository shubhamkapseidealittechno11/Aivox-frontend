import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  agentsApi  from  "@/api/agentActionsApi";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "../ui/use-toast";

const agentSchema = z.object({
  agentName: z.string().min(1, "Agent name is required."),
  systemPrompt: z.string().min(1, "System prompt is required."),
  isActive: z.boolean().default(true),
});

export default function AddAgentConfig({setOpen , setAllagents , allAgents}:any) {
  console.log("allAgents in add agent config:", allAgents);
  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      agentName: "",
      systemPrompt: "",
      isActive: true,
    },
  });

  const {createAgent} = agentsApi()
   
  const resetForm = () => {
    form.reset();
  }
async function onSubmit(values: z.infer<typeof agentSchema>) {
//   setCircleLoader(true);

  const body = {
    name: values.agentName,
    prompt: values.systemPrompt,
    is_active: values.isActive,
  };

  try {
    const res = await createAgent(body);

    if (!res.error) {
      setAllagents({...allAgents , results:[res.agent ,...( allAgents.results ||[] )]});
      console.log("response after creating agent:", allAgents);
      toast({
        title: "Agent created successfully!",
      });
setOpen(false);
      form.reset(); // reset fields after success
    } else {
      toast({
        variant: "destructive",
        title: res?.errorMessage ?? "Something went wrong.",
      });
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Server error",
      description: "Unable to create agent.",
    });
  } finally {
    // setCircleLoader(false);
  }
}


  return (
    <div className="flex justify-center items-center">
      <Card className="p-4 w-full max-w-xl">
        <CardContent>
        

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Agent Name */}
              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Agent Name <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Python Expert"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* System Prompt */}
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      System Prompt <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Enter the system prompt for this agent..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Checkbox */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-semibold">Active</FormLabel>
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline"
                  onClick={resetForm} >
                  Clear
                </Button>

                <Button type="submit">
                  Save Agent
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
