// src/pages/misc/UnauthorizedPage.jsx
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4">
      <h1 className="text-4xl font-bold mb-2">403</h1>
      <p className="text-sm text-slate-400 mb-4">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        to="/dashboard"
        className="text-sm text-blue-400 hover:text-blue-300 underline"
      >
        Go back to dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
