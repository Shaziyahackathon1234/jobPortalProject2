import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate } from "react-router-dom";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "Fullstack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Cyber Security",
  "Cloud Engineer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    // Standardizing the query for consistent filtering
    const cleanQuery = query.toLowerCase().split(" ")[0];
    dispatch(setSearchedQuery(cleanQuery));
    navigate("/browse");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-xl mx-auto my-12"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((cat, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/3"
            >
              <div className="p-1">
                <Button 
                  onClick={() => searchJobHandler(cat)} 
                  variant="outline" 
                  className="w-full rounded-full border-gray-200 hover:border-[#6A38C2] hover:text-[#6A38C2] hover:bg-purple-50 transition-all duration-300 shadow-sm font-medium py-6"
                >
                  {cat}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation - Hidden on very small screens for better UX */}
        <div className="hidden sm:block">
            <CarouselPrevious className="hover:bg-[#6A38C2] hover:text-white transition-colors" />
            <CarouselNext className="hover:bg-[#6A38C2] hover:text-white transition-colors" />
        </div>
      </Carousel>
      
      {/* Mobile Indicator (Optional) */}
      <p className="text-center text-xs text-gray-400 md:hidden -mt-8 mb-10 italic">
        Swipe to see more categories
      </p>
    </div>
  );
};

export default CategoryCarousel;