import React, { useEffect, useState } from "react";
import Navbar from "./shared/navbar.jsx";
import HeroSection from "./HeroSection.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";
import LatestJobs from "./LatestJobs.jsx";
import Footer from "./Footer.jsx";
import useGetAllJobs from "@/hooks/useGetAllJobs.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // 1. Redirect recruiters to admin panel
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }

    // 2. Show popup for guests (not logged in)
    if (!user) {
      const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowPopup(true);
          sessionStorage.setItem("hasSeenPopup", "true");
        }, 1500); // Small delay for better UX
        return () => clearTimeout(timer);
      }
    }
  }, [user, navigate]);

  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />

      {/* Welcome Popup for Guests */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#6A38C2] mb-4">Ready to level up?</h2>
            <p className="text-gray-600 mb-6">
              Sign up today to apply for the latest jobs and track your applications!
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate("/signup")} 
                className="bg-[#7209b7] text-white py-3 rounded-xl font-bold hover:bg-[#5f0799] transition-all"
              >
                Create Free Account
              </button>
              <button 
                onClick={() => setShowPopup(false)} 
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                Browse as Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;