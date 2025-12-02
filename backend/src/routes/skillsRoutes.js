import express from 'express';
import SkillsController from '../controllers/SkillsController.js';
import { validateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", validateToken, SkillsController.createSkill);
router.patch("/:id", validateToken, SkillsController.updateSkill);
router.delete("/:id", validateToken, SkillsController.deleteSkill);
router.get("/skills", SkillsController.getAllSkills);

export default router;