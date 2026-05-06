import React from 'react'
import Navbar from './shared/navbar'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const AppliedJobs = () => {
    // Custom hook to fetch history from the backend
    useGetAppliedJobs(); 

    return (
        <div className='min-h-screen bg-gray-50 pb-10'>
            <Navbar />
            <div className='max-w-4xl mx-auto mt-8 px-4 md:px-0'>
                <div className='mb-6'>
                    <h1 className='font-bold text-2xl md:text-3xl text-gray-800 tracking-tight'>Applied Jobs History</h1>
                    <p className='text-sm text-gray-500 mt-1'>Manage and track your recent job applications here.</p>
                </div>
                
                {/* The redesigned table fits entirely on one page without sliding */}
                <AppliedJobTable />
            </div>
        </div>
    )
}

export default AppliedJobs;