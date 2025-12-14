// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useEventStore from "../../store/eventStore";

// const EventRegistrationsPage = () => {
//   const { eventId } = useParams();

//   const {
//     registrations,
//     attendanceStats,
//     regLoading,
//     regError,
//     getEventRegistrations,
//   } = useEventStore();

//   useEffect(() => {
//     if (eventId) {
//       getEventRegistrations(eventId);
//     }
//   }, [eventId, getEventRegistrations]);

//   if (regLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
//         Loading registrations...
//       </div>
//     );
//   }

//   if (regError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400">
//         {regError}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-semibold">Event Registrations</h1>
//           {attendanceStats && (
//             <div className="text-sm text-slate-400">
//               Total: {attendanceStats.total} | Attended:{" "}
//               {attendanceStats.attended}
//             </div>
//           )}
//         </div>

//         {/* Empty state */}
//         {registrations.length === 0 ? (
//           <div className="text-center text-slate-400 mt-20">
//             No registrations found.
//           </div>
//         ) : (
//           <div className="overflow-x-auto border border-slate-800 rounded-xl">
//             <table className="min-w-full text-sm">
//               <thead className="bg-slate-900 text-slate-300">
//                 <tr>
//                   <th className="px-4 py-3 text-left">User</th>
//                   <th className="px-4 py-3 text-left">Role</th>
//                   <th className="px-4 py-3 text-left">Payment</th>
//                   <th className="px-4 py-3 text-left">Attendance</th>
//                   <th className="px-4 py-3 text-left">Registered At</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {registrations.map((reg) => (
//                   <tr
//                     key={reg._id}
//                     className="border-t border-slate-800 hover:bg-slate-900/40"
//                   >
//                     {/* USER */}
//                     <td className="px-4 py-3">
//                       <div className="font-medium">{reg.userId?.name}</div>
//                       <div className="text-xs text-slate-400">
//                         {reg.userId?.email}
//                       </div>
//                     </td>

//                     {/* ROLE */}
//                     <td className="px-4 py-3 capitalize">{reg.userId?.role}</td>

//                     {/* PAYMENT */}
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded text-xs ${
//                           reg.paymentStatus === "paid"
//                             ? "bg-emerald-500/20 text-emerald-300"
//                             : reg.paymentStatus === "pending"
//                             ? "bg-yellow-500/20 text-yellow-300"
//                             : "bg-slate-700 text-slate-300"
//                         }`}
//                       >
//                         {reg.paymentStatus}
//                       </span>
//                     </td>

//                     {/* ATTENDANCE */}
//                     <td className="px-4 py-3">
//                       {reg.attended ? (
//                         <span className="text-emerald-400">✔ Attended</span>
//                       ) : (
//                         <span className="text-slate-400">Not attended</span>
//                       )}
//                     </td>

//                     {/* DATE */}
//                     <td className="px-4 py-3 text-slate-400">
//                       {new Date(reg.registeredAt).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventRegistrationsPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";
import useEventStoreMain from "../../store/eventStore";

const EventRegistrationsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { event } = useEventStoreMain();

  const {
    registrations,
    attendanceStats,
    regLoading,
    regError,
    getEventRegistrations,
    markUserAttendance,
  } = useEventStore();

  const [filters, setFilters] = useState({
    paymentStatus: "",
    attended: "",
  });

  // 🔐 ROLE GUARD
  // useEffect(() => {
  //   if (!event || !user) return;

  //   if (user.role !== "admin" && event.organizedBy !== user._id) {
  //     navigate("/unauthorized");
  //   }
  // }, [event, user, navigate]);

  // FETCH DATA
  useEffect(() => {
    if (eventId) {
      getEventRegistrations(eventId, filters);
    }
  }, [eventId, filters]);

  // EXPORT CSV
  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Role", "Payment", "Attended", "Registered At"],
      ...registrations.map((r) => [
        r.userId?.name,
        r.userId?.email,
        r.userId?.role,
        r.paymentStatus,
        r.attended ? "Yes" : "No",
        new Date(r.registeredAt).toLocaleString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "event-registrations.csv";
    a.click();
  };

  if (regLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading registrations...
      </div>
    );
  }

  if (regError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {regError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Event Registrations</h1>
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600"
          >
            Export CSV
          </button>
        </div>

        {/* STATS */}
        {attendanceStats && (
          <div className="text-sm text-slate-400">
            Total: {attendanceStats.total} | Attended:{" "}
            {attendanceStats.attended}
          </div>
        )}

        {/* FILTERS */}
        <div className="flex gap-3 flex-wrap">
          <select
            className="input"
            onChange={(e) =>
              setFilters((p) => ({ ...p, paymentStatus: e.target.value }))
            }
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
            <option value="pending">Pending</option>
          </select>

          <select
            className="input"
            onChange={(e) =>
              setFilters((p) => ({ ...p, attended: e.target.value }))
            }
          >
            <option value="">All Attendance</option>
            <option value="true">Attended</option>
            <option value="false">Not Attended</option>
          </select>
        </div>

        {/* TABLE */}
        {registrations.length === 0 ? (
          <p className="text-slate-400 mt-10">No registrations found.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id} className="border-t border-slate-800">
                    <td className="px-4 py-3">
                      <div className="font-medium">{reg.userId?.name}</div>
                      <div className="text-xs text-slate-400">
                        {reg.userId?.email}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {reg.paymentStatus}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {reg.attended ? "✔" : "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          markUserAttendance(
                            eventId,
                            reg.userId._id,
                            !reg.attended
                          )
                        }
                        className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationsPage;
