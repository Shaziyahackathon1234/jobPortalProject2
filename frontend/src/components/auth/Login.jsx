import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar.jsx";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, user } = useSelector((store) => store.auth);

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                console.log(res.data.user);
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
            console.log(error)
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user){
            navigate("/");
        } 
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
                <form
                    onSubmit={submitHandler}
                    className="w-full md:w-1/2 lg:w-1/3 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 my-10 shadow-sm"
                >
                    <h1 className="font-bold text-2xl mb-5 text-gray-800">Login</h1>

                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2">Email</Label>
                            <Input type="email" value={input.email} onChange={changeEventHandler} name="email" placeholder="example@gmail.com" />
                        </div>
                        <div>
                            <Label className="mb-2">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    name="password"
                                    placeholder="password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-[#6A38C2] transition-colors"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        <RadioGroup className="flex items-center gap-6 py-2">
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="jobseeker" checked={input.role === "jobseeker"} onChange={changeEventHandler} className="cursor-pointer w-4 h-4" />
                                <Label className="cursor-pointer">Jobseeker</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="recruiter" checked={input.role === "recruiter"} onChange={changeEventHandler} className="cursor-pointer w-4 h-4" />
                                <Label className="cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {loading ? (
                        <Button disabled className="w-full mt-6">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full mt-6 bg-[#6A38C2] hover:bg-[#5b30a6]">Login</Button>
                    )}

                    <p className="text-sm text-center mt-4">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-medium">Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;