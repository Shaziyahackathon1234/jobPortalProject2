import React, { useEffect } from 'react'
import Navbar from '../shared/navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.applications));
                }
            } catch (error) {
                console.log("Error fetching applicants:", error);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    return (
        <div className='min-h-screen bg-gray-50 pb-10'>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='my-5'>
                    <h1 className='font-bold text-2xl text-gray-800'>
                        Applicants ({applicants?.length || 0})
                    </h1>
                    <p className='text-sm text-gray-500 mt-1'>
                        Detailed candidate list click on resume to view the resume of the candidate.
                    </p>
                </div>
                
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants;