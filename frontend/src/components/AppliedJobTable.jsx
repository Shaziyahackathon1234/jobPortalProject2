import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, FileText, ChevronRight } from 'lucide-react';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const navigate = useNavigate();

    if (!allAppliedJobs || allAppliedJobs.length <= 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm mt-5">
                <p className="text-gray-500 italic">No applications found.</p>
            </div>
        );
    }

    return (
        <div className="mt-5 w-full">
            {/* Desktop Table View - Entire Row is Clickable */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table className="w-full table-fixed">
                    <TableHeader className="bg-white border-b border-gray-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[50%] px-6 py-4 text-left text-xs font-bold text-gray-700">Job Role</TableHead>
                            <TableHead className="w-[25%] px-6 py-4 text-center text-xs font-bold text-gray-700">Resume</TableHead>
                            <TableHead className="w-[25%] px-6 py-4 text-right text-xs font-bold text-gray-700">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allAppliedJobs.map((appliedJob) => (
                            <TableRow 
                                key={appliedJob._id} 
                                onClick={() => navigate(`/description/${appliedJob.job?._id}`)}
                                className="hover:bg-gray-50/80 border-b border-gray-50 last:border-0 transition-colors cursor-pointer group"
                            >
                                <TableCell className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 text-base leading-tight truncate group-hover:text-blue-600 transition-colors">
                                            {appliedJob.job?.title}
                                        </span>
                                        <span className="text-[12px] text-gray-400 mt-0.5 truncate">
                                            {appliedJob.job?.company?.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-5 text-center text-[13px] text-gray-300 font-medium">
                                    {appliedJob?.applicant?.profile?.resume ? (
                                        <span className="text-blue-500 hover:underline">View</span>
                                    ) : "NA"}
                                </TableCell>
                                <TableCell className="px-6 py-5 text-right">
                                    <Badge className={`text-[11px] font-bold px-3 py-1 rounded-full border-none capitalize ${appliedJob?.status === "rejected" ? 'bg-red-500 hover:bg-red-500' : appliedJob.status === 'pending' ? 'bg-gray-400 hover:bg-gray-400' : 'bg-green-500 hover:bg-green-500'} text-white`}>
                                        {appliedJob.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View - Matching image_0ee72d.png Layout */}
            <div className="flex flex-col gap-4 md:hidden">
                {allAppliedJobs.map((appliedJob) => (
                    <div 
                        key={appliedJob._id} 
                        onClick={() => navigate(`/description/${appliedJob.job?._id}`)}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-bold text-gray-800 text-lg leading-tight">
                                        {appliedJob.job?.title}
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-blue-600 mt-1">
                                        <Building2 size={14} />
                                        <span className="text-sm font-medium">{appliedJob.job?.company?.name}</span>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300" size={20} />
                            </div>

                            <div className="flex flex-col gap-2 text-gray-500">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span>Applied: {appliedJob.createdAt?.split('T')[0] || "2026-04-04"}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                                <div className="text-sm">
                                    {appliedJob?.applicant?.profile?.resume ? (
                                        <span className="text-blue-500 font-semibold flex items-center gap-1.5">
                                            <FileText size={14} />
                                            Resume Attached
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 italic text-xs font-medium">No Resume</span>
                                    )}
                                </div>
                                <Badge className={`text-[11px] font-bold px-4 py-1 rounded-full border-none capitalize ${appliedJob?.status === "rejected" ? 'bg-red-500 text-white' : appliedJob.status === 'pending' ? 'bg-gray-400 text-white' : 'bg-green-500 text-white'}`}>
                                    {appliedJob.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppliedJobTable;