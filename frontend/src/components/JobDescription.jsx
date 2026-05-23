import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Calendar, MapPin, IndianRupee, Users, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "./shared/navbar";

const JobDescription = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);

    const [isApplied, setApplied] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [aiData, setAiData] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    const handleAiMatch = async () => {
        if (!user) return toast.error("Please login first");
        if (!user?.profile?.skills?.length) return toast.error("Please add skills to your profile!");

        setLoadingAI(true);
        try {
            // Using absolute URL for AI Match to ensure reliability across environments
            const res = await axios.post(`http://https://jobportalproject2.onrender.com/api/v1/ai/match`, {
                resumeSkills: user?.profile?.skills?.join(", "),
                jobDescription: singleJob?.description
            }, { withCredentials: true });

            if (res.data.success) {
                setAiData(res.data.data);
                toast.success("AI Analysis Complete!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log("Error",error)

        } finally {
            setLoadingAI(false);
        }
    };

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setApplied(true);
                const updatedJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user._id }] };
                dispatch(setSingleJob(updatedJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    if (user?._id) {
                        setApplied(res.data.job.applications.some(app => app.applicant === user._id));
                    } else {
                        setApplied(false);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setCheckingStatus(false);
            }
        };
        fetchJob();
    }, [jobId, user?._id, dispatch]);

    if (!singleJob) return <div className="h-screen flex items-center justify-center text-gray-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-10">
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="font-extrabold text-3xl text-gray-900 mb-2">{singleJob.title}</h1>
                            <div className="flex gap-2">
                                <Badge className="text-blue-600 bg-blue-50 border-none font-bold" variant="outline">{singleJob.position} Positions</Badge>
                                <Badge className="text-[#F83002] bg-red-50 border-none font-bold" variant="outline">{singleJob.jobType}</Badge>
                                <Badge className="text-[#7209b7] bg-purple-50 border-none font-bold" variant="outline">{singleJob.salary} LPA</Badge>
                            </div>
                        </div>
                        {!user ? (
                            <Button
                                onClick={() => navigate("/login")}
                                className="px-8 py-6 rounded-xl font-bold transition-all shadow-md bg-[#7209b7] hover:bg-[#5f079e]"
                            >
                                Login to Apply
                            </Button>
                        ) : (
                            <Button
                                disabled={isApplied || checkingStatus}
                                onClick={applyJobHandler}
                                className={`px-8 py-6 rounded-xl font-bold transition-all shadow-md ${isApplied ? "bg-gray-400 cursor-not-allowed" : "bg-[#7209b7] hover:bg-[#5f079e]"}`}
                            >
                                {isApplied ? "Applied" : "Apply Now"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* AI Smart Match Display */}
                <div className="bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-purple-600" size={20} />
                        <h2 className="font-bold text-gray-800">AI Smart Match</h2>
                    </div>

                    {!aiData ? (
                        <div className="flex flex-col items-start gap-3">
                            <p className="text-gray-600 text-sm">
                                {user
                                    ? "Compare your profile skills against this job description."
                                    : "Login to compare your profile skills against this job description."}
                            </p>
                            <Button onClick={handleAiMatch} disabled={loadingAI || !user} className="bg-white text-purple-700 border border-purple-200 hover:bg-purple-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                                {loadingAI ? <Loader2 className="animate-spin mr-2" size={16}/> : "Calculate Match Score"}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white flex flex-col items-center justify-center p-4 rounded-xl border border-purple-200">
                                <span className="text-4xl font-black text-purple-700">{aiData.score}%</span>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Match Score</span>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <AlertCircle size={12}/> Feedback
                                    </p>
                                    <p className="text-sm font-medium text-gray-700 italic">"{aiData.feedback}"</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {aiData.missingSkills?.map((skill, i) => (
                                        <Badge key={i} className="bg-white text-gray-500 border-gray-200 font-medium">+ {skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailItem icon={<MapPin size={18}/>} label="Location" value={singleJob.location} />
                            <DetailItem icon={<IndianRupee size={18}/>} label="Salary" value={`${singleJob.salary} LPA`} />
                            <DetailItem icon={<Users size={18}/>} label="Applicants" value={singleJob.applications?.length || 0} />
                            <DetailItem icon={<Calendar size={18}/>} label="Posted" value={new Date(singleJob.createdAt).toLocaleDateString()} />
                        </div>
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Job Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{singleJob.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 border border-gray-100">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-gray-800 font-bold">{value}</p>
        </div>
    </div>
);

export default JobDescription;