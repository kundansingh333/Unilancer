// src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import FeaturedEvents from "../../pages/events/FeaturedEvent";

const HeroSection = () => {
  return (
    <section className="bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT: Text */}
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Campus freelance marketplace
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
            Find{" "}
            <span className="text-blue-400">
              talented students &amp; alumni
            </span>{" "}
            for your next project.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mb-6 max-w-xl">
            Unilancer connects students, alumni, and faculty inside your college
            ecosystem. Hire for design, development, content, events, and more —
            or offer your own skills as a freelancer.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white shadow-md shadow-blue-900/40"
            >
              Start as freelancer
            </Link>
            <Link
              to="/gigs"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Browse gigs
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full bg-blue-600/80 border border-slate-950" />
              <div className="h-7 w-7 rounded-full bg-emerald-500/80 border border-slate-950" />
              <div className="h-7 w-7 rounded-full bg-amber-400/80 border border-slate-950" />
            </div>
            <p>
              Trusted by{" "}
              <span className="text-slate-200 font-medium">
                students from your campus
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT: Card / Illustration */}
        <div className="md:pl-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-500/40 via-purple-500/30 to-emerald-400/30 blur-2xl opacity-40" />
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-slate-300">
                  Live campus gigs
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  Real-time
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-slate-100">
                      Landing page design
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Posted by CSE Society • 3 days left
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    ₹2,500
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-slate-100">
                      Event promo video editing
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Media Club • 2 applicants
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    ₹1,200
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-slate-100">
                      MERN portfolio mentoring
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Alumni • 1:1 sessions
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    ₹499 / session
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <p>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1" />
                  30+ verified freelancers online now
                </p>
                <Link
                  to="/dashboard"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Open dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <FeaturedEvents />
      </div>
    </section>
  );
};

export default HeroSection;
