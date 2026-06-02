import { useState, useEffect } from "react";
import useMessageStore from "../../store/messageStore";
import { uploadImage } from "../../api/uploadApi";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Smile, X, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/authStore";

const MessageInput = ({ receiverId }) => {
  const [text, setText] = useState("");
  const sendMessage = useMessageStore((s) => s.sendMessage);
  const sendTyping = useMessageStore((s) => s.sendTyping);
  const { user } = useAuthStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Debounce typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      sendTyping(receiverId, user?._id, false);
    }, 2000);

    return () => clearTimeout(typingTimeout);
  }, [text, receiverId, sendTyping, user]);

  const handleMessageTyping = (e) => {
    setText(e.target.value);
    sendTyping(receiverId, user?._id, true);
  };

  const handleEmojiClick = (emojiObj) => {
    setText((prev) => prev + emojiObj.emoji);
  };

  const handleSend = async () => {
    if (!text.trim() && !selectedFile) return toast.error("Message cannot be empty.");

    let attachmentUrl = null;
    let attachmentType = null;

    if (selectedFile) {
      setIsUploading(true);
      try {
        attachmentUrl = await uploadImage(selectedFile);
        attachmentType = selectedFile.type.startsWith("image/") ? "image" 
          : selectedFile.type.startsWith("video/") ? "video" 
          : selectedFile.type.startsWith("audio/") ? "audio" : "file";
      } catch (err) {
        setIsUploading(false);
        return toast.error("Failed to upload file");
      }
      setIsUploading(false);
    }

    const attachments = attachmentUrl ? [{ url: attachmentUrl, type: attachmentType }] : [];

    await sendMessage({
      receiverId,
      content: text.trim(),
      attachments,
    });

    setText("");
    setSelectedFile(null);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-800 relative z-20">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-3 flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700 shadow-sm max-w-sm">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-medium text-slate-200 truncate">{selectedFile.name}</span>
          </div>
          <button onClick={() => setSelectedFile(null)} className="p-1 rounded-md text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute z-50 bottom-20 left-4 shadow-2xl">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <label className="p-2 cursor-pointer text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </label>
        </div>

        <textarea
          value={text}
          onChange={handleMessageTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!isUploading) handleSend();
            }
          }}
          rows={1}
          className="flex-1 max-h-32 min-h-[44px] bg-slate-950 px-4 py-3 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 border border-slate-700 resize-none transition-all placeholder:text-slate-500 custom-scrollbar"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          disabled={isUploading || (!text.trim() && !selectedFile)}
          className="h-[44px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold transition-colors flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
