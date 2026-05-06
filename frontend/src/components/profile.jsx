import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, FileText, Briefcase, Info, Upload } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant.js";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);

    const isResume = Boolean(user?.profile?.resume);
    const profilePhoto = user?.profile?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname || "default"}`;

    const getCleanFileName = (name) => {
        if (!name) return "No Resume Uploaded";
        let clean = name.replace(/\.[^/.]+$/, "");
        clean = clean.replace(/\s\d{1,2}\.\d{2}\.\d{2}.*/, "");

        return clean;
    };

    const handleResumeUpdate = async (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { "Content-Type": "multipart/form-data", },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Resume updated successfully");
            }
        } catch (error) {
            toast.error(error)
            console.log(error);
        }
    };

    const handleDeleteResume = async () => {
        try {
            const res = await axios.delete(`${USER_API_END_POINT}/profile/resume`, {
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Resume deleted successfully");
            }
        } catch (error) {
            toast.error(error)
            console.log(error);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-28 w-28 border-4 border-purple-600 shadow-md mb-4 bg-gray-100">
                                <AvatarImage src={profilePhoto} alt="profile" />
                            </Avatar>
                            <h1 className="font-bold text-2xl text-gray-800 leading-tight">
                                {user?.fullname}
                            </h1>
                            <Badge className="mt-2 bg-purple-100 text-purple-700 border-none px-4 py-1 text-[11px] font-bold uppercase tracking-wider">
                                {user?.role}
                            </Badge>

                            <div className="w-full border-t border-gray-100 my-6"></div>

                            <Button
                                onClick={() => setOpen(true)}
                                className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white py-6 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Pen size={16} /> Edit Profile
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <Label className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-3">
                                <Info size={14} /> Professional Bio
                            </Label>
                            <p className="text-gray-700 text-sm leading-relaxed font-medium">
                                {user?.profile?.bio || "Describe your professional background here..."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <Label className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4 block">
                                    Contact Details
                                </Label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <span className="text-sm font-semibold truncate">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <Label className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4">
                                    <Briefcase size={14} /> Skills & Tools
                                </Label>
                                <div className="text-sm text-gray-700 leading-relaxed">
                                    {user?.profile?.skills ? (
                                        <p>{user.profile.skills}</p>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">
                                            No skills listed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <Label className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4 block">
                                Attached Documents
                            </Label>
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FileText className="text-purple-600" size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800 truncate">
                                            {getCleanFileName(user?.profile?.resumeOriginalName) || "Resume.pdf"}
                                        </span>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">
                                            Official Document
                                        </span>
                                    </div>
                                </div>

                                {isResume ? (
                                    <div className="flex items-center gap-2">

                                        <a
                                            href={user?.profile?.resume?.replace(
                                                "/upload/",
                                                "/upload/f_auto,q_auto/"
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white border-2 border-gray-600 px-4 py-2 rounded-lg text-gray-800 text-xs font-bold hover:bg-gray-50"
                                        >
                                            View
                                        </a>

                                        {/* EDIT */}
                                        <input
                                            type="file"
                                            id="resumeUpload"
                                            className="hidden"
                                            onChange={handleResumeUpdate}
                                        />

                                        <label
                                            htmlFor="resumeUpload"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-600"
                                        >
                                            Edit
                                        </label>

                                        {/* DELETE */}
                                        <button
                                            onClick={handleDeleteResume}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                ) : (
                                    <div>

                                        {/* UPLOAD BUTTON WHEN NO RESUME */}
                                        <input
                                            type="file"
                                            id="resumeUploadNew"
                                            className="hidden"
                                            onChange={handleResumeUpdate}
                                        />

                                        <label
                                            htmlFor="resumeUploadNew"
                                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-green-600"
                                        >
                                            <Upload size={16} />
                                            Upload Resume
                                        </label>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
