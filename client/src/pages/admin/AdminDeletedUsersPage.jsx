import { useState, useEffect } from "react";
import { fetchDeletedUsers } from "../../api/adminApi";
import { 
  Trash2, 
  AlertCircle, 
  ChevronLeft,
  Search,
  UserX,
  CalendarDays,
  ShieldAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

const AdminDeletedUsersPage = () => {
  const navigate = useNavigate();
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeletedUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchDeletedUsers();
      if (res.data?.success) {
        setDeletedUsers(res.data.deletedUsers);
      } else {
        throw new Error(res.data?.error || "Failed to load deleted users");
      }
    } catch (err) {
      console.error("Load deleted users error:", err);
      setError(err?.response?.data?.error || err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Deleted Users Archive" path="/admin/users/deleted" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Deleted Users Archive
              </h1>
              <p className="text-sm text-slate-400">
                View users who have deleted their accounts or were removed by an administrator.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading archive...
          </div>
        ) : deletedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Archive is Empty</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              No deleted users found in the archive.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-5">User Details</th>
                    <th className="px-6 py-5">Role</th>
                    <th className="px-6 py-5">Deleted By</th>
                    <th className="px-6 py-5">Reason</th>
                    <th className="px-6 py-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {deletedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-700">
                            <UserX className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 group-hover:text-white transition-colors">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {user.email}
                            </div>
                            <div className="text-[10px] font-mono text-slate-600 mt-1 uppercase">
                              ID: {user.originalId?.slice(-8) || "UNKNOWN"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-800/80 text-slate-400 border border-slate-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.deletedBy === "admin" ? (
                            <>
                              <ShieldAlert className="w-4 h-4 text-rose-500" />
                              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Admin</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4 text-indigo-400" />
                              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Self</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          {user.reason ? (
                            <p className="text-xs text-slate-400 line-clamp-2 italic" title={user.reason}>
                              "{user.reason}"
                            </p>
                          ) : (
                            <span className="text-xs text-slate-600 font-medium">No reason provided</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <CalendarDays className="w-4 h-4 text-slate-500" />
                          {new Date(user.deletedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDeletedUsersPage;
