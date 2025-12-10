"use client";
import conversationApi from "@/api/conversationApi";
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
import { useAuth } from "@/context/AuthContext";

const ChatHistory = (props: any) => {

  const { openChat } = conversationApi();
  const [chatInfo, setchatInfo] = useState<any>(null);
  const [circleLoader, setCircleLoader] = useState(false);
  const { user } = useAuth();

  const id = props?.message;
  const requestId = id?.slug?.[0];

  // ❗ MOVE ALL HOOKS HERE AT THE TOP
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getChatDetails(requestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const getChatDetails = async (id: any) => {
    setCircleLoader(true);
    const res: any = await openChat(id);
    if (!res.error) {
      setchatInfo(res?.results);
    } else {
      setchatInfo(null);
    }
    setCircleLoader(false);
  };

  // Normalize messages array
  const messages: any[] = Array.isArray(chatInfo)
    ? chatInfo
    : Array.isArray(chatInfo?.results)
    ? chatInfo.results
    : [];

  // ❗ AUTO-SCROLL HOOK MUST BE ABOVE CONDITIONAL RETURNS
  useEffect(() => {
    if (!containerRef.current) return;
    setTimeout(() => {
      containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
    }, 50);
  }, [messages?.length]);

  const formatTimestamp = (iso?: string) => {
    if (!iso) return "";
    try {
      return format(new Date(iso), "hh:mm a");
    } catch {
      return iso;
    }
  };

  // group by day
  const groupedByDate = messages.reduce((acc: any, msg: any) => {
    const day = msg?.timestamp
      ? format(new Date(msg.timestamp), "yyyy-MM-dd")
      : "unknown";
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  // ❗ SAFE CONDITIONAL RETURNS (AFTER ALL HOOKS)
  if (circleLoader) {
    return (
      <div className="flex justify-center items-center my-28 h-[100px] dark:text-white w-[100px] text-[#DCEDC0] animate-spin">
        <div className="animate-spin rounded-full h-18 w-18 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!chatInfo) {
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
    <div className="w-full h-[calc(100vh_-_182px)] flex flex-col">
      <div className="px-4 py-3 border-b dark:border-neutral-700">
        <h3 className="text-lg font-semibold">Conversation</h3>
        <p className="text-sm text-muted-foreground">{messages.length} messages</p>
      </div>

      {/* <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-white dark:bg-[#0b1220]"
      >
        {Object.keys(groupedByDate).map((day) => (
          <div key={day} className="space-y-4">
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full dark:bg-neutral-800">
                {day}
              </span>
            </div>

            {groupedByDate[day].map((m: any, idx: number) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-start" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] flex items-end ${
                      isUser ? "justify-start" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="mr-3 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-700 dark:bg-neutral-700">
                          {m.role === "assistant"
                            ? "A"
                            : (m.role || "U").charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}

                    <div>
                      <div
                        className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap text-sm ${
                          isUser
                            ? "bg-teal-500 text-white"
                            : "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100"
                        }`}
                      >
                        {m.content}
                      </div>
                      <div
                        className={`mt-1 text-[11px] ${
                          isUser ? "text-gray-200 text-right" : "text-gray-500"
                        }`}
                      >
                        {formatTimestamp(m.timestamp)}
                      </div>
                    </div>

                    {isUser && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-sm text-white">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div> */}
      <div
  ref={containerRef}
  className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white dark:bg-[#0b1220]"
>
  {Object.keys(groupedByDate).map((day) => (
    <div key={day} className="space-y-4">

      {/* Date Separator */}
      <div className="flex items-center justify-center">
        <span className="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full dark:bg-neutral-800">
          {day}
        </span>
      </div>

      {/* Messages */}
      {groupedByDate[day].map((m: any, idx: number) => {
        const isUser = m.role === "user";

        return (
          <div key={idx} className="flex w-full">

            {/* Avatar */}
            <div className="mr-3 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-700 dark:bg-neutral-700">
                {isUser
                  ? user?.name?.charAt(0).toUpperCase() || "U"
                  : "A"}
              </div>
            </div>

            {/* Message & Time */}
            <div className="flex flex-col space-y-1 max-w-[85%]">

              <div
                className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap text-sm ${
                  isUser
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100"
                }`}
              >
                {m.content}
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(m.timestamp)}
              </span>
            </div>

          </div>
        );
      })}
    </div>
  ))}
</div>


      {/* <div className="px-4 py-3 border-t dark:border-neutral-700 text-sm text-muted-foreground"> */}
        {/* <span className="text-xs">End of conversation</span> */}
      {/* </div> */}
    </div>
  );
};

export default ChatHistory;
