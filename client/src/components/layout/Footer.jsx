// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import metaLOGO from "../../assets/metaLOGO.svg"; // ✅ FIXED PATH

const Footer = () => {
  return (
    <footer className="bg-dark text-light border-t border-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={metaLOGO}
                alt="Unilancer Logo"
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  Unilancer
                </h3>
                <p className="text-xs text-gray-400">
                  Campus Freelance Hub
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              The ultimate platform for university students to find and offer freelance services. Hire student developers, designers, and content creators.
            </p>
          </div>

          {/* Explore - SEO-descriptive links */}
          <nav aria-label="Explore" className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Explore</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/gigs" className="text-gray-400 hover:text-accent transition-colors">Browse Freelance Gigs</Link>
              <Link to="/jobs" className="text-gray-400 hover:text-accent transition-colors">Find Student Developer Jobs</Link>
              <Link to="/events" className="text-gray-400 hover:text-accent transition-colors">Campus Events & Workshops</Link>
            </div>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Company</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/about" className="text-gray-400 hover:text-accent transition-colors">About Unilancer</Link>
              <Link to="/blog" className="text-gray-400 hover:text-accent transition-colors">Blog</Link>
              <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors">Contact Us</Link>
            </div>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal" className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Legal</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-accent transition-colors">Terms of Service</Link>
            </div>
          </nav>

        </div>

        {/* Bottom */}
        <div className="border-t border-dark/30 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Unilancer. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" aria-label="Unilancer on Twitter" className="hover:text-accent transition-colors">Twitter</a>
              <a href="#" aria-label="Unilancer on LinkedIn" className="hover:text-accent transition-colors">LinkedIn</a>
              <a href="#" aria-label="Unilancer on GitHub" className="hover:text-accent transition-colors">GitHub</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
