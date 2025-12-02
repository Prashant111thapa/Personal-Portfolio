import UserModel from "../models/UserModel.js";
import AuthService from "../services/AuthService.js";

class ProfileController {
    
    static async createProfile(req, res) {
        try{
            const { name, email, contact_no, location, role, avatar_url,
                about, education, interests, linkedin_url, github_url, resume_url } = req.body;

            if(!name) {
                return res.status(400).json({ success: false, message: "Name is required."});
            }

            if(!email) {
                return res.status(400).json({ success: false, message: "Email is required."});
            }

            const emailValidation = AuthService.validateEmail(email);
            if(!emailValidation.success){
                return res.status(400).json({ success: false, message: emailValidation.message || "Invalid email format"});
            }

            if(contact_no){
                const contactValidation = AuthService.validateContactNumber(contact_no);
                if(!contactValidation.success) {
                    return res.status(400).json({success: false, message: contactValidation.message})
                }
            }

            const profileData = {
                name, email, contact_no, location, role, avatar_url,
                about, education, interests, linkedin_url, github_url, resume_url
            };

            const sanitizedInput = AuthService.sanitizeProfileInput(profileData);

            const newProfile = await UserModel.createProfile(sanitizedInput);
            if(!newProfile) {
                return res.status(400).json({ success: false, message: "Failed to create profile"});
            }

            return res.status(201).json({ 
                success: true, 
                data: newProfile, 
                message: "Profile created successfully."
            });

        } catch(err) {
            console.error("Error creating profile", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
 }

    static async uploadAvatar(req, res) {
        try{
            if(!req.file){
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }

            const avatarPath = `/uploads/profile/${req.file.filename}`;

            const updatedProfile = await UserModel.updateProfileAvatar(avatarPath);

            if(!updatedProfile) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to update avatar"
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    avatar_url: avatarPath,
                    filename: req.file.filename
                },
                message: "Avatar uploaded successfully"
            });
        } catch(err) {
            console.error("Error uploading avatar: ", err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async uploadResume(req, res){
        try{
            if(!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Resume is required"
                });
            }

            const resumePath = `/uploads/resume/${req.file.filename}`;
            const updatedResume = await UserModel.updateResume(resumePath);

            if(!updatedResume) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to update resume"
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    resume_url: resumePath,
                    filename: req.file.filename
                },
                message: "Resume uploaded successfully."
            });
        } catch(err) {
            console.error("Error uploading resume", err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async updateProfile (req, res) {
        try {
            const profileId = req.params.id;

            const { name, email, contact_no, location, role,
                about, education, interests, linkedin_url, github_url } = req.body;

            if(!profileId || isNaN(profileId) || profileId < 0) {
                return res.status(400).json({ success: false, message: "Valid profile id is required." });
            }

            if(!name) {
                return res.status(400).json({ success: false, message: "Name is required. "});
            }

            if(!email) {
                return res.status(400).json({ success: false, message: "Email is required. "});
            }

            const validateEmail = AuthService.validateEmail(email);
            if(!validateEmail.success) {
               return res.status(400).json({ success: false, message: validateEmail.message });
            }

            if(contact_no) {
                const validateContactNumber = AuthService.validateContactNumber(contact_no);
                if(!validateContactNumber.success) {
                   return res.status(400).json({ success: false, message: validateContactNumber.message });
                }
            }

            const profileExists = await UserModel.getProfileById(profileId);
            if(!profileExists) {
                return res.status(404).json({ success: false, message: "Profile with this id doesn't exist." });
            }

            const profileUpdateData = {
                name, email, contact_no, location, role,
                about, education, interests, linkedin_url, github_url
            };

            const sanitized = AuthService.sanitizeProfileInput(profileUpdateData);

            const updatedProfile = await UserModel.updateProfile(sanitized, profileId);
            if(!updatedProfile) {
                return res.status(400).json({ success: false, message: "Failed to update profile." });
            }

            return res.status(200).json({
                success: true,
                updatedProfile,
                message: "Profile updated successfully."
            });
        } catch(err) {  
            console.log("Error updating profile", err);
            return res.status(500).json({ success: false, message: "Internal Server Error in update profile."});
        }
    }

    static async getAllProfile(_req, res) {
        try{
            const profiles = await UserModel.getAllProfile();

            if(profiles && profiles.length > 0) {
                return res.status(200).json({
                    success: true,
                    data:{
                       profiles: profiles, 
                       count: profiles.length
                    } 
                });
            }
            return res.status(200).json({ 
                success: true, 
                data: {
                    profiles: [],
                    count: 0
                },
                message: "No profile is available."
            });
        } catch (err) {
            console.error("Error fetching profile:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Internal Server Error" 
            });
        }
    }

}

export default ProfileController;