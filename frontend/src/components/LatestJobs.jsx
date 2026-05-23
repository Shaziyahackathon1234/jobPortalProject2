import React, { useEffect, useState } from "react";
import LatestJobCards from "./LatestJobCards.jsx";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  const [api, setApi] = useState(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className="max-w-7xl mx-auto my-20 px-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
          </h1>
          {allJobs.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-semibold text-gray-700">{allJobs.length}</span> jobs available
            </p>
          )}
        </div>

        {allJobs.length > 0 && (
          <Button
            onClick={() => navigate("/jobs")}
            className="bg-white text-[#6A38C2] border border-purple-200 hover:bg-purple-50 font-bold rounded-xl px-5 py-5 shadow-sm inline-flex items-center gap-2 self-start md:self-auto"
          >
            View all jobs <ArrowRight size={16} />
          </Button>
        )}
      </div>

      {allJobs.length === 0 ? (
        <div className="text-center py-10 my-8">
          <span className="text-gray-500 font-medium italic text-lg">
            No Jobs Available at the moment.
          </span>
        </div>
      ) : (
        <div className="relative my-8">
          <Carousel
            opts={{ align: "start", loop: false }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {allJobs.map((job, index) => (
                <CarouselItem
                  key={job._id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                    className="h-full"
                  >
                    <LatestJobCards job={job} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Floating chevron arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg text-gray-600 hover:bg-[#6A38C2] hover:text-white hover:border-[#6A38C2] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg text-gray-600 hover:bg-[#6A38C2] hover:text-white hover:border-[#6A38C2] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 sm:hidden mt-2 italic">
        Swipe to see more jobs
      </p>
    </div>
  );
};

export default LatestJobs;
