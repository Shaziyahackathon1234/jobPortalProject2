import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Mail,
  Pen,
  Info,
  Briefcase,
  Building2,
  Users,
  PlusCircle,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const RecruiterProfile = () => {
  // Load the recruiter's own jobs and companies for the stats below.
  useGetAllAdminJobs();
  useGetAllCompanies();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { allAdminJobs } = useSelector((store) => store.job);
  const { companies } = useSelector((store) => store.company);

  const jobs = allAdminJobs || [];
  const companyList = companies || [];
  const openPositions = jobs.reduce(
    (sum, job) => sum + (Number(job?.position) || 0),
    0,
  );

  const profilePhoto =
    user?.profile?.profilePhoto ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname || "default"}`;

  const stats = [
    { label: "Jobs Posted", value: jobs.length, icon: Briefcase, color: "text-purple-600 bg-purple-100" },
    { label: "Companies", value: companyList.length, icon: Building2, color: "text-blue-600 bg-blue-100" },
    { label: "Open Positions", value: openPositions, icon: Users, color: "text-emerald-600 bg-emerald-100" },
  ];

  const actions = [
    { label: "Post a New Job", icon: PlusCircle, onClick: () => navigate("/admin/jobs/create") },
    { label: "Manage Jobs", icon: LayoutGrid, onClick: () => navigate("/admin/jobs") },
    { label: "Manage Companies", icon: Building2, onClick: () => navigate("/admin/companies") },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* --- HEADER BANNER --- */}
        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-[#6A38C2] to-[#9b6df0]" />
          <div className="px-6 pb-6 -mt-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md bg-gray-100">
                <AvatarImage src={profilePhoto} alt="profile" />
              </Avatar>
              <div className="flex-1 pt-2 sm:pt-0 sm:pb-2">
                <div className="flex items-center gap-3 flex-wrap mt-3">
                  <h1 className="font-bold text-2xl text-gray-800">{user?.fullname}</h1>
                  <Badge className="bg-purple-100 text-purple-700 border-none px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    {user?.role || "recruiter"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Mail size={14} /> <span>{user?.email}</span>
                </div>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Pen size={16} /> Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* --- STATS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 leading-none">{stat.value}</p>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- LEFT: BIO + CONTACT --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <Label className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-3">
                <Info size={14} /> About
              </Label>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {user?.profile?.bio || "Tell candidates about your company and what you hire for..."}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <Label className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4 block">
                Quick Actions
              </Label>
              <div className="space-y-3">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="w-full flex items-center justify-between gap-3 bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-xl px-4 py-3 transition-colors group"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <action.icon size={18} className="text-purple-600" />
                      {action.label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-gray-300 group-hover:text-purple-600 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT: RECENT JOBS --- */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Label className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                <Briefcase size={14} /> Recently Posted Jobs
              </Label>
              {jobs.length > 0 && (
                <button
                  onClick={() => navigate("/admin/jobs")}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800"
                >
                  View all
                </button>
              )}
            </div>

            {jobs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {jobs.slice(0, 5).map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between py-3 gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{job?.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                        <Building2 size={12} /> {job?.company?.name || "—"}
                        {job?.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="shrink-0 text-xs font-semibold text-purple-600 border border-purple-200 hover:bg-purple-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Applicants
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                <Button
                  onClick={() => navigate("/admin/jobs/create")}
                  className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl font-bold"
                >
                  <PlusCircle size={16} className="mr-2" /> Post your first job
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default RecruiterProfile;
