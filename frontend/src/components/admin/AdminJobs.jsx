import React, { useState } from 'react'
import Navbar from '../shared/navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'

const AdminJobs = () => {
    useGetAllAdminJobs();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                {/* Changed this container to match Companies.jsx:
                   - Side-by-side on md+ screens (flex-row)
                   - Center items vertically
                   - Justify between to push button to the right
                */}
                <div className='flex flex-col md:flex-row items-center justify-between gap-4 my-5'>
                    <Input
                        className="w-full md:w-fit bg-white"
                        placeholder="Filter by name, role"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button 
                        className="w-full md:w-auto bg-[#6A38C2] hover:bg-[#5b30a6]" 
                        onClick={() => navigate("/admin/jobs/create")}
                    >
                        New Job
                    </Button>
                </div>

                <AdminJobsTable search={search}/>
            </div>
        </div>
    )
}

export default AdminJobs;