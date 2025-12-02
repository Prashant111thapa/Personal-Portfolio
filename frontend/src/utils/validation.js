// Input sanitization and validation utilities

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = (input) => {
    if (!input || typeof input !== 'string') return '';
    
    return input
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocols
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .replace(/data:/gi, '') // Remove data: protocols
        .trim();
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates name format (letters, spaces, hyphens, apostrophes only)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid name format
 */
export const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name);
};

/**
 * Comprehensive form validation
 * @param {Object} formData - Form data object
 * @returns {Object} - Validation errors object
 */
export const validateContactForm = (formData) => {
    const errors = {};

    // Name validation
    if (!formData.name?.trim()) {
        errors.name = "Name is required";
    } else if (formData.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 50) {
        errors.name = "Name must not exceed 50 characters";
    } else if (!isValidName(formData.name)) {
        errors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email validation
    if (!formData.email?.trim()) {
        errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
        errors.email = "Please enter a valid email address";
    } else if (formData.email.length > 100) {
        errors.email = "Email must not exceed 100 characters";
    }

    // Subject validation
    if (!formData.subject?.trim()) {
        errors.subject = "Subject is required";
    } else if (formData.subject.length < 5) {
        errors.subject = "Subject must be at least 5 characters";
    } else if (formData.subject.length > 100) {
        errors.subject = "Subject must not exceed 100 characters";
    }

    // Message validation
    if (formData.message && formData.message.length > 1000) {
        errors.message = "Message must not exceed 1000 characters";
    }

    return errors;
};

/**
 * Sanitizes form data object
 * @param {Object} formData - Form data to sanitize
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
    const sanitized = {};
    
    Object.keys(formData).forEach(key => {
        sanitized[key] = sanitizeInput(formData[key]);
    });
    
    return sanitized;
};

/**
 * Rate limiting check for form submissions
 * @param {string} key - Storage key for tracking attempts
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Object} - { allowed: boolean, remainingTime?: number }
 */
export const checkRateLimit = (key, maxAttempts = 3, timeWindow = 900000) => {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Remove attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < timeWindow);
    
    if (recentAttempts.length >= maxAttempts) {
        const oldestAttempt = Math.min(...recentAttempts);
        const remainingTime = timeWindow - (now - oldestAttempt);
        return { allowed: false, remainingTime };
    }
    
    // Add current attempt and save
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return { allowed: true };
};