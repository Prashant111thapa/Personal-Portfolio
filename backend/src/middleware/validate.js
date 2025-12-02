import { body } from 'express-validator';
import AuthService from '../services/AuthService.js';
import BaseService from '../services/BaseService.js';

export const validateLogin = [
    body('email').isEmail().withMessage("Valid email is required."),
    body('password').notEmpty().withMessage("Valid password is required.")
];

export const validateUserUpdate = [
    body('password')
        .matches((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/))
        .withMessage("Password must be at least 6 characters and include uppercase, lowercase, number, and special character.")
];

export const sanitizeInput = (req, _res, next) => {
    req.body = AuthService.sanitizeProfileInput(req.body);
    next();
}

export const validateContactInputs = (req, res, next) => {
    const { name, email, subject } = req.body;

    if(!name) return res.status(400).json({ success: false, message: "Name is required" });
    if(!email) return res.status(400).json({ success: false, message: "Email is required" });
    if(!subject) return res.status(400).json({ success: false, message: "Subject is required" });

    next();
}

export const validateContactId = (req, res, next) => {
    const validateId = BaseService.validateIDParam(res, req.params.id);
    if(!validateId) return;
    next();
}