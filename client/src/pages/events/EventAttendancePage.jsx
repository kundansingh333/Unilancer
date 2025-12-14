import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";

const EventAttendancePage = () => {
  const { id } = useParams();

  const { user } = useAuthStore();

  const {
    registrations,
    attendanceStats,
    regLoading,
    regError,
    getEventRegistrations,
    markUserAttendance,
  } = useEventStore();

  useEffect(() => {
    getEventRegistrations(id);
  }, [id]);

  const toggleAttendance = async (userId, current) => {
    await markUserAttendance(id, userId, !current);
  };

  if (regLoading)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        Loading attendance...
      </div>
    );

  if (regError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-red-300">{regError}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

      {attendanceStats && (
        <div className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm">
          <p>Total Registrations: {attendanceStats.totalRegistrations}</p>
          <p>Attendance Count: {attendanceStats.attendanceCount}</p>
          <p>Attendance Rate: {attendanceStats.attendanceRate}%</p>
        </div>
      )}

      <div className="space-y-3">
        {registrations.map((reg) => (
          <div
            key={reg.userId._id}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold">{reg.userId.name}</p>
              <p className="text-xs text-slate-400">{reg.userId.email}</p>
            </div>

            <button
              onClick={() => toggleAttendance(reg.userId._id, reg.attended)}
              className={`px-3 py-1 rounded-lg text-xs ${
                reg.attended
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              {reg.attended ? "Present" : "Mark Present"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventAttendancePage;
