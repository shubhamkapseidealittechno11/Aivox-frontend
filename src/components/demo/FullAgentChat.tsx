"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, ArrowDownToLine } from "lucide-react";
import { toast } from "../ui/use-toast";
import agentsApi from "@/api/agentActionsApi";
import { useAuth } from "@/context/AuthContext";
import { set } from "date-fns";
const WS_URL = `ws://192.168.1.175:5000/stream-transcribe`;
export default function ChatApp({ agentId }: any) {
  const [messages, setMessages]: any = useState([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const { saveChat, saveN8Nchat, syncAgent } = agentsApi();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const ws: any = useRef(null);
  const sessionStarted = useRef(false);
  const audioQueue: any = useRef([]);
  const isPlayingAudio: any = useRef(false);
  const messagesEndRef: any = useRef(null);
  const { user, loading: authLoading } = useAuth();
  const pcmWorkerRef: any = useRef(null);
  const currentAudioRef: any = useRef(null);

  const [sessionId] = useState(`session_${Date.now()}`);
  const end_timestamp = new Date().toISOString();
  const start_timestamp = new Date().toISOString();
  //----------------------------------------------------
  // AUTO SCROLL
  //----------------------------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  //----------------------------------------------------
  // CONNECT WEBSOCKET
  //----------------------------------------------------
  useEffect(() => {
    const connectWS = () => {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log("WS Connected");
        // Do not automatically send start here; we'll send start when needed
        // (either when voice mode begins or when the first text message is sent)
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWS, 1500);
      };

      ws.current.onmessage = handleWSMessage;
    };

    connectWS();
    return () => ws.current?.close();
  }, []);

  //----------------------------------------------------
  // HANDLE ALL BACKEND EVENTS
  //----------------------------------------------------
  const handleWSMessage = (event: any) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    console.log("📨 WS Message received:", data.type, data);

    switch (data.type) {
      case "thinking":
        setIsThinking(true);
        console.log("💭 Bot is thinking...");
        break;

      case "response_text":
        setIsThinking(false);
        console.log("📝 Response text received:", data.text);
        setMessages((prev: any) => [
          ...prev,
          {
            role: "assistant",
            content: data.text,
            timestamp: new Date().toISOString(),
          },
        ]);
        break;

      case "audio_chunk":
        console.log("🔊 Audio chunk received, is_final:", data.is_final);
        enqueueAudioChunk(data.chunk, data.is_final);
        break;

      case "transcript":
        // Display user's spoken input as a message
        if (!data.is_partial && data.text && data.text.trim()) {
          console.log("🎤 Final transcript:", data.text);
          setMessages((prev: any) => [
            ...prev,
            {
              role: "user",
              content: data.text,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
        break;

      case "response_complete":
        // stop thinking bubble
        setIsThinking(false);
        console.log("✅ Response complete");
        break;

      default:
        console.log("⚠️ Unhandled WS event:", data);
    }
  };

  //----------------------------------------------------
  // COMPREHENSIVE CLEANUP FUNCTION
  //----------------------------------------------------
  const cleanupAllResources = () => {
    console.log("🧹 Cleaning up all resources...");

    // Stop and clear current audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
      console.log("🔇 Current audio stopped");
    }

    // Clear audio queue
    audioQueue.current = [];
    isPlayingAudio.current = false;
    console.log("🗑️ Audio queue cleared");

    // Stop microphone and audio processing
    const w: any = pcmWorkerRef.current;
    if (w) {
      w.stream?.getTracks().forEach((t: any) => t.stop());
      w.proc?.disconnect();
      w.audioCtx?.close();
      pcmWorkerRef.current = null;
      console.log("🎤 Microphone and audio processing stopped");
    }

    // Send stop message to WebSocket if connected
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "stop",
          session_id: sessionId,
          agent_id: agentId,
        })
      );
      console.log("📤 Sent 'stop' message to server");
    }

    console.log("✅ All resources cleaned up");
  };

  //----------------------------------------------------
  // AUDIO STREAMING QUEUE SYSTEM
  //----------------------------------------------------
  const enqueueAudioChunk = (base64Chunk: any, isFinal: any) => {
    audioQueue.current.push({ base64Chunk, isFinal });
    console.log(
      "📥 Audio chunk queued. Queue size:",
      audioQueue.current.length
    );

    if (!isPlayingAudio.current) {
      playNextAudioChunk();
    }
  };

  const playNextAudioChunk = async () => {
    if (audioQueue.current.length === 0) {
      isPlayingAudio.current = false;
      currentAudioRef.current = null;
      console.log("🏁 Audio playback complete");
      return;
    }

    isPlayingAudio.current = true;

    const { base64Chunk }: any = audioQueue.current.shift();
    console.log(
      "▶️ Playing audio chunk. Remaining:",
      audioQueue.current.length
    );

    try {
      const audioBinary = Uint8Array.from(atob(base64Chunk), (x) =>
        x.charCodeAt(0)
      );

      const blob = new Blob([audioBinary], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      currentAudioRef.current = audio; // Track the current audio element

      // Wait for audio to load before playing
      audio.addEventListener(
        "canplaythrough",
        async () => {
          try {
            await audio.play();
            console.log("✅ Audio playing");
          } catch (playError) {
            console.error("❌ Audio play error:", playError);
            // Continue to next chunk even if this one fails
            URL.revokeObjectURL(url);
            playNextAudioChunk();
          }
        },
        { once: true }
      );

      audio.addEventListener(
        "error",
        (e) => {
          console.error("❌ Audio load error:", e);
          URL.revokeObjectURL(url);
          playNextAudioChunk();
        },
        { once: true }
      );

      audio.onended = () => {
        console.log("🎵 Audio chunk ended");
        URL.revokeObjectURL(url);
        playNextAudioChunk();
      };

      // Load the audio
      audio.load();
    } catch (error) {
      console.error("❌ Error processing audio chunk:", error);
      playNextAudioChunk();
    }
  };

  //----------------------------------------------------
  // TEXT SEND
  //----------------------------------------------------
  const sendText = () => {
    if (!inputText.trim()) return;

    // Ensure session/start context is initialized on the server
    try {
      if (!sessionStarted.current) {
        ws.current.send(
          JSON.stringify({
            type: "start",
            language_code: "en-US",
            sample_rate: 16000,
            session_id: sessionId,
            agent_id: agentId,
            mode: "t2t",
          })
        );
        sessionStarted.current = true;
        console.log("📤 Sent initial start event for text session");
      }

      ws.current.send(
        JSON.stringify({
          type: "text_message",
          text: inputText,
          session_id: sessionId,
          agent_id: agentId,
          user_id: user?._id,
        })
      );
    } catch (err) {
      console.error("Failed to send text message or start event:", err);
      return;
    }

    setMessages((prev: any) => [
      ...prev,
      {
        role: "user",
        content: inputText,
        timestamp: new Date().toISOString(),
      },
    ]);

    setInputText("");
    setIsThinking(true);
  };

  //----------------------------------------------------
  // PCM ENCODER
  //----------------------------------------------------
  const pcm16 = (float32: any) => {
    const pcm = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      pcm[i] = Math.max(-1, Math.min(1, float32[i])) * 0x7fff;
    }
    return pcm;
  };

  //----------------------------------------------------
  // START CONTINUOUS VOICE
  //----------------------------------------------------
  const startLive = async () => {
    console.log("🎤 Starting voice mode...");
    setLiveMode(true);

    // Mark session started for voice mode as well
    try {
      ws.current.send(
        JSON.stringify({
          type: "start",
          language_code: "en-US",
          sample_rate: 16000,
          session_id: sessionId,
          agent_id: agentId,
          mode: "s2s",
        })
      );
      sessionStarted.current = true;
      console.log("📤 Sent start event for voice session");
    } catch (err) {
      console.error("Failed to send start for voice mode:", err);
    }
    console.log("📤 Sent 'start' message to server");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("✅ Microphone access granted");

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const src = audioCtx.createMediaStreamSource(stream);
    const proc = audioCtx.createScriptProcessor(2048, 1, 1);

    proc.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm = pcm16(input);

      const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));

      ws.current.send(
        JSON.stringify({
          type: "audio",
          audio: base64,
          agent_id: agentId,
          session_id: sessionId,
        })
      );
    };

    src.connect(proc);
    proc.connect(audioCtx.destination);

    pcmWorkerRef.current = { stream, audioCtx, proc };
    console.log("✅ Voice recording started");
  };

  //----------------------------------------------------
  // STOP CONTINUOUS VOICE
  //----------------------------------------------------
  const stopLive = () => {
    console.log("⏹️ Stopping voice mode...");
    setLiveMode(false);
    cleanupAllResources();
  };

  //----------------------------------------------------
  // COMPONENT UNMOUNT CLEANUP (for navigation)
  //----------------------------------------------------
  useEffect(() => {
    return () => {
      console.log("🚪 Component unmounting, cleaning up resources...");
      cleanupAllResources();
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  //----------------------------------------------------
  // START CONVERSATION (Open Chat)
  //----------------------------------------------------
  const openConversation = async () => {
    try {
      const bodyPayload = {
        agent_id: agentId,
        session_id: sessionId,
        user_id: user?._id,
        start_timestamp: start_timestamp,
      };

      const res: any = await syncAgent(bodyPayload);
      if (!res.error) {
        setConversationId(res?.conversation?._id ?? res?.conversation);
        toast({
          title: "Success",
          description: "Chat session started.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to start chat session",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Failed to start conversation:", err);
      toast({
        title: "Error",
        description: "Could not start conversation.",
        variant: "destructive",
      });
    }
  };

  //----------------------------------------------------
  // END SESSION / SAVE CHAT
  //----------------------------------------------------
  const handleSendMessage = () => {
    // Stop all audio playback and cleanup resources first
    console.log("🛑 Ending session, stopping all audio and voice...");
    setLiveMode(false);
    cleanupAllResources();
    console.log("💾 Saving chat...", conversationId);
    try {
      if (messages.length > 0 && conversationId) {
        const preparedBody = {
          messages,
          agent_id: agentId,
          session_id: sessionId,
          end_timestamp: end_timestamp,
          user_id: user?._id,
        };

        saveChat(preparedBody, conversationId)
          .then((res) => {
            if (!res.error) {
              const preparedBodyN8N = {
                messages,
                agent_id: agentId,
                session_id: sessionId,
                end_timestamp: end_timestamp,
                start_timestamp: start_timestamp,
                user_id: user?._id,
                conversation_id: conversationId,
              };
              saveN8Nchat(preparedBodyN8N).then((resN8N) => {
                if (!resN8N.error) {
                  console.log("✅ Chat saved successfully");
                  // Optionally call saveN8Nchat here if desired
                  toast({
                    title: "Success",
                    description: "Chat saved successfully!",
                    variant: "default",
                  });
                  setConversationId(null);
                  setMessages([]);
                  setInputText("");
                  setIsThinking(false);

                } else {
                  toast({
                    title: "Error",
                    description: `Failed to save chat to n8n: ${resN8N.errorMessage}`,
                    variant: "destructive",
                  });
                }
              });
            } else {
              toast({
                title: "Error",
                description: `Failed to save chat: ${res.errorMessage}`,
                variant: "destructive",
              });
            }
          })
          .catch((err) => {
            toast({
              title: "Error",
              description: `Failed to save chat: ${err?.message || err}`,
              variant: "destructive",
            });
          });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Something went wrong ${err}`,
        variant: "destructive",
      });
      console.error("❌ Error processing audio chunk:", err);
    }
  };

  // If conversation not started yet, show centered Open Chat button only
  // If conversation not started yet, show Open Chat button INSIDE message area
  if (!conversationId) {
    return (
      <div className="flex flex-col h-full w-full bg-background border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
        {/* HEADER - Modern with glassmorphism */}
        <div className="glass-strong text-foreground p-4 sm:p-5 flex justify-between items-center border-b border-border">
          <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow"></div>
            AI Assistant
          </h1>
          <div
            className={`h-3 w-3 rounded-full transition-all duration-300 ${isConnected ? "bg-success shadow-lg shadow-success/50" : "bg-destructive"}`}
          ></div>
        </div>

        {/* MESSAGES AREA With Centered Button */}
        <div className="flex-1 flex items-center justify-center p-6 bg-muted/30">
          <button
            onClick={openConversation}
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 text-base sm:text-lg font-medium animate-fade-in"
          >
            Start Conversation
          </button>
        </div>

        {/* FOOTER (Hidden until chat starts) */}
        <div className="p-4 sm:p-5 border-t border-border flex items-center gap-3 opacity-40 pointer-events-none bg-card">
          <input
            className="flex-1 border-2 border-input p-3 sm:p-3.5 rounded-full text-sm bg-background"
            placeholder="Type a message…"
            disabled
          />
          <button className="p-3 sm:p-3.5 rounded-full bg-muted text-muted-foreground">
            <Send size={20} />
          </button>
          <button className="p-3 sm:p-3.5 rounded-full bg-muted text-muted-foreground hidden sm:flex">
            End
          </button>
          <button className="p-3 sm:p-3.5 rounded-full bg-muted text-muted-foreground">
            <Mic size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
      {/* HEADER - Modern with glassmorphism */}
      <div className="glass-strong text-foreground p-4 sm:p-5 flex justify-between items-center border-b border-border">
        <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow"></div>
          AI Assistant
        </h1>
        <div
          className={`h-3 w-3 rounded-full transition-all duration-300 ${
            isConnected ? "bg-success shadow-lg shadow-success/50" : "bg-destructive"
          }`}
        ></div>
      </div>

      {/* MESSAGES - Modern chat bubbles */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/20 scrollbar-thin">
        {messages?.map((msg: any, i: any) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            <div
              className={`px-4 py-3 max-w-[85%] sm:max-w-[75%] rounded-2xl shadow-md transition-all duration-200 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm hover:shadow-lg"
                  : "bg-card border border-border text-card-foreground rounded-bl-sm hover:shadow-lg"
              }`}
            >
              <p className="text-sm sm:text-base break-words leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-card border border-border rounded-bl-sm px-4 py-3 rounded-2xl shadow-md flex items-center gap-2">
              <div className="loader"></div>
              <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA - Modern with enhanced styling */}
      <div className="p-4 sm:p-5 border-t border-border flex items-center gap-3 bg-card/50">
        <input
          disabled={isThinking}
          className="flex-1 border-2 border-input bg-background px-4 py-3 rounded-full text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 focus:shadow-none hover:border-ring/50 disabled:opacity-50"
          placeholder="Type a message…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isThinking && sendText()}
        />

        <button
          disabled={isThinking}
          onClick={sendText}
          className="p-3 sm:p-3.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
        >
          <Send size={20} />
        </button>

        {messages.length > 0 && (
          <button
            onClick={handleSendMessage}
            className="px-4 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hidden sm:flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span className="text-sm font-medium">End</span>
          </button>
        )}

        {!liveMode ? (
          <button
            onClick={startLive}
            className="p-3 sm:p-3.5 rounded-full bg-success hover:bg-success/90 text-success-foreground shadow-md hover:shadow-lg animate-pulse-glow transform hover:scale-105 active:scale-95 transition-all duration-200"
            disabled={isThinking}
          >
            <Mic size={20} />
          </button>
        ) : (
          <button
            disabled={isThinking}
            onClick={stopLive}
            className="p-3 sm:p-3.5 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <MicOff size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
