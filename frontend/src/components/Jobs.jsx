import React, { useEffect, useState } from "react";
import Navbar from "./shared/navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        const query = searchedQuery.toLowerCase();
        return (
          job?.title?.toLowerCase().includes(query) ||
          job?.description?.toLowerCase().includes(query) ||
          job?.location?.toLowerCase().includes(query) ||
          String(job?.salary).toLowerCase().includes(query) ||
          job?.jobType?.toLowerCase().includes(query.split(" ")[0]) ||
          job?.requirements?.some(req => req.toLowerCase().includes(query))
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Adjusts width based on screen size */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <FilterCard />
          </div>

          {/* Job List Container */}
          <div className="flex-1 h-screen overflow-y-auto pb-20 no-scrollbar">
            {filterJobs.length <= 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-xl font-semibold italic">No jobs found matching your criteria.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 pr-2">
                <AnimatePresence>
                  {filterJobs.map((job) => (
                    <motion.div
                      key={job?._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;