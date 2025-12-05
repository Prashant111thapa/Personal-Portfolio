import express from 'express';
import { validateToken } from '../middleware/authMiddleware.js';
import { handleProjectError, uploadProjectBanner } from '../middleware/uploads.js';
import ProjectController from '../controllers/ProjectController.js';

const router = express.Router();

router.post("/create", 
    validateToken, 
    uploadProjectBanner.single('banner'), 
    handleProjectError, 
    ProjectController.createProject
);

router.get("/", ProjectController.getAllProject);
router.get("/:id", ProjectController.getProjectById);
router.patch("/:id", 
    validateToken, 
    uploadProjectBanner.single('banner'), 
    handleProjectError, 
    ProjectController.updateProject
);
router.delete("/:id", validateToken, ProjectController.deleteProject);

export default router;