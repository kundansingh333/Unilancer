// // src/pages/orders/OrdersPage.jsx
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import useOrderStore from "../../store/orderStore";
// import useAuthStore from "../../store/authStore";

// const statusOptions = [
//   "all",
//   "pending",
//   "in_progress",
//   "delivered",
//   "revision_requested",
//   "completed",
//   "cancelled",
//   "disputed",
// ];

// const roleOptions = [
//   { value: "all", label: "As client & freelancer" },
//   { value: "client", label: "As client" },
//   { value: "freelancer", label: "As freelancer" },
// ];

// const OrdersPage = () => {
//   const { user } = useAuthStore();
//   const { orders, isLoading, error, fetchOrders, stats, fetchOrderStats } =
//     useOrderStore();

//   const [statusFilter, setStatusFilter] = useState("all");
//   const [roleFilter, setRoleFilter] = useState("all");

//   useEffect(() => {
//     if (user) {
//       const query = {};
//       if (statusFilter !== "all") query.status = statusFilter;
//       if (roleFilter !== "all") query.role = roleFilter;
//       fetchOrders(query);
//       fetchOrderStats();
//     }
//   }, [user, statusFilter, roleFilter, fetchOrders, fetchOrderStats]);

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-50">
//       <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         {/* Header */}
//         <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <p className="text-xs uppercase tracking-wider text-slate-500">
//               Orders
//             </p>
//             <h1 className="text-2xl font-semibold mt-1">
//               Your orders & projects
//             </h1>
//             <p className="text-xs text-slate-400 mt-1">
//               Track orders where you are a client or freelancer.
//             </p>
//           </div>

//           {/* Simple stats */}
//           {stats && (
//             <div className="grid grid-cols-3 gap-2 text-xs">
//               <StatPill label="Active" value={stats.active} />
//               <StatPill label="Completed" value={stats.completed} />
//               <StatPill label="Cancelled" value={stats.cancelled} />
//             </div>
//           )}
//         </header>

//         {/* Filters */}
//         <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
//           <div className="flex flex-wrap gap-3 text-xs items-center">
//             <span className="text-slate-400">Status:</span>
//             <div className="flex flex-wrap gap-2">
//               {statusOptions.map((st) => (
//                 <button
//                   key={st}
//                   onClick={() => setStatusFilter(st)}
//                   className={`px-3 py-1 rounded-full border text-xs ${
//                     statusFilter === st
//                       ? "border-blue-500 bg-blue-500/10 text-blue-300"
//                       : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
//                   }`}
//                 >
//                   {st === "all" ? "All" : st.replace("_", " ")}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 text-xs">
//             <span className="text-slate-400">View role:</span>
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               {roleOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </section>

//         {/* Error */}
//         {error && (
//           <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
//             {error}
//           </div>
//         )}

//         {/* List */}
//         <section className="space-y-3">
//           {isLoading && (
//             <div className="text-sm text-slate-400">Loading orders...</div>
//           )}

//           {!isLoading && orders.length === 0 && (
//             <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
//               No orders found yet. Once you{" "}
//               <Link
//                 to="/gigs"
//                 className="text-blue-400 hover:text-blue-300 underline"
//               >
//                 hire a freelancer
//               </Link>{" "}
//               or{" "}
//               <Link
//                 to="/gigs"
//                 className="text-blue-400 hover:text-blue-300 underline"
//               >
//                 get hired
//               </Link>
//               , they will appear here.
//             </div>
//           )}

//           <div className="space-y-3">
//             {orders.map((order) => (
//               <OrderCard key={order._id} order={order} />
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// const StatPill = ({ label, value }) => (
//   <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
//     <p className="text-[10px] uppercase tracking-wide text-slate-500">
//       {label}
//     </p>
//     <p className="text-sm font-semibold text-slate-50">{value ?? 0}</p>
//   </div>
// );

// const statusColors = {
//   pending: "bg-amber-500/10 text-amber-300 border-amber-500/40",
//   in_progress: "bg-blue-500/10 text-blue-300 border-blue-500/40",
//   delivered: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
//   revision_requested: "bg-purple-500/10 text-purple-300 border-purple-500/40",
//   completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
//   cancelled: "bg-rose-500/10 text-rose-300 border-rose-500/40",
//   disputed: "bg-red-500/10 text-red-300 border-red-500/40",
// };

// const OrderCard = ({ order }) => {
//   const statusClass =
//     "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border " +
//     (statusColors[order.status] ||
//       "bg-slate-700/60 text-slate-200 border-slate-600");

//   const roleLabel =
//     order.clientId && order.freelancerId
//       ? `Client: ${order.clientId?.name || "You"}`
//       : "";

//   return (
//     <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-3">
//       <div className="flex items-start justify-between gap-3">
//         <div className="space-y-1">
//           <p className="text-xs text-slate-500">
//             #{order.orderNumber || order._id.slice(-8)}
//           </p>
//           <h2 className="text-sm font-semibold text-slate-50 line-clamp-2">
//             {order.title}
//           </h2>
//           <p className="text-xs text-slate-400 line-clamp-2">
//             {order.description}
//           </p>
//           <p className="text-[11px] text-slate-500 mt-1">
//             Category: <span className="text-slate-300">{order.category}</span>
//           </p>
//         </div>

//         <div className="flex flex-col items-end gap-2">
//           <span className={statusClass}>{order.status.replace("_", " ")}</span>
//           <p className="text-xs text-slate-400">
//             {order.price} {order.currency || "INR"}
//           </p>
//           {order.deadline && (
//             <p className="text-[11px] text-slate-500">
//               Deadline: {new Date(order.deadline).toLocaleDateString()}
//             </p>
//           )}
//           <Link
//             to={`/orders/${order._id}`}
//             className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
//           >
//             View details
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;

// src/pages/orders/OrdersPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";

const statusOptions = [
  "all",
  "pending",
  "in_progress",
  "delivered",
  "revision_requested",
  "completed",
  "cancelled",
  "disputed",
];

const roleOptions = [
  { value: "all", label: "As client & freelancer" },
  { value: "client", label: "As client" },
  { value: "freelancer", label: "As freelancer" },
];

const OrdersPage = () => {
  const { user } = useAuthStore();
  const { orders, isLoading, error, fetchOrders, stats, fetchOrderStats } =
    useOrderStore();

  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (user) {
      const query = {};
      if (statusFilter !== "all") query.status = statusFilter;
      if (roleFilter !== "all") query.role = roleFilter;
      fetchOrders(query);
      fetchOrderStats();
    }
  }, [user, statusFilter, roleFilter, fetchOrders, fetchOrderStats]);

  // Defensive defaults
  const safeOrders = orders ?? []; // if orders undefined -> empty array
  const safeStats = stats ?? { active: 0, completed: 0, cancelled: 0 };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Orders
            </p>
            <h1 className="text-2xl font-semibold mt-1">
              Your orders & projects
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track orders where you are a client or freelancer.
            </p>
          </div>

          {/* Simple stats */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <StatPill label="Active" value={safeStats.active} />
            <StatPill label="Completed" value={safeStats.completed} />
            <StatPill label="Cancelled" value={safeStats.cancelled} />
          </div>
        </header>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 text-xs items-center">
            <span className="text-slate-400">Status:</span>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full border text-xs ${
                    statusFilter === st
                      ? "border-blue-500 bg-blue-500/10 text-blue-300"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {st === "all" ? "All" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">View role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* List */}
        <section className="space-y-3">
          {isLoading && (
            <div className="text-sm text-slate-400">Loading orders...</div>
          )}

          {!isLoading && safeOrders.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
              No orders found yet. Once you{" "}
              <Link
                to="/gigs"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                hire a freelancer
              </Link>{" "}
              or{" "}
              <Link
                to="/gigs"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                get hired
              </Link>
              , they will appear here.
            </div>
          )}

          <div className="space-y-3">
            {safeOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatPill = ({ label, value }) => (
  <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
    <p className="text-[10px] uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="text-sm font-semibold text-slate-50">{value ?? 0}</p>
  </div>
);

const statusColors = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/40",
  in_progress: "bg-blue-500/10 text-blue-300 border-blue-500/40",
  delivered: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  revision_requested: "bg-purple-500/10 text-purple-300 border-purple-500/40",
  completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  cancelled: "bg-rose-500/10 text-rose-300 border-rose-500/40",
  disputed: "bg-red-500/10 text-red-300 border-red-500/40",
};

const OrderCard = ({ order }) => {
  const statusClass =
    "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border " +
    (statusColors[order.status] ||
      "bg-slate-700/60 text-slate-200 border-slate-600");

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs text-slate-500">
            #{order.orderNumber || (order._id ? order._id.slice(-8) : "—")}
          </p>
          <h2 className="text-sm font-semibold text-slate-50 line-clamp-2">
            {order.title}
          </h2>
          <p className="text-xs text-slate-400 line-clamp-2">
            {order.description}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Category: <span className="text-slate-300">{order.category}</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={statusClass}>{order.status.replace("_", " ")}</span>
          <p className="text-xs text-slate-400">
            {order.price} {order.currency || "INR"}
          </p>
          {order.deadline && (
            <p className="text-[11px] text-slate-500">
              Deadline: {new Date(order.deadline).toLocaleDateString()}
            </p>
          )}
          <Link
            to={`/orders/${order._id}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
