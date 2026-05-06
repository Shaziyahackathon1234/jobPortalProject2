import React from "react";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand and Copyright */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Job<span className="text-[#F83002]">Portal</span>
              </h2>
            </Link>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              &copy; {currentYear} Job Portal Inc. All rights reserved.
            </p>
          </div>

          {/* Navigation Links (Added for a professional feel) */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-600">
            <Link to="/jobs" className="hover:text-[#6A38C2] transition-colors">Jobs</Link>
            <Link to="/browse" className="hover:text-[#6A38C2] transition-colors">Browse</Link>
            <Link to="/profile" className="hover:text-[#6A38C2] transition-colors">Privacy Policy</Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1877F2] transition-all transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1DA1F2] transition-all transform hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0A66C2] transition-all transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black transition-all transform hover:scale-110"
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
          </div>
        </div>

        {/* Bottom decorative bar */}
        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Built with MERN Stack & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;