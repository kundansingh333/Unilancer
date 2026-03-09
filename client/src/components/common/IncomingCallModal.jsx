import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import io from "socket.io-client";
import { Phone, PhoneOff, Video } from "lucide-react";

let socket;

const IncomingCallModal = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [callSignal, setCallSignal] = useState(null);
  const [callerName, setCallerName] = useState("");
  const [callerId, setCallerId] = useState("");

  // Initialize socket listener globally just for calls
  useEffect(() => {
    if (!user) return;

    socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001", {
      withCredentials: true,
    });

    socket.emit("join", user._id);

    // Listen for incoming ZegoCloud signaling requests
    socket.on("callUser", (data) => {
      setCallSignal(data.signal); // ZegoCloud Room ID (or peer payload)
      setCallerId(data.from);
      setCallerName(data.name);
      
      // Play ringtone
      const audio = new Audio("/ringtone.mp3"); // Optional: add an mp3 in public/
      audio.play().catch(e => console.log("Audio play prevented by browser interaction policy"));
    });

    socket.on("callRejected", () => {
      // If we made a call and they rejected it
      console.log("Call Rejected");
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleAccept = () => {
    // We navigate the receiver to the same ZegoCloud room
    if (socket) socket.emit("answerCall", { to: callerId, signal: callSignal });
    navigate(`/call/${callSignal}`);
    setCallSignal(null);
  };

  const handleReject = () => {
    if (socket) socket.emit("rejectCall", { to: callerId });
    setCallSignal(null);
  };

  if (!callSignal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/50 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center animate-pulse mb-6 border-4 border-slate-700/30">
          <span className="text-3xl">👤</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{callerName}</h2>
        <p className="text-slate-400 mb-8">Incoming Call...</p>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={handleReject}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
              <PhoneOff size={24} />
            </div>
            <span className="text-xs text-rose-400 font-medium">Decline</span>
          </button>
          
          <button 
            onClick={handleAccept}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-green-500/20 animate-ping rounded-full"></div>
              <Phone size={24} className="animate-bounce" />
            </div>
            <span className="text-xs text-green-400 font-medium">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
