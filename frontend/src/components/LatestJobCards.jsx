import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapPin } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  // FIX: Only evaluate isApplied if user exists
  const isApplied = user && job?.applications?.some(
    (app) => (app.applicant === user?._id || app === user?._id)
  );

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="group p-6 rounded-xl shadow-sm bg-white border border-gray-100 cursor-pointer hover:shadow-xl hover:border-purple-100 transition-all duration-300 flex flex-col h-full relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-bold text-sm text-[#6A38C2] uppercase tracking-wider">{job?.company?.name}</h2>
          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <MapPin size={14} />
            <p className="text-xs font-medium">{job?.location || "India"}</p>
          </div>
        </div>
        {/* Only show badge if user is logged in and has applied */}
        {user && isApplied && (
          <Badge className="bg-green-50 text-green-600 border-green-200 px-3 py-1" variant="outline">
            Applied
          </Badge>
        )}
      </div>

      <div className="flex-1">
        <h1 className="font-bold text-xl text-gray-900 group-hover:text-[#6A38C2] transition-colors line-clamp-1">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
          {job?.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-6">
        <Badge className="text-blue-600 bg-blue-50 border-none px-2 py-1" variant="secondary">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] bg-red-50 border-none px-2 py-1" variant="secondary">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] bg-purple-50 border-none px-2 py-1" variant="secondary">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;