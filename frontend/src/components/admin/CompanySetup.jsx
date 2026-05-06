import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setCompanies } from "@/redux/companySlice";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useGetCompanyById(params.id);
    const { singleCompany } = useSelector((store) => store.company);
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null,
    });

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null,
            });
        }
    }, [singleCompany]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) formData.append("file", input.file);

        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                const updated = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
                dispatch(setCompanies(updated.data.companies));
                navigate("/admin/companies");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto my-10 px-4">
                <form onSubmit={submitHandler} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-10">
                        <Button
                            type="button"
                            onClick={() => navigate("/admin/companies")}
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold"
                        >
                            <ArrowLeft size={18} />
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                        <h1 className="font-bold text-xl md:text-2xl text-gray-800">Company Setup</h1>
                    </div>

                    {/* Grid: 1 column on mobile, 2 columns on medium screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input type="text" name="name" value={input.name} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input type="text" name="website" value={input.website} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Logo</Label>
                            <Input type="file" accept="image/*" onChange={changeFileHandler} className="cursor-pointer" />
                        </div>
                    </div>

                    {loading ? (
                        <Button disabled className="w-full mt-8 bg-[#6A38C2]">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full mt-8 bg-[#6A38C2] hover:bg-[#5b30a6]">Update</Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CompanySetup;