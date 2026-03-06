import { useState, useEffect } from "react";
import { fetchDeletedUsers } from "../../api/adminApi";

const AdminDeletedUsersPage = () => {
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
    <div className="min-h-screen bg-slate-950 text-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Deleted Users Archive
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View users who have deleted their accounts or were removed by an
            administrator. Their content (gigs, events, jobs) has been safely
            purged.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-slate-200 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Original ID</th>
                  <th className="px-6 py-4">Name / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Deleted By</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Deleted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                        <span className="text-slate-400">Loading archive...</span>
                      </div>
                    </td>
                  </tr>
                ) : deletedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No deleted users found in the archive.
                    </td>
                  </tr>
                ) : (
                  deletedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {user.originalId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-slate-800 text-slate-300 border border-slate-700">
                          {user.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            user.deletedBy === "admin"
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {user.deletedBy === "admin" ? "Admin" : "Self"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs max-w-[200px] truncate" title={user.reason}>
                        {user.reason || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap text-slate-400">
                        {new Date(user.deletedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDeletedUsersPage;
