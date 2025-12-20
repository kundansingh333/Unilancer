// src/components/layout/HeroSection.jsx
import { Link } from "react-router-dom";
import FeaturedEvents from "../../pages/events/FeaturedEvent";
import Button from "../Button";
import Badge from "../Badge";

const HeroSection = () => {
  return (
    <section className="bg-slate-950 text-slate-50 selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-slate-950 to-purple-500/10 blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT: Text */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
              ✨ Campus Freelance Marketplace
            </span>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-slate-50">
              The Ultimate Platform for Student Freelancers
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              Connect with opportunities, offer your skills, and build your career—all while earning money as a student.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                Get Started
              </button>
            </Link>
            <Link to="/jobs">
              <button className="bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 font-medium px-5 py-2.5 rounded-lg transition-all">
                Browse Jobs
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-50">10K+</p>
              <p className="text-sm text-slate-400 mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-50">5K+</p>
              <p className="text-sm text-slate-400 mt-1">Jobs Posted</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-50">2K+</p>
              <p className="text-sm text-slate-400 mt-1">Gigs Offered</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Feature Card */}
        <div className="md:pl-4">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl p-8 rounded-2xl group-hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    Live Campus Gigs
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Real-time opportunities
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs text-emerald-400 font-medium">Active</p>
                </div>
              </div>

              <div className="space-y-3">
                <GigItemCard
                  title="Landing Page Design"
                  subtitle="Posted by CSE Society • 3 days left"
                  price="₹2,500"
                />
                <GigItemCard
                  title="Event Promo Video Editing"
                  subtitle="Media Club • 2 applicants"
                  price="₹1,200"
                />
                <GigItemCard
                  title="MERN Portfolio Mentoring"
                  subtitle="Alumni • 1:1 sessions"
                  price="₹499/session"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-slate-400">
                    30+ verified freelancers online
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FeaturedEvents />
      </div>
    </section>
  );
};

// Helper component for gig items
const GigItemCard = ({ title, subtitle, price }) => (
  <div className="flex items-center justify-between rounded-lg bg-slate-800/40 border border-slate-700 px-4 py-3 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all">
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-100">
        {title}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {subtitle}
      </p>
    </div>
    <span className="text-sm font-bold text-emerald-400 ml-4 whitespace-nowrap">
      {price}
    </span>
  </div>
);

export default HeroSection;
