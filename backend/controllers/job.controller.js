import { Job } from "../models/job.model.js";

// Admin: Post a job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, position, companyId, experience } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !position || !companyId || !experience) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            position: Number(position),
            company: companyId,
            experienceLevel: experience,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// jobseeker: Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword ? req.query.keyword.trim() : "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } },
                { requirements: { $regex: keyword, $options: "i" } } 
            ]
        };

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                jobs: [],
                success: true
            })
        };

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// Get Job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({ path: "applications" })
            .populate({ path: "company" });
            
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        };

        return res.status(200).json({ 
            job, 
            success: true 
        });
    } catch (error) {
        console.log("Error in getJobById:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const postMultipleJobs = async (req, res) => {
    try {
        const jobs = req.body;
        const userId = req.id;

        const formattedJobs = jobs.map(job => ({
            ...job,
            requirements: job.requirements,
            // requirements: job.requirements.split(","),
            salary: Number(job.salary),
            position: Number(job.position),
            company: job.company || job.companyId,
            experienceLevel: job.experience,
            created_by: userId
        }));

        await Job.insertMany(formattedJobs);

        return res.status(201).json({
            message: "Bulk jobs created",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
};

// Admin: Get admin-specific jobs
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Admin: Update job
export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, position, companyId, experience } = req.body;
        const jobId = req.params.id;

        const updateData = {
            title,
            description,
            requirements: requirements?.split(","),
            salary: Number(salary),
            location,
            jobType,
            position: Number(position),
            company: companyId,
            experienceLevel: experience 
        };

        const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}