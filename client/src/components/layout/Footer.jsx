// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div>
            <p className="text-sm text-slate-200">
              Unilancer{" "}
              <span className="text-[11px] text-slate-500">
                • campus freelance hub
              </span>
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Unilancer. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <Link to="/about" className="hover:text-slate-200">
            About
          </Link>
          <Link to="/how-it-works" className="hover:text-slate-200">
            How it works
          </Link>
          <Link to="/terms" className="hover:text-slate-200">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-slate-200">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
