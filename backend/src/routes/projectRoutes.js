import express from 'express';
import { validateToken } from '../middleware/authMiddleware.js';
import { handleMulterError, uploadProjectBanner } from '../middleware/uploads.js';
import ProjectController from '../controllers/ProjectController.js';

const router = express.Router();

router.post("/create", 
    validateToken, 
    uploadProjectBanner, 
    handleMulterError, 
    ProjectController.createProject
);

router.post(
    "/upload-banner/:id",
    validateToken,
    uploadProjectBanner,
    handleMulterError,
    ProjectController.uploadBanner
);

router.get("/", ProjectController.getAllProject);
router.get("/:id", ProjectController.getProjectById);
router.patch("/:id", 
    validateToken, 
    uploadProjectBanner, 
    handleMulterError, 
    ProjectController.updateProject
);
router.delete("/:id", validateToken, ProjectController.deleteProject);

export default router;