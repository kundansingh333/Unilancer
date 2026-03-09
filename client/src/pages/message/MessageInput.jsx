import { useState, useEffect } from "react";
import useMessageStore from "../../store/messageStore";
import { uploadImage } from "../../api/uploadApi";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Smile, X } from "lucide-react";
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
    <div className="p-3 border-t border-slate-800 bg-slate-950/80">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-2 flex items-center justify-between bg-slate-800 p-2 rounded-lg text-xs text-slate-300 w-fit gap-4">
          <span className="truncate max-w-[200px]">{selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)} className="text-rose-400 hover:text-rose-300">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute z-10 bottom-20 right-4 shadow-xl">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-slate-400 hover:text-yellow-400 transition-colors p-2"
        >
          <Smile size={20} />
        </button>
        
        <label className="cursor-pointer text-slate-400 hover:text-blue-400 transition-colors p-2">
          <Paperclip size={20} />
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </label>

        <input
          value={text}
          onChange={handleMessageTyping}
          onKeyDown={(e) => e.key === "Enter" && !isUploading && handleSend()}
          className="flex-1 bg-slate-900 px-4 py-2.5 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-white"
        >
          {isUploading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
