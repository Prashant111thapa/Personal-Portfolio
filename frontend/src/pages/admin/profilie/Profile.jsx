import React, { useEffect, useState } from "react";
import AuthService from "../../../services/AuthServices";
import { toast } from 'react-toastify';
import CreateProfile from "./CreateProfile";

const Profile = () => {

const [formData, setFormData] = useState({
    name: '', email: '', contact_no: '', location: '',
    role: '', about: '', education: '', interests: '',
    linkedin_url: '', github_url: ''
});

const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
const [profileLoading, setProfileLoading] = useState(false);

//  avatar and resume
const [avatarPreview, setAvatarPreview] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);
const [selectedResume, setSelectedResume] = useState(null);

const [profileExists, setProfileExists] = useState(false);
const [currentProfile, setCurrentProfile] = useState(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const asAbsoluteUrl = (p) => {
    if (!p) return p;
    return p.startsWith('http') ? p : `${API_BASE}${p}`;
};

const loadProfileData = async () => {
    setErrors({});
    setProfileLoading(true);
    try{
        const result = await AuthService.getAllProfile();
        if(result.success && result.data.count > 0) {
            const profile = result.data.profiles[0];
            setProfileExists(true);
            setCurrentProfile(profile);

            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                contact_no: profile.contact_no || '',
                location: profile.location || '',
                role: profile.role || '',
                about: profile.about || '',
                education: profile.education || '',
                interests: profile.interests || '',
                linkedin_url: profile.linkedin_url || '',
                github_url: profile.github_url || ''
            });

            if(profile.avatar_url) {
                setAvatarPreview(asAbsoluteUrl(profile.avatar_url));
            }
        } else {
            setCurrentProfile(null);
            setProfileLoading(false);
        }
    } catch(err) {
        setCurrentProfile(null);
        setProfileLoading(false);
        console.error("Error loading profile", err);
    } finally {
        setProfileLoading(false);
    }
}

useEffect(() => {
    loadProfileData();
}, []);

const handleInputChange = (e) => {
    // Safety check for event and target
    if (!e || !e.target) {
        console.error('Invalid event object in Profile:', e);
        return;
    }
    
    const { name, value } = e.target;
    
    // Safety check for name property
    if (!name) {
        console.error('Input element missing name attribute in Profile:', e.target);
        return;
    }
    
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));

    if(errors[name]) {
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    }
}

const validate = () => {
    const newErrors = {};
    if(!formData.name.trim()) newErrors.name = "Name is required.";
    if(!formData.email.trim()) newErrors.email = "Email is required.";
    if(formData.email && !/\S+@\S+\.\S+/.test(formData.email)){
        newErrors.email = "Valid email is required"
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}

const handleCreateProfile = async (e) => {
    e.preventDefault();

    if(!validate()){
        toast.error("Please fix the form error");
        return;
    }

    setLoading(true);
    try{
        // const result = await AuthService.createProfile(formData);
        let result;
        if(profileExists) {
            result = await AuthService.updateProfile(formData, currentProfile?.id);
        } else {
            result = await AuthService.createProfile(formData)
        }

        if(result.success){ 
            if(profileExists) {
                toast.success("Profile updated successfully.");
            } else {
                toast.success("Profile created successfully.");

                setProfileExists(true);

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            }
            await loadProfileData();
            setErrors({});
        }
    } catch(err) {
        console.error(`Error ${profileExists ? 'updating ': 'creating '} profile`, err);
        toast.error(err.message || `Error ${profileExists ? 'updating ': 'creating '} profile`);
        setLoading(false);
    } finally {
        setLoading(false);
    }
}

const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if(file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if(!allowedTypes.includes(file.type)){
            toast.error("Only .png, .jpeg, .jpg or .webp images are allowed.");
            e.target.value = "";
            return;
        }
        setSelectedImage(file);

        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    }
};

const handleUploadImage = async () => {
    try {
        if(!profileExists) {
            toast.error("Please create a profile first.");
            return;
        }

        if(!selectedImage) {
            toast.error("Please select an image first.");
            return;
        }

        const result = await AuthService.uploadProfileAvatar(selectedImage);
        if(result.success) {
            toast.success(`Profile avatar ${currentProfile?.avatar_url ? 'updated ': 'uploaded '} successfully.`);
            const input = document.getElementById('avatar-input');
            if (input) input.value = '';
            setSelectedImage(null);
            await loadProfileData();
        }
    } catch (err) {
        toast.error(err.message || 'Failed to upload avatar');
    }
}

const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    if(file) {
        setSelectedResume(file);
    }
}

const handleUploadResume = async () => {
    if(!profileExists) {
        toast.error("Please create a profile first.");
        return;
    }

    if(!selectedResume) {
        toast.error("Please upload resume first.");
        return;
    }

    try{
        const result = await AuthService.uploadResume(selectedResume);
        if(result.success) {
            toast.success(`Resume ${currentProfile?.resume_url ? "updated": "uploaded"} successfully.`);

            const input = document.getElementById('resume-input');
            if (input) input.value = '';
            setSelectedResume(null);
            await loadProfileData();
        }
    } catch(err) {
        toast.error(err.message || "Error uploading resume.");
    }
}

useEffect(() => {
    return () => {
        if(avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
    }
}, [avatarPreview]);

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-white text-lg">Loading profile...</div>
            </div>
        );
    }

return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <CreateProfile
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleCreateProfile}
            errors={errors}
            loading={loading}
            profileExists={profileExists}
            currentProfile={currentProfile}

            selectedImage={selectedImage}
            imagePreview={avatarPreview}
            handleImageSelect={handleImageSelect}
            handleUploadAvatar={handleUploadImage}
            
            selectedResume={selectedResume}
            handleResumeSelect={handleResumeSelect}
            handleUploadResume={handleUploadResume}
        />
    </div>
);

}

export default Profile;