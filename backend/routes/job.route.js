import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getAdminJobs, 
    getAllJobs, 
    getJobById, 
    postJob, 
    postMultipleJobs,
    updateJob 
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/bulk").post(isAuthenticated, postMultipleJobs);
router.route("/update/:id").put(isAuthenticated, updateJob); 

export default router;