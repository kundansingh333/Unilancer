import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useMessageStore from "../../store/messageStore";
import { MessageSquare, Search, ChevronRight } from "lucide-react";
import SEO from "../../components/SEO";

const ConversationsPage = () => {
  const navigate = useNavigate();
  const { conversations, fetchConversations, fetchUnreadCount, isLoading } =
    useMessageStore();

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, [fetchConversations, fetchUnreadCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Messages" path="/messages" noIndex />
      
      {/* HEADER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Messages
              </h1>
              <p className="text-sm text-slate-400">
                Connect with clients and freelancers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No conversations yet</h3>
            <p className="text-slate-400 text-sm max-w-md">
              When you start messaging clients or freelancers regarding gigs or jobs, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {conversations.map((conv) => (
              <div
                key={conv._id._id}
                onClick={() => navigate(`/messages/${conv._id._id}`)}
                className="group flex items-center p-4 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-indigo-500/5 gap-4"
              >
                {/* AVATAR */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-slate-400">
                     {conv._id?.profilePicture ? (
                       <img src={conv._id.profilePicture} alt={conv._id.name} className="w-full h-full object-cover" />
                     ) : (
                       conv._id.name?.charAt(0)?.toUpperCase() || '?'
                     )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 border-2 border-slate-900 text-[10px] font-bold text-white flex items-center justify-center shadow-md animate-pulse">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                {/* USER INFO */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                     <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate pr-4">
                       {conv._id.name}
                     </p>
                     <p className="text-xs font-medium text-slate-500 shrink-0">
                       {conv.lastMessage?.timeAgo}
                     </p>
                  </div>
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold text-slate-200" : "text-slate-400"}`}>
                    {conv.lastMessage?.content || "Attached a file."}
                  </p>
                </div>

                {/* ACTION ICON */}
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500 hidden sm:block">
                   <ChevronRight className="w-5 h-5" />
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
