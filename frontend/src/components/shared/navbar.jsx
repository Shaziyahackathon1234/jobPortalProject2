import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"; // Added AvatarFallback
import { LogOut, User2, Menu, X, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { setUser } from "../../redux/authSlice";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const { singleJob } = useSelector((store) => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(null));
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    const handleApplicantsClick = () => {
        if (singleJob?._id) {
            navigate(`/admin/jobs/${singleJob._id}/applicants`);
        } else {
            toast.error("Please select a specific job from the list first.");
            navigate("/admin/jobs");
        }
    };

    const NavLinks = () => (
        <>
            {user && user.role === "recruiter" ? (
                <>
                    <li><Link to="/admin/companies" className="hover:text-[#6A38C2] transition-colors">Companies</Link></li>
                    <li><Link to="/admin/jobs" className="hover:text-[#6A38C2] transition-colors">Jobs</Link></li>
                    <li>
                        <button 
                            onClick={handleApplicantsClick} 
                            className="hover:text-[#6A38C2] transition-colors cursor-pointer bg-transparent border-none font-medium"
                        >
                            Applicants
                        </button>
                    </li>
                </>
            ) : (
                <>
                    <li><Link to="/" className="hover:text-[#6A38C2] transition-colors">Home</Link></li>
                    <li><Link to="/jobs" className="hover:text-[#6A38C2] transition-colors">Jobs</Link></li>
                    <li><Link to="/browse" className="hover:text-[#6A38C2] transition-colors">Browse</Link></li>
                    {user && user.role === "jobseeker" && (
                        <>
                            <li><Link to="/applied-jobs" className="hover:text-[#6A38C2] transition-colors">Applied</Link></li>
                            <li className="flex items-center gap-1 text-[#7209b7] font-bold animate-pulse">
                                <Sparkles size={16} />
                                <Link to="/jobs">AI Match</Link>
                            </li>
                        </>
                    )}
                </>
            )}
        </>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="shrink-0">
                        <h1 className="text-2xl font-extrabold tracking-tight italic">
                            Job<span className="text-[#F83002]">Portal</span>
                        </h1>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex font-medium items-center gap-6 text-gray-600">
                            <NavLinks />
                        </ul>

                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" className="font-semibold">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] rounded-full px-6 shadow-md shadow-purple-100 transition-all">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <UserPopover user={user} logoutHandler={logoutHandler} />
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        {user && <UserPopover user={user} logoutHandler={logoutHandler} />}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 shadow-lg">
                    <ul className="flex flex-col gap-4 p-5 font-medium text-gray-700">
                        <NavLinks />
                        {!user && (
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">Login</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full bg-[#6A38C2]">Signup</Button>
                                </Link>
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

const UserPopover = ({ user, logoutHandler }) => {
    const userInitial = user?.fullname?.charAt(0).toUpperCase() || "U";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-[#6A38C2] hover:border-purple-400 transition-all h-9 w-9">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold">
                        {userInitial}
                    </AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 mt-2 overflow-hidden rounded-xl shadow-xl border-gray-100">
                <div className="bg-gray-50/50 p-4 flex gap-3 items-center">
                    <Avatar className="h-10 w-10 shadow-sm border border-gray-200">
                        <AvatarImage src={user?.profile?.profilePhoto} />
                        <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{user?.fullname}</h4>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-purple-50 hover:text-[#6A38C2] transition-colors group">
                        <User2 size={18} className="text-gray-400 group-hover:text-[#6A38C2]" />
                        <span className="text-sm font-semibold">View Profile</span>
                    </Link>
                    <button onClick={logoutHandler} className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group mt-1">
                        <LogOut size={18} className="text-gray-400 group-hover:text-red-600" />
                        <span className="text-sm font-semibold">Logout</span>
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default Navbar;