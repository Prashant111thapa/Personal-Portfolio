import express from 'express';
import ratelimit from 'express-rate-limit';
import { validateToken } from '../middleware/authMiddleware.js';
import ContactController from '../controllers/ContactController.js';
import { validateContactId } from '../middleware/validate.js';

const router = express.Router();

const contactLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Too many contact submissions, please try again later"
});

router.post("/create", contactLimiter, ContactController.createContact);

router.get("/contacts", validateToken, ContactController.getAllContactMessages);
router.get("/:status", validateToken, ContactController.getContactByStatus);

router.patch("/:id", validateContactId, validateToken, ContactController.markContactAsRead);

router.delete("/:id", validateContactId, validateToken, ContactController.deleteContactMessage);

export default router;