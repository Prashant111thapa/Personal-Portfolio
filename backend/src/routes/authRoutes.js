import express from 'express';
import { sanitizeInput, validateLogin, validateUserUpdate } from '../middleware/validate.js';
import UserController from '../controllers/UserController.js';
import ProfileController from '../controllers/ProfileController.js';
import { handleProfileError, handleResumeError, uploadProfileAvatar, uploadResume } from '../middleware/uploads.js';
import { validateToken } from '../middleware/authMiddleware.js';
import ResetPasswordController from '../controllers/ResetPasswordController.js';

const router = express.Router();

router.post("/login", validateLogin, UserController.login);
router.patch("/user/:id", validateToken, validateUserUpdate, UserController.updateUser);
router.post("/email", UserController.getUserByEmail);
router.get("/me", validateToken, UserController.getCurrentUser);
router.post('/logout', (_req, res) => {
    res.clearCookie('authToken');
    res.json({ success: true, message: "Logged out successfully" });
});

router.get("/profile", ProfileController.getAllProfile);
router.post("/profile/create", validateToken, sanitizeInput, ProfileController.createProfile);
router.patch("/profile/:id", validateToken, sanitizeInput, ProfileController.updateProfile);
router.post("/profile/upload-avatar", validateToken, uploadProfileAvatar.single('avatar'), handleProfileError, ProfileController.uploadAvatar);
router.post("/profile/upload-resume", validateToken, uploadResume.single('resume'), handleResumeError, ProfileController.uploadResume);

router.post('/request-reset', ResetPasswordController.requestPasswordReset);
router.post("/reset-password", ResetPasswordController.resetPassword);
router.get('/verify-code/:code', ResetPasswordController.verifyResetCode);


export default router;