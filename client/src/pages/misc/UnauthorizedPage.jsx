import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import SEO from "../../components/SEO";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 relative overflow-hidden">
      <SEO title="Unauthorized" path="/unauthorized" noIndex />
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full bg-slate-900/40 p-8 rounded-3xl border border-rose-500/10 backdrop-blur-sm shadow-2xl">
        
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
           <ShieldAlert className="w-10 h-10" />
        </div>
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 mb-2 tracking-tight">
          403
        </h1>
        
        <h2 className="text-xl font-bold text-white mb-3">Access Denied</h2>
        
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          You don't have the necessary permissions to access this page. If you believe this is an error, please contact an administrator.
        </p>
        
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600"
        >
          <ArrowLeft className="w-4 h-4" /> Go back to dashboard
        </Link>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
    </div>
  );
};

export default UnauthorizedPage;
