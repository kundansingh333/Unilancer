import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";

const AdminDisputedOrdersPage = () => {
  const { user } = useAuthStore();
  const { disputedOrders, loading, error, loadDisputedOrders } = useAdminStore();

  useEffect(() => {
    if (user?.role === "admin") {
      loadDisputedOrders();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-rose-500">Disputed Orders</h1>
            <p className="text-sm text-slate-400">Review orders that require admin mediation.</p>
          </div>
        </div>

        {loading && <p className="text-slate-400">Loading disputed orders...</p>}
        {error && <p className="text-red-400 border border-red-500/20 bg-red-500/10 p-4 rounded">{error}</p>}

        {!loading && disputedOrders.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No disputed orders found. Everything is running smoothly!
          </div>
        )}

        <div className="grid gap-4">
          {disputedOrders.map((order) => (
            <div key={order._id} className="bg-slate-900 border border-rose-500/30 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-lg text-slate-200">
                    Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs px-2 py-0.5 rounded-full font-medium">
                    Disputed
                  </span>
                </div>
                
                <p className="text-sm text-slate-400">
                  <span className="font-medium text-slate-300">Gig:</span> {order.gigId?.title || "Unknown Gig"}
                </p>
                <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                  <p>Client: {order.clientId?.name || "Unknown"}</p>
                  <p>Freelancer: {order.freelancerId?.name || "Unknown"}</p>
                  <p>Price: ₹{order.price}</p>
                </div>
                {order.disputeReason && (
                  <p className="text-sm text-rose-400/80 italic mt-2 border-l-2 border-rose-500/50 pl-2">
                    &quot;{order.disputeReason}&quot;
                  </p>
                )}
              </div>
              
              <Link 
                to={`/orders/${order._id}`}
                className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors"
              >
                Intervene Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDisputedOrdersPage;
