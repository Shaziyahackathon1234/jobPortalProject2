import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// --- APPLY FOR A JOB ---
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if the user has already applied for this job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Create the new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Push the application ID into the job's application array
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error in applyJob:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

// --- GET JOBS APPLIED BY USER ---
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        // Populate job details and nested company details
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                }
            });

        if (!application || application.length === 0) {
            return res.status(200).json({
                application: [], 
                success: true
            });
        }

        return res.status(200).json({
            application, 
            success: true
        });
    } catch (error) {
        console.error("Error in getAppliedJobs:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

// --- GET ALL APPLICANTS (Admin/Recruiter View) ---
export const getApplicants = async (req, res) => {
    try {
        const adminId = req.id;

        // 1. Find all jobs created by this specific recruiter
        const jobs = await Job.find({ created_by: adminId });
        const jobIds = jobs.map(job => job._id);

        // 2. Find applications for those specific jobs
        const applications = await Application.find({
            job: { $in: jobIds }
        })
            .populate("applicant") // Get user profile details
            .populate({
                path: "job",
                populate: {
                    path: "company" // 🔥 CRITICAL: Allows frontend to access item.job.company.name
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error("Error in getApplicants:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// --- UPDATE APPLICATION STATUS (Admin Only) ---
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        // Find application by ID
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update status (Accepted/Rejected/Pending)
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error in updateStatus:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};