import { Link } from "react-router-dom";
import FeaturedEvents from "../../pages/events/FeaturedEvent";
import { Sparkles, ArrowRight, Code, Briefcase, Calendar, ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-slate-950 text-slate-100 selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] -z-10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        
        {/* LEFT: Text & CTAs */}
        <div className="flex flex-col gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Campus Freelance Marketplace
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400">
              The Ultimate Platform for Student Freelancers
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
              Connect with real opportunities, monetize your skills, and build a powerful portfolio—all while studying on campus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
            <Link to="/register">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 group">
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/jobs">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900/50 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 backdrop-blur-sm">
                Hire Developers
              </button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold pt-4">
            <Link to="/gigs" className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors group">
              <Briefcase className="w-4 h-4" /> Browse Gigs <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <Link to="/jobs" className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors group">
              <Code className="w-4 h-4" /> Find Jobs <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <Link to="/events" className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors group">
              <Calendar className="w-4 h-4" /> Campus Events <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/60 mt-4">
            <div>
              <p className="text-3xl font-black text-white tracking-tight">10K+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white tracking-tight">5K+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Jobs Posted</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white tracking-tight">2K+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Gigs Offered</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Floating Feature Card */}
        <div className="relative lg:pl-10 lg:h-full flex items-center justify-center">
          <div className="relative w-full max-w-md group perspective-1000">
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-[50px] group-hover:bg-indigo-500/30 transition-colors duration-500" />
            
            <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-2xl p-8 rounded-3xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-500/10">
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" /> Live Campus Gigs
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    Real-time opportunities near you
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <GigItemCard title="Landing Page Design" subtitle="CSE Society • 3 days left" price="₹2,500" highlight />
                <GigItemCard title="Promo Video Editing" subtitle="Media Club • 2 applicants" price="₹1,200" />
                <GigItemCard title="MERN Stack Mentoring" subtitle="Alumni • 1:1 sessions" price="₹499/hr" />
              </div>

              {/* Fading bottom edge for a sleek look */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />

              <div className="relative z-20 mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800 z-30" />
                     <div className="w-6 h-6 rounded-full bg-slate-600 border border-slate-800 z-20" />
                     <div className="w-6 h-6 rounded-full bg-indigo-500 border border-slate-800 z-10 flex items-center justify-center text-[8px] font-bold text-white">+30</div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">freelancers online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="relative z-20 bg-slate-950/50 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <FeaturedEvents />
        </div>
      </div>
    </section>
  );
};

// Helper component for gig items
const GigItemCard = ({ title, subtitle, price, highlight }) => (
  <div className={`flex items-center justify-between rounded-xl px-5 py-4 transition-all duration-300 ${highlight ? 'bg-indigo-500/10 border-indigo-500/30 border shadow-lg' : 'bg-slate-800/50 border-slate-700/50 border hover:bg-slate-800 hover:border-slate-600'}`}>
    <div className="flex-1 min-w-0 pr-4">
      <p className={`text-sm font-bold truncate ${highlight ? 'text-indigo-100' : 'text-slate-200'}`}>
        {title}
      </p>
      <p className={`text-[11px] font-medium truncate mt-1 ${highlight ? 'text-indigo-300/80' : 'text-slate-400'}`}>
        {subtitle}
      </p>
    </div>
    <span className={`text-sm font-black whitespace-nowrap ${highlight ? 'text-emerald-400' : 'text-emerald-500'}`}>
      {price}
    </span>
  </div>
);

export default HeroSection;
