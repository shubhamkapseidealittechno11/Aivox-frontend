"use client";
import React, { useEffect, useState } from "react";
import AgentApi from "@/api/agentActionsApi";
import { useAuth } from "@/context/AuthContext";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";

// -------------------------
// ZOD SCHEMA
// -------------------------
const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required."),
  prompt: z.string().min(1, "System prompt is required."),
});

export default function AgentDetail(props: any) {
  const { userDetail, editAgent } = AgentApi();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [circleLoader, setCircleLoader] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { id } = props?.data;

  // -------------------------
  // INITIAL FORM SETUP
  // -------------------------
  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
      prompt: "",
    },
  });

  useEffect(() => {
    getUserDetails(id);
  }, [id]);

  const getUserDetails = async (id: any) => {
    setCircleLoader(true);

    const res = await userDetail(id);
    if (!res?.error) {
      setUserInfo(res.agent);

      // Load values into the form
      form.reset({
        name: res.agent?.name || "",
        prompt: res.agent?.prompt || "",
      });
    } else {
      setUserInfo(null);
    }
    setCircleLoader(false);
  };

  // -------------------------
  // SAVE EDITED DATA
  // -------------------------
  const onSubmit = async (values: z.infer<typeof agentSchema>) => {
    try {
      const body = {
        // name: values.name,
        prompt: values.prompt,
      };

      const res = await editAgent(id, body);

      if (!res.error) {
        toast({ title: "Agent updated successfully!" });

        // update local UI only
        setUserInfo((prev: any) => ({
          ...prev,
          name: values.name,
          prompt: values.prompt,
        }));

        setEditMode(false);
      } else {
        toast({
          variant: "destructive",
          title: res?.errorMessage || "Update failed.",
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Server error",
        description: "Unable to update agent.",
      });
    }
  };

  // -------------------------
  // CONDITIONAL UI
  // -------------------------
  if (circleLoader) {
    return (
      <div className="flex justify-center items-center my-28 h-[100px]">
        <div className="animate-spin rounded-full h-18 w-18 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col justify-center items-center p-20 h-[calc(100vh_-_182px)]">
        <Image
          src="/no-data.svg"
          alt="Logo"
          width={320}
          height={320}
          className="size-[150px]"
        />
        <span className="font-semibold text-lg">No Record Found</span>
      </div>
    );
  }

  // -------------------------
  // MAIN RENDER
  // -------------------------
  return (
    <div className="w-full">
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            🤖 {userInfo.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Agent Name */}
              {/* <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editMode}
                        className={!editMode ? "bg-gray-100 cursor-not-allowed" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* System Prompt */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={12}
                        {...field}
                        disabled={!editMode}
                        className={`h-[540px] ${
                          !editMode ? "bg-gray-100 cursor-not-allowed text-lg" : "text-lg"
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-1">

                {!editMode && (
                  <Button type="button" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}

                {editMode && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditMode(false);
                        form.reset(userInfo); // restore original values
                      }}
                    >
                      Cancel
                    </Button>

                    <Button type="submit">Save</Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
