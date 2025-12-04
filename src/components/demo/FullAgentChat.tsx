import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, ArrowDownToLine } from "lucide-react";
import { toast } from "../ui/use-toast";
import  agentsApi  from "@/api/agentActionsApi";
import { useAuth } from "@/context/AuthContext";
const WS_URL = `ws://192.168.1.175:5000/stream-transcribe`;
export default function ChatApp({ agentId  , id }:any) {
  const [messages, setMessages] :any = useState([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const {saveChat} = agentsApi();
  const ws : any = useRef(null);
  const audioQueue :any = useRef([]); 
  const isPlayingAudio :any = useRef(false);
  const messagesEndRef :any = useRef(null);
  const { user, loading: authLoading } = useAuth();
console.log(user , "user")
  const pcmWorkerRef :any = useRef(null);

  const [sessionId] = useState(`session_${Date.now()}`);

  console.log(messages , "messages")
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
  const handleWSMessage = (event:any) => {
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
        setMessages((prev :any) => [
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
          setMessages((prev :any) => [
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
  // AUDIO STREAMING QUEUE SYSTEM
  //----------------------------------------------------
  const enqueueAudioChunk = (base64Chunk:any, isFinal:any) => {
    audioQueue.current.push({ base64Chunk , isFinal } );
    console.log("📥 Audio chunk queued. Queue size:", audioQueue.current.length);

    if (!isPlayingAudio.current) {
      playNextAudioChunk();
    }
  };

  const playNextAudioChunk = async () => {
    if (audioQueue.current.length === 0) {
      isPlayingAudio.current = false;
      console.log("🏁 Audio playback complete");
      return;
    }

    isPlayingAudio.current = true;

    const { base64Chunk } :any = audioQueue.current.shift();
    console.log("▶️ Playing audio chunk. Remaining:", audioQueue.current.length);
    
    try {
      const audioBinary = Uint8Array.from(atob(base64Chunk), (x) =>
        x.charCodeAt(0)
      );

      const blob = new Blob([audioBinary], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      
      // Wait for audio to load before playing
      audio.addEventListener('canplaythrough', async () => {
        try {
          await audio.play();
          console.log("✅ Audio playing");
        } catch (playError) {
          console.error("❌ Audio play error:", playError);
          // Continue to next chunk even if this one fails
          URL.revokeObjectURL(url);
          playNextAudioChunk();
        }
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.error("❌ Audio load error:", e);
        URL.revokeObjectURL(url);
        playNextAudioChunk();
      }, { once: true });

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

    ws.current.send(
      JSON.stringify({
        type: "text_message",
        text: inputText,
        session_id: sessionId,
        agent_id: agentId,
        user_id: user?._id,
      })
    );

    setMessages((prev:any) => [
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
  const pcm16 = (float32 :any) => {
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
    console.log("📤 Sent 'start' message to server");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("✅ Microphone access granted");

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const src = audioCtx.createMediaStreamSource(stream);
    const proc = audioCtx.createScriptProcessor(2048, 1, 1);

    proc.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm = pcm16(input);

      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(pcm.buffer))
      );

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

    pcmWorkerRef.current  = { stream, audioCtx, proc };
    console.log("✅ Voice recording started");
  };

  //----------------------------------------------------
  // STOP CONTINUOUS VOICE
  //----------------------------------------------------
  const stopLive = () => {
    console.log("⏹️ Stopping voice mode...");
    setLiveMode(false);

    // Clear any pending audio chunks
    audioQueue.current = [];
    isPlayingAudio.current = false;
    console.log("🗑️ Audio queue cleared");

    ws.current.send(
      JSON.stringify({
        type: "stop",
        session_id: sessionId,
        agent_id: agentId,
      })
    );
    console.log("📤 Sent 'stop' message to server");

    const w :any = pcmWorkerRef.current;
    if (w) {
      w.stream.getTracks().forEach((t :any) => t.stop());
      w.proc.disconnect();
      w.audioCtx.close();
      console.log("✅ Voice recording stopped and cleaned up");
    }
  };

  //----------------------------------------------------
  // UI
  //----------------------------------------------------
const handleSendMessage = ()=>{
try{
  if(messages.length > 0 && id){
   const preparedBody = {
  messages,
  agent_id: agentId,
  session_id: sessionId,
  timestamp: new Date().toISOString(), // GMT/UTC format
};
console.log(preparedBody , "preparedBody")

    saveChat(preparedBody , id).then((res)=>{
      if(!res.error){
        toast({
          title: "Success",
          description: "Chat saved successfully!",
          variant: "default",
        })
      }
    })
  }
 
}
catch(err){
  toast({
    title: "Error",
    description: `Something went wrong ${err}`,
    variant: "destructive",
  })
        console.error("❌ Error processing audio chunk:", err);

}
}

  return (
    <div className="flex flex-col h-[600px] max-w-xl mx-auto bg-white border rounded-xl shadow-lg">

      {/* HEADER */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">AI Voice Assistant</h1>
        <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-400" : "bg-red-500"}`}></div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">

        {messages.map((msg :any, i :any) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 max-w-[75%] rounded-xl shadow ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white border rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
            Bot is responding…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t flex items-center gap-2">

        <input
          className="flex-1 border p-3 rounded-xl"
          placeholder="Type a message…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendText()}
        />

        <button onClick={sendText} className="p-3 rounded-xl bg-indigo-600 text-white">
          <Send size={18} />
        </button>

{ messages.length > 0 && <button onClick={handleSendMessage} className="p-3 rounded-xl bg-indigo-600 text-white">
    <ArrowDownToLine size={18} />
        </button>}

        {!liveMode ? (
          <button
            onClick={startLive}
            className="p-3 rounded-xl bg-green-600 text-white shadow animate-pulse"
          >
            <Mic size={18} />
          </button>
        ) : (
          <button
            onClick={stopLive}
            className="p-3 rounded-xl bg-red-600 text-white shadow"
          >
            <MicOff size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
