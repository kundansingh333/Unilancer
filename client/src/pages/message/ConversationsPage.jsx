import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useMessageStore from "../../store/messageStore";

const ConversationsPage = () => {
  const navigate = useNavigate();
  const { conversations, fetchConversations, fetchUnreadCount, isLoading } =
    useMessageStore();

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  if (isLoading) {
    return <div className="px-4 py-6 text-slate-400">Loading conversations...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <h1 className="text-2xl font-semibold">Messages</h1>

        {conversations.length === 0 ? (
          <p className="text-slate-400">No conversations yet</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv._id._id}
                onClick={() => navigate(`/messages/${conv._id._id}`)}
                className="flex justify-between items-center p-3 sm:p-4 bg-slate-900 rounded-lg
                           hover:bg-slate-800 cursor-pointer transition gap-3"
              >
                {/* USER INFO */}
                <div>
                  <p className="font-medium">{conv._id.name}</p>
                  <p className="text-sm text-slate-400 truncate max-w-[150px] sm:max-w-xs">
                    {conv.lastMessage?.content}
                  </p>
                </div>

                {/* META */}
                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {conv.lastMessage?.timeAgo}
                  </p>

                  {conv.unreadCount > 0 && (
                    <span className="inline-block mt-1 text-xs bg-blue-600 px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
