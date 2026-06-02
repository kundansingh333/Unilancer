import { Link } from "react-router-dom";
import metaLOGO from "../../assets/metaLOGO.svg";
import { Twitter, Linkedin, Github, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-slate-800 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shadow-lg group-hover:border-indigo-500/50 transition-colors">
                <img src={metaLOGO} alt="Unilancer Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                  Unilancer
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Campus Freelance Hub
                </p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The ultimate platform for university students to find and offer freelance services. Hire student developers, designers, and content creators directly from your campus.
            </p>
            
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-sm">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all shadow-sm">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="flex flex-col gap-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-2">Explore</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link to="/gigs" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> Browse Gigs
              </Link>
              <Link to="/jobs" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> Find Jobs
              </Link>
              <Link to="/events" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> Campus Events
              </Link>
            </div>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="flex flex-col gap-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-2">Company</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link to="/about" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> About Us
              </Link>
              <Link to="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> Blog
              </Link>
              <Link to="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> Contact
              </Link>
            </div>
          </nav>

          {/* Legal & Contact */}
          <nav aria-label="Legal" className="flex flex-col gap-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-2">Legal</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" /> Terms of Service
              </Link>
            </div>
            
            <div className="mt-4 space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> support@unilancer.com</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Silicon Valley, CA</p>
            </div>
          </nav>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} Unilancer. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
             <span>Made for Students</span>
             <span>•</span>
             <span>Built by Alumni</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
