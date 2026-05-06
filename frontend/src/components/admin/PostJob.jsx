import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../shared/navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PostJob = () => {
    const navigate = useNavigate();
    const { id: jobId } = useParams();

    const { companies = [] } = useSelector((store) => store.company);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSingleJob = async () => {
            if (!jobId) return;

            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        // Array to String for the input field
                        requirements: Array.isArray(job.requirements) ? job.requirements.join(",") : job.requirements || "",
                        salary: job.salary || "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experience: job.experienceLevel || "",
                        position: job.position || "",
                        companyId: job.company?._id || job.company || "",
                    });
                }
            } catch (error) {
                toast.error("Could not load job data");
            }
        };
        fetchSingleJob();
    }, [jobId]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, companyId: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) return toast.error("Please select a company");

        try {
            setLoading(true);
            const url = jobId
                ? `${JOB_API_END_POINT}/update/${jobId}`
                : `${JOB_API_END_POINT}/post`;

            const method = jobId ? "put" : "post";

            const res = await axios[method](url, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center w-screen my-5">
                <form
                    onSubmit={submitHandler}
                    className="p-8 max-w-4xl w-full border border-gray-200 shadow-lg rounded-md"
                >
                    <h1 className="font-bold text-xl mb-5">
                        {jobId ? "Edit Job" : "Post New Job"}
                    </h1>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Title</Label>
                            <Input name="title" value={input.title} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input name="description" value={input.description} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Requirements (Comma separated)</Label>
                            <Input name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="React, Node, etc." />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input name="location" value={input.location} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input name="jobType" value={input.jobType} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Experience Level (Years)</Label>
                            <Input name="experience" value={input.experience} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} />
                        </div>

                        {companies.length > 0 && (
                            <div className="col-span-2">
                                <Label>Select Company</Label>
                                <Select onValueChange={selectChangeHandler} value={input.companyId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                            </>
                        ) : (
                            jobId ? "Update Job" : "Post Job"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;