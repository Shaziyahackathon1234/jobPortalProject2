import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, MapPin, Calendar, Building2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = ({ search }) => {
  const { companies } = useSelector((store) => store.company);
  const navigate = useNavigate();

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  const fallbackLogo = "https://toppng.com/uploads/preview/free-logo-design-11551057495oqoep79juj.png";

  return (
    <div className="mt-5">
      {/* --- MOBILE VIEW: STACKED CARDS (Hides on md screens and up) --- */}
      <div className="flex flex-col gap-4 md:hidden">
        {filteredCompanies?.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
            No companies found.
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div key={company._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-3">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={company.logo || fallbackLogo} />
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-gray-800">{company.name}</h2>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{company.location || "Location not set"}</span>
                  </div>
                </div>
                
                {/* Mobile Action Popover */}
                <Popover>
                  <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="text-gray-600" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2">
                    <div
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-all"
                    >
                      <Edit2 className="w-4 text-blue-600" />
                      <span className="text-sm font-medium">Edit</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-50">
                <Calendar size={12} />
                <span>Registered: {company.createdAt?.split("T")[0]}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- DESKTOP VIEW: STANDARD TABLE (Hidden on mobile) --- */}
      <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableCaption>A list of your recent registered companies</TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500 italic">
                  No companies found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={company.logo || fallbackLogo} />
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-semibold">{company.name}</TableCell>
                  <TableCell>
                    {company.location ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 text-gray-500" />
                        <span>{company.location}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>{company.createdAt?.split("T")[0]}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger className="cursor-pointer p-2 hover:bg-gray-100 rounded-full inline-block">
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        <div
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-all"
                        >
                          <Edit2 className="w-4" />
                          <span>Edit</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniesTable;