import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        let cancelled = false;
        // Retry on failure so a cold-started server (Render free tier spins
        // down after inactivity) doesn't leave the page with an empty list.
        const fetchAllJobs = async (attempt = 0) => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery || "")}`,
                    { withCredentials: true, timeout: 60000 }
                );
                if (!cancelled && res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                if (!cancelled && attempt < 2) {
                    setTimeout(() => fetchAllJobs(attempt + 1), 3000);
                } else {
                    console.log(error);
                }
            }
        }
        fetchAllJobs();
        return () => { cancelled = true; };
    }, [searchedQuery, dispatch])
}

export default useGetAllJobs