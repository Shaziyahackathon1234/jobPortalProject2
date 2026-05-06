import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice.js";

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);

    const registerNewCompany = async () => {
        if (!user) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }
        try {
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,{ companyName },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                navigate(`/admin/companies/${res.data.company._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 md:px-0">
                <div className="my-10">
                    <h1 className="font-bold text-2xl text-gray-800">
                        Your Company Name
                    </h1>
                    <p className="text-gray-500">
                        What would you like to name your company? You can change this later.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <Label className="font-semibold">Company Name</Label>
                    <Input
                        type="text"
                        className="my-2"
                        placeholder="e.g. Microsoft, Google"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />

                    <div className="flex items-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            className="flex-1 md:flex-none"
                            onClick={() => navigate("/admin/companies")}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 md:flex-none bg-[#6A38C2] hover:bg-[#5b30a6]"
                            onClick={registerNewCompany}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
