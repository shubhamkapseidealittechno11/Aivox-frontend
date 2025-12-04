"use client";
import UserApi from "@/api/agentActionsApi";
import React, { useEffect, useState } from "react";
import {
  CardDescription,
  CardHeader,
  Card,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { Loader2, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import "yet-another-react-lightbox/styles.css";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FullAgentChat from "@/components/demo/FullAgentChat";
import { toast } from "../ui/use-toast";
import NextTopLoader from "nextjs-toploader";

const AgentDetail = (props: any) => {
  const { userDetail, syncAgent } = UserApi();
  const [userInfo, setUserInfo]: any = useState(null);
  const [circleLoader, setCircleLoader]: any = useState(false);
  const { id } = props?.data;
  const [open, setOpen] = React.useState(false);
  const [conversationId, setConversation]: any = useState();

  useEffect(() => {
    getUserDetails(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  

const handleChatOpen = async () => {
  try {
    const bodyPayload = {
      agent_id: id?.[0],
      session_id: Date.now(),
    };

    const res: any = await syncAgent(bodyPayload);

    if (!res.error) {
      setConversation(res?.conversation._id);
      setOpen(true);
      toast({
        title: "Success",
        description: "Chat session started successfully!",  
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: res.error || "Failed to start chat session",  
        variant: "destructive",
      });
    }

  } catch (error: any) {
    console.error(error);
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",  
      variant: "destructive",
    });
  }
};




  const getUserDetails = async (id: any) => {
    setCircleLoader(true);
    await userDetail(id).then((res: any) => {
      if (!res.error) {
        setUserInfo(res?.agent);
        setCircleLoader(false);
      } else {
        setCircleLoader(false);
        setUserInfo(null);
      }
    });
  };

  if (circleLoader) {
    return (

      <div className="flex justify-center items-center my-28 h-[100px] dark:text-white w-[100px] text-[#DCEDC0] animate-spin">
 <NextTopLoader
                color="#3B82F6"
                initialPosition={0.035}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #3B82F6,0 0 5px #3B82F6"
                template='<div class="bar" role="bar"><div class="peg"></div></div> 
                          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                zIndex={1600}
                showAtBottom={false}
              />      </div>
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
          priority
          className="size-[150px]"
        />
        <span className="font-semibold text-lg">No Record Found</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-start w-full">
        <Card className="w-full max-w-xl p-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              🤖 Agent Details
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              View configuration & system prompt
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Agent Name
              </label>
              <input
                type="text"
                value={userInfo?.name}
                disabled
                className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-900"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium mb-1">
                System Prompt
              </label>
              <textarea
                value={userInfo?.prompt}
                rows={4}
                disabled
                className="w-full p-3 rounded border bg-gray-100 dark:bg-gray-900"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Status:</span>
              {userInfo?.is_active ? (
                <Badge className="bg-green-600 text-white">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>

            {/* Created & Updated */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Created At: {format(new Date(userInfo?.created_at), "PPpp")}
              </p>
              <p>
                Updated At: {format(new Date(userInfo?.updated_at), "PPpp")}
              </p>
            </div>

            <Separator />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline">Edit Agent</Button>
              <Button className="bg-black text-white" onClick={handleChatOpen}>
                Open Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl">
    <FullAgentChat
     agentId={id?.[0]} 
     id={conversationId}
      />
  </DialogContent>
</Dialog>

    </>
  );
};

export default AgentDetail;
