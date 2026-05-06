import React from "react";
import LatestJobCards from "./LatestJobCards.jsx";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-20 px-4">
      <h1 className="text-3xl md:text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {allJobs.length === 0 ? (
          <div className="col-span-full text-center py-10">
             <span className="text-gray-500 font-medium italic text-lg">No Jobs Available at the moment.</span>
          </div>
        ) : (
          allJobs.slice(0, 6).map((job) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LatestJobCards job={job} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestJobs;