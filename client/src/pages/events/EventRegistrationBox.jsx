import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";

const EventRegistrationBox = ({ event }) => {
  const { user } = useAuthStore();
  const { registerForEvent, unregisterFromEvent, isLoading, error } =
    useEventStore();

  const isRegistered = event.userStatus?.isRegistered;
  const registration = event.userStatus?.registration;
  const registrationOpen = event.registrationOpen;

  const price = event.registrationFee || 0;
  const isPaid = registration?.paymentStatus === "paid";
  const pendingPayment = registration?.paymentStatus === "pending";

  const handleRegister = async () => {
    const txnId = price > 0 ? prompt("Enter transaction ID (optional)") : "";
    const res = await registerForEvent(event._id, txnId);

    if (!res.success) alert(res.error);
    else window.location.reload();
  };

  const handleUnregister = async () => {
    if (!confirm("Are you sure you want to unregister?")) return;

    const res = await unregisterFromEvent(event._id);
    if (!res.success) alert(res.error);
    else window.location.reload();
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">Registration</h3>

      {error && (
        <div className="text-red-400 text-xs border border-red-500/40 p-2 rounded">
          {error}
        </div>
      )}

      {!user && (
        <p className="text-xs text-slate-400">
          Please login to register for events.
        </p>
      )}

      {user && (
        <>
          {/* Registration closed */}
          {!registrationOpen && !isRegistered && (
            <p className="text-xs text-slate-400">Registration is closed.</p>
          )}

          {/* Registered */}
          {isRegistered && (
            <div className="space-y-2">
              <p className="text-xs text-green-300 font-medium">
                ✅ You are registered
              </p>

              {price > 0 && (
                <p className="text-xs text-slate-300">
                  Payment:{" "}
                  <span className="font-semibold">
                    {isPaid ? "Paid" : pendingPayment ? "Pending" : "Free"}
                  </span>
                </p>
              )}

              <button
                onClick={handleUnregister}
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-500 px-3 py-2 rounded-lg text-white text-xs"
              >
                {isLoading ? "Processing..." : "Unregister"}
              </button>
            </div>
          )}

          {/* Not registered yet */}
          {!isRegistered && registrationOpen && (
            <div className="space-y-2">
              <p className="text-xs text-slate-300">
                Fee:{" "}
                <span className="font-semibold">
                  {price === 0 ? "Free" : `₹${price}`}
                </span>
              </p>

              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-white text-xs"
              >
                {isLoading ? "Registering..." : "Register Now"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventRegistrationBox;
