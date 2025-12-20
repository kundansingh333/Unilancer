import { useState } from "react";
import useMessageStore from "../../store/messageStore";

const MessageInput = ({ receiverId }) => {
  const [text, setText] = useState("");
  const sendMessage = useMessageStore((s) => s.sendMessage);

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      receiverId,
      content: text.trim(),
    });

    setText("");
  };

  return (
    <div className="p-3 border-t border-slate-800 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 bg-slate-900 px-3 py-2 rounded text-sm"
        placeholder="Type a message..."
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 px-4 py-2 rounded text-sm"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
