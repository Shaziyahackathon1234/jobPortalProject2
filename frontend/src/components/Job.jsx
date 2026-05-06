import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return 0;
    const currentTime = new Date();
    const createdAt = new Date(mongodbTime);
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const handleApplyClick = () => {
    if (!user) {
      // Prompt to login/signup if they try to interact
      alert("Please login or signup to view details and apply!");
      navigate("/login");
    } else {
      navigate(`/description/${job?._id}`);
    }
  };

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage
              src={job?.company?.logo || "https://toppng.com/uploads/preview/free-logo-design-11551057495oqoep79juj.png"}
            />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={handleApplyClick}
          variant="outline"
        >
          Details
        </Button>
        <Button className="bg-[#7209b7]" onClick={handleApplyClick}>
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default Job;