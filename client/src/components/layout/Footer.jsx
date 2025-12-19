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
                alt="Unilancer"
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
              The ultimate platform for university students to find and offer freelance services.
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Product</h4>
            <div className="space-y-2 text-sm">
              <Link to="/jobs" className="text-gray-400 hover:text-accent">Jobs</Link>
              <Link to="/gigs" className="text-gray-400 hover:text-accent">Gigs</Link>
              <Link to="/events" className="text-gray-400 hover:text-accent">Events</Link>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Company</h4>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="text-gray-400 hover:text-accent">About</Link>
              <Link to="/blog" className="text-gray-400 hover:text-accent">Blog</Link>
              <Link to="/contact" className="text-gray-400 hover:text-accent">Contact</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-accent">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-accent">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-dark/30 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Unilancer. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent">Twitter</a>
              <a href="#" className="hover:text-accent">LinkedIn</a>
              <a href="#" className="hover:text-accent">GitHub</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
