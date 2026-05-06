import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="text-center px-4"> {/* Added horizontal padding for mobile edges */}
            <div className="flex flex-col gap-5 my-10">
                <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
                    No. 1 Job Hunt Website
                </span>
                <h1 className="text-4xl md:text-5xl font-bold"> {/* Responsive font size */}
                    Search, Apply & Get Your{" "}
                    <span className="text-[#6A38C2]">Dream Jobs</span>
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto"> {/* Max-width for better text readability */}
                    Discover thousands of job opportunities and take the next step in your career.
                </p>

                {/* --- RESPONSIVE SEARCH BAR --- */}
                <div className="flex w-full md:w-[60%] lg:w-[40%] shadow-lg border border-gray-200 pl-4 rounded-full items-center gap-2 mx-auto bg-white overflow-hidden">
                    <Search className="h-5 w-5 text-gray-400 shrink-0" /> {/* Added icon inside for better UX */}
                    <input
                        type="text"
                        placeholder="Find your dream jobs"
                        onChange={(e) => setQuery(e.target.value)}
                        className="outline-none border-none w-full py-3 text-gray-700"
                    />
                    <Button
                        onClick={searchJobHandler}
                        className="rounded-r-full bg-[#6A38C2] hover:bg-[#5b30a6] h-full px-6 py-6"
                    >
                        <Search className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;