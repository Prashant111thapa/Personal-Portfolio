import { useState } from 'react';
import ContactServices from '../services/ContactServices';
import { toast } from 'react-toastify';
import { sanitizeInput, validateContactForm, sanitizeFormData, checkRateLimit } from '../utils/validation';

// Simple hook for public contact form - no admin features
const usePublicContact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        // Safety check for event and target
        if (!e || !e.target) {
            console.error('Invalid event object:', e);
            return;
        }
        
        const { name, value } = e.target;
        
        // Safety check for name property
        if (!name) {
            console.error('Input element missing name attribute:', e.target);
            return;
        }
        
        // For normal typing, preserve spaces and only sanitize when needed
        const sanitizedValue = value
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
            .replace(/<[^>]*>/g, ''); // Remove other HTML tags

        setFormData({
            ...formData,
            [name]: sanitizedValue
        });

        // Clear errors when user starts typing again
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    }

    const createContact = async (e) => {
        try {
            e.preventDefault();
            
            // Client-side validation
            const validation = validateContactForm(formData);
            setErrors(validation.errors);
            
            if (!validation.isValid) {
                toast.error("Please correct the errors in the form");
                return;
            }

            // Rate limiting check
            const rateLimitCheck = checkRateLimit('contact_form');
            if (!rateLimitCheck.allowed) {
                const minutes = Math.ceil(rateLimitCheck.timeLeft / 60000);
                toast.error(`Too many submissions. Please wait ${minutes} minute(s) before trying again.`);
                return;
            }

            const sanitizedData = sanitizeFormData(formData);

            setLoading(true);
            try {
                const result = await ContactServices.createContact(sanitizedData);
                if(result.success) {
                    toast.success("Thank you! I will contact you soon.");
                    setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: ""
                    }); 
                    setErrors({});
                }
            } catch(err) {
                console.error("Error sending inquiry.", err);
                toast.error("Failed to send message. Please try again later.");
            } finally {
                setLoading(false);
            }
        } catch (error) {
            console.error("Unexpected error in createContact:", error);
            toast.error("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    }

    return {
        formData,
        errors,
        loading,
        handleInputChange,
        createContact,
    }
}

export default usePublicContact;