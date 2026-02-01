import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService{

    static async hashPassword(password){
        return await bcrypt.hash(password, 12);
    }

    static async comparePassword(password, dbPassowrd) {
        return await bcrypt.compare(password, dbPassowrd);
    }

    static generateToken (user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    static verifyToken(token) {
        try {
            // Read the secret at call-time to avoid ESM import-order issues
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // console.error("Token verification failed.", err);
            return null;
        }
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return {
                success: false,
                message: "Invalid email"
            }
        }
        return { success: true };
    }

    static validatePassword(password) {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

        if(password < 6){
            return { 
                success: false,
                message: "Password must be atleast 6 characters long."
            }
        }

        if(!passRegex.test(password)){
            return {
                success: false,
                message: "Password must contain atleast one lowercase and one uppercase letter"
            }
        }
        return { success: true };
    }

    static sanitizeProfileInput(profileData) {
        const sanitized = {};

        if(profileData.name) {
            sanitized.name = profileData.name.toString().trim().replace(/\s+/g, ' ');
        }

        if(profileData.email) {
            sanitized.email = profileData.email.toString().trim().toLowerCase();
        }

        if(profileData.linkedin_url) {
            sanitized.linkedin_url = this.sanitizeURL(profileData.linkedin_url);
        }

        if(profileData.github_url) {
            sanitized.github_url = this.sanitizeURL(profileData.github_url);
        }

        if(profileData.resume_url) {
            sanitized.resume_url = profileData.resume_url.toString().trim();
        }

        if(profileData.avatar_url) {
            sanitized.avatar_url = profileData.avatar_url.toString().trim();
        } 

        if(profileData.education) {
            sanitized.education = profileData.education.toString().trim().replace(/\s+/g, ' ');
        }

        if(profileData.contact_no) {
            sanitized.contact_no = profileData.contact_no.toString().trim().replace(/[^\d+\-\s()]/g, '');
        }

        if(profileData.location) {
            sanitized.location = profileData.location.toString().trim().replace(/\s+/g, ' ');
        }

        if(profileData.role) {
            sanitized.role = profileData.role.toString().trim().replace(/\s+/g, ' ');
        }
        
        if(profileData.about) {
            sanitized.about = profileData.about.toString().trim().replace(/\s+/g, ' ');
        }

        if(profileData.interests) {
            sanitized.interests = profileData.interests.toString().trim().replace(/\s+/g, ' ');
        }

        if(profileData.updated_at){
            sanitized.updated_at = parseInt(profileData.updated_at.toString());
        }

        return sanitized;
    }

    static sanitizeURL(url) {
        if(!url) return null;

        let sanitizedURL = url.toString().trim();

        if(sanitizedURL && !sanitizedURL.match(/^https?:\/\//)) {
            sanitizedURL = 'https://' + sanitizedURL;
        }
        return sanitizedURL;
    }

    static validateURL(url) {
        try {
            new URL(url);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: "Invalid URL format"
            };
        }
    }

    static validateContactNumber(contact) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanContact = contact.replace(/[\s\-\(\)]/g, '');
        
        if (!phoneRegex.test(cleanContact)) {
            return {
                success: false,
                message: "Invalid contact number format"
            };
        }
        return { success: true };
    }



}


export default AuthService;