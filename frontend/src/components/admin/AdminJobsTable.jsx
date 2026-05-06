import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, MapPin, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";

const AdminJobsTable = ({ search }) => {
    const { allAdminJobs } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!Array.isArray(allAdminJobs)) {
            setFilterJobs([]);
            return;
        }

        const filteredJobs = allAdminJobs.filter((job) => {
            if (!search) return true;
            const searchLower = search.toLowerCase();
            return (
                job?.title?.toLowerCase().includes(searchLower) ||
                job?.company?.name?.toLowerCase().includes(searchLower)
            );
        });

        setFilterJobs(filteredJobs);
    }, [allAdminJobs, search]);

    return (
        <div className="flex flex-col gap-4 mt-5">
            {filterJobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl border border-dashed border-gray-300">
                    No jobs found matching your filter.
                </div>
            ) : (
                filterJobs.map((job) => (
                    <div 
                        key={job._id} 
                        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                {/* Company Logo / Icon */}
                                <Avatar className="h-12 w-12 border border-gray-50">
                                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                </Avatar>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                        {job?.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium flex items-center gap-1 mt-0.5">
                                        {job?.company?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Action Menu */}
                            <Popover>
                                <PopoverTrigger className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                    <MoreHorizontal className="text-gray-400" size={22} />
                                </PopoverTrigger>
                                <PopoverContent className="w-40 p-1" align="end">
                                    <div
                                        onClick={() => navigate(`/admin/jobs/${job._id}`)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-sm font-semibold text-gray-700"
                                    >
                                        <Edit2 size={16} className="text-blue-500" />
                                        <span>Edit Job</span>
                                    </div>
                                    <div
                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-sm font-semibold text-gray-700 mt-1"
                                    >
                                        <Eye size={16} className="text-green-500" />
                                        <span>View Applicants</span>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {job?.location || "Remote"}
                                </span>
                            </div>

                            {/* Applicant count badge */}
                            <div 
                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                                {job?.applications?.length || 0} Applicants
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminJobsTable;