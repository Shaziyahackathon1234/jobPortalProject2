import React, { useEffect, useState } from "react";
import Navbar from "./shared/navbar";
import Job from "./Job";
import { useSelector, useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filtered = allJobs.filter((job) => {
        const query = searchedQuery.toLowerCase();
        return (
          job?.title?.toLowerCase().includes(query) ||
          job?.description?.toLowerCase().includes(query) ||
          job?.location?.toLowerCase().includes(query)
        );
      });
      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="font-bold text-xl my-10">
          Search Results ({filterJobs.length})
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterJobs.length <= 0 ? (
            <span className="text-gray-500 font-bold">No Jobs Found</span>
          ) : (
            filterJobs.map((job) => <Job key={job._id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;