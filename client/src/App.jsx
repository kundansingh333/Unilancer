// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import UnauthorizedPage from "./pages/misc/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ProfilePage from "./pages/profile/ProfilePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import MyGigsPage from "./pages/gigs/MyGigsPage";
import GigDetailPage from "./components/gigs/GigDetailPage";
import GigsListPage from "./components/gigs/GigsListPage";
import GigForm from "./components/gigs/GigForm";

import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";

import EventListPage from "./pages/events/EventListPage";
import EventDetailPage from "./pages/events/EventDetailPage";
import CreateEventPage from "./pages/events/CreateEventPage";
import EditEventPage from "./pages/events/EditEventPage";
import MyRegisteredEventsPage from "./pages/events/MyRegisteredEventPage";
import MyOrganizedEventsPage from "./pages/events/MyOrganizedEventsPage";
import AdminEventApprovalPage from "./pages/events/AdminEventApprovalPage";
import EventAttendancePage from "./pages/events/EventAttendancePage";
import { Toaster } from "react-hot-toast";
import EventRegistrationsPage from "./pages/events/EventRegistrationsPage";
import AdminJobApprovalPage from "./pages/admin/AdminJobApprovalPage";
import BookmarkedJobsPage from "./pages/jobs/BookmarkedJobsPage";
import JobApplicantsPage from "./pages/jobs/JobApplicantsPage";
import JobListPage from "./pages/jobs/JobListPage";
import CreateJobPage from "./pages/jobs/CreateJobPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import EditJobPage from "./pages/jobs/EditJobPage";
import MyPostedJobsPage from "./pages/jobs/MyPostedJobsPage";
import MyApplicationsPage from "./pages/jobs/MyApplicationsPage";
import ApplyJob from "./pages/jobs/ApplyJob";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import useMessageStore from "./store/messageStore";
import ConversationsPage from "./pages/message/ConversationsPage";
import ChatPage from "./pages/message/ChatPage";

// import OrganizedEventsPage from "./pages/events/OrganizedEventsPage";
// import RegisteredEventsPage from "./pages/events/RegisteredEventsPage";

const App = () => {
  // const { user } = useAuthStore();
  // const { connectSocket, disconnectSocket } = useMessageStore();

  // useEffect(() => {
  //   if (user?._id) {
  //     connectSocket(user._id);
  //   }

  //   return () => {
  //     disconnectSocket();
  //   };
  // }, [user]);
  const user = useAuthStore((state) => state.user);
  const connectSocket = useMessageStore((state) => state.connectSocket);
  const disconnectSocket = useMessageStore((state) => state.disconnectSocket);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }

    return () => {
      disconnectSocket();
    };
  }, [user?._id]);
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* PUBLIC EVENTS */}
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* PUBLIC GIGS */}
          <Route path="/gigs" element={<GigsListPage />} />
          <Route path="/gigs/:id" element={<GigDetailPage />} />

          {/* ---------- PROTECTED ROUTES ---------- */}

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* GIG CREATION (Students + Alumni only) */}
          <Route
            path="/gigs/create"
            element={
              <ProtectedRoute allowedRoles={["student", "alumni"]}>
                <GigForm />
              </ProtectedRoute>
            }
          />

          {/* MY GIGS */}
          <Route
            path="/gigs/my"
            element={
              <ProtectedRoute>
                <MyGigsPage />
              </ProtectedRoute>
            }
          />

          {/* ORDERS */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* EVENT CREATION */}
          <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />

          {/* EVENT EDIT */}
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            }
          />

          {/* MY EVENTS */}
          <Route
            path="/events/my/registered"
            element={
              <ProtectedRoute>
                <MyRegisteredEventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/my/organized"
            element={
              <ProtectedRoute>
                <MyOrganizedEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/registrations"
            element={
              <ProtectedRoute>
                <EventRegistrationsPage />
              </ProtectedRoute>
            }
          />

          {/* JOB APPLICANTS + BOOKMARKS */}
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute allowedRoles={["alumni", "faculty", "admin"]}>
                <CreateJobPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/my/posted"
            element={
              <ProtectedRoute allowedRoles={["alumni", "faculty", "admin"]}>
                <MyPostedJobsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["alumni", "faculty", "admin"]}>
                <EditJobPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/my/applications"
            element={
              <ProtectedRoute allowedRoles={["student", "alumni"]}>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/applicants"
            element={
              <ProtectedRoute allowedRoles={["alumni", "faculty", "admin"]}>
                <JobApplicantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/my/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarkedJobsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/my/posted"
            element={
              <ProtectedRoute allowedRoles={["alumni", "faculty", "admin"]}>
                <MyPostedJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs/approvals"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminJobApprovalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId/apply"
            element={
              <ProtectedRoute allowedRoles={["student", "alumni"]}>
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          {/* ADMIN: EVENT APPROVAL */}
          <Route
            path="/admin/events/approvals"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminEventApprovalPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN + ORGANIZER: ATTENDANCE */}
          <Route
            path="/events/:id/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <EventAttendancePage />
              </ProtectedRoute>
            }
          />

          {/* MESSAGES */}
          <Route path="/messages" element={<ConversationsPage />} />
          <Route path="/messages/:otherUserId" element={<ChatPage />} />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
