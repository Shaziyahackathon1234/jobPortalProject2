import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
                // 🔥 THE FIX: If data is deleted in DB, the server might return 404.
                // We must manually clear Redux so the UI updates to empty.
                dispatch(setAllAdminJobs([])); 
            }
        }
        fetchAllAdminJobs();
    }, [dispatch]);
}

export default useGetAllAdminJobs;