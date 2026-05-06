import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const Companies = () => {
  useGetAllCompanies(); 
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); 

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4">
        {/* Responsive Header: Stacks on mobile, side-by-side on md+ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-5">
          <Input
            className="w-full md:w-fit bg-white"
            placeholder="Filter by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button 
            className="w-full md:w-auto bg-[#6A38C2] hover:bg-[#5b30a6]" 
            onClick={() => navigate("/admin/companies/create")}
          >
            New Company
          </Button>
        </div>
        <CompaniesTable search={search} />
      </div>
    </div>
  );
};

export default Companies;