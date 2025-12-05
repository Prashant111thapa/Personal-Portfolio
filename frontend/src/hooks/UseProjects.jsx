import React from 'react'
import { useState } from 'react';
import ProjectServices from '../services/ProjectServices';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const UseProjects = () => {

 const [formData, setFormData] = useState({
    title: "",
    tech_used: "", 
    features : "", 
    github_url: "", 
    preview_url: "",
    overview: "", 
    category: "", 
    image_url: "", 
    status: "" 
 });

 const [projects, setProjects] = useState([]);
 const [loading, setLoading] = useState(false);
 const [errors, setErrors] = useState({});
 const [isUpdate, setIsUpdate] = useState(false);
 const [currentProjectId, setCurrentProjectId] = useState(null);
 const [projectCount, setProjectCount] = useState(0);
 const [selectedImage, setSelectedImage] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);

 const loadProjects = async () => {
    setLoading(true);

    try{
        const result = await ProjectServices.getAllProjects();
        if(result.success) {
            // Handle different response structures
            const projectsData = result.data?.projects || result.data || [];
            setProjects(Array.isArray(projectsData) ? projectsData : []);
            setProjectCount(result.data?.count || projectsData.length || 0);
        } else {
            setProjects([]);
            setProjectCount(0);
        }
    } catch (err) {
        console.log("failed to load projects", err);
        toast.error("Failed to load projects");
        setProjects([]);
        setProjectCount(0);
    } finally {
        setLoading(false);
    }
 }

 useEffect(() => {
    loadProjects();
 }, []);

 useEffect(() => {
    return () => {
        if(imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
    }
 }, [imagePreview]);

// In UseProjects.jsx - Fix the handleInputChange function
const handleInputChange = (e) => {
    // Safety check for event and target
    if (!e || !e.target) {
        console.error('Invalid event object in UseProjects:', e);
        return;
    }
    
    const { name, value } = e.target;
    
    // Safety check for name property
    if (!name) {
        console.error('Input element missing name attribute in UseProjects:', e.target);
        return;
    }
    
    console.log('UseProjects - Input change:', name, '=', value);
    
    // Make sure this setState actually updates
    setFormData(prevFormData => {
        const newFormData = {
            ...prevFormData,
            [name]: value
        };
        console.log('UseProjects - New formData:', newFormData);
        return newFormData;
    });
    
    // Clear errors
    if (errors[name]) {
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    }
};

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
        setImagePreview(previewUrl);
    }
 };

 const handleRemoveImage = () => {
    // Revoke the blob URL to free memory
    if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
    }
    
    setSelectedImage(null);
    setImagePreview(null);
    
    // Clear file input
    const input = document.getElementById('project-banner');
    if (input) input.value = '';
    
    // If updating and removing current image, clear from formData
    if (isUpdate) {
        setFormData(prev => ({
            ...prev,
            image_url: ""
        }));
    }
 }

 const validate = () => {
    const err = {};

    if(!formData.title) err.title = "Project title is required";
    if(!formData.tech_used) err.tech_used = "Techs used in project is required";
    if(!formData.features) err.features = "Atleast one feature of project is required";

    setErrors(err);
    return Object.keys(err).length === 0;
 }

 const createProject = async (e) => {
    console.log("clicked");
    e.preventDefault();

    if(!validate()){
        toast.error("Please fix the form error");
        return false;
    }

    setLoading(true);
    try {
        // Create FormData to handle both text data and image
        const formDataToSend = new FormData();
        
        // Append all text fields (including empty strings for status, etc.)
        Object.keys(formData).forEach(key => {
            if(key !== 'image_url' && formData[key] !== undefined && formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });
        
        // Append image if selected
        if(selectedImage) {
            formDataToSend.append('banner', selectedImage);
        }
        
        const result = await ProjectServices.createProject(formDataToSend);
        if(result.success) {
            toast.success("Project created successfully.");
            await loadProjects();
            resetForm();
            return true;
        } else {
            toast.error(result.message || "Failed to create project");
            return false;
        }
    } catch (err) {
        console.error("Error creating project", err);
        toast.error("Error creating project");
        return false;
    } finally {
        setLoading(false);
    }
 }

 const updateProject = async (e) => {
    e.preventDefault();

    if(!validate()) {
        toast.error("Please fix the form error first.");
        return false;
    }

    if(!currentProjectId) {
        toast.error("No project selected for update");
        return false;
    }

    setLoading(true);
    try {
        // Create FormData to handle both text data and image
        const formDataToSend = new FormData();
        
        // console.log('=== UPDATE PROJECT FRONTEND DEBUG ===');
        // console.log('FormData before processing:', formData);
        // console.log('Current project ID:', currentProjectId);
        // console.log('Selected image:', selectedImage);
        
        // Append all text fields (including empty strings for status, etc.)
        Object.keys(formData).forEach(key => {
            if(key !== 'image_url' && formData[key] !== undefined && formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
                console.log(`Added to FormData: ${key} = '${formData[key]}'`);
            }
        });
        
        // Append image if new one is selected
        if(selectedImage) {
            formDataToSend.append('banner', selectedImage);
        }
        
        const result = await ProjectServices.updateProject(currentProjectId, formDataToSend);
        console.log('Update result:', result);
        if(result.success) {
            toast.success("Project updated successfully.");
            await loadProjects();
            resetForm();
            return true;
        } else {
            console.log('Update failed:', result);
            toast.error(result.message || "Failed to update project");
            return false;
        }
    } catch (err) {
        console.error("Error updating project", err);
        console.error("Error details:", {
            message: err.message,
            response: err.response,
            request: err.request
        });
        toast.error("Error updating project");
        return false;
    } finally {
        setLoading(false);
    }
 }

 const deleteProject = async (project) => {
    if(!window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) return;
    
    setLoading(true);
    try {
        const result = await ProjectServices.deleteProject(project.id);
        if(result.success) {
            toast.success("Project deleted successfully.");
            await loadProjects();
        } else {
            toast.error(result.message || "Failed to delete project");
        }
    } catch(err) {
        console.error("Error deleting project", err);
        toast.error("Error deleting project");
    } finally {
        setLoading(false);
    }
 }

 const handleUpdateClick = (project) => {
    setIsUpdate(true);
    setCurrentProjectId(project.id);
    setFormData({
        title: project.title || '',
        status: project.status || '',
        github_url: project.github_url || '',
        preview_url: project.preview_url || '',
        tech_used: project.tech_used || '',
        features: project.features || '',
        overview: project.overview || '',
        category: project.category || '',
        image_url: project.image_url || ''
    });
    
    // Set image preview for existing image
    if (project.image_url) {
        const imageUrl = project.image_url.startsWith('http') 
            ? project.image_url 
            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${project.image_url}`;
        setImagePreview(imageUrl);
        console.log('Setting image preview:', imageUrl);
    } else {
        setImagePreview(null);
    }
 };

 const resetForm = () => {
    setFormData({
        title: "",
        tech_used: "", 
        features : "", 
        github_url: "", 
        preview_url: "",
        overview: "", 
        category: "", 
        image_url: "", 
        status: "" 
    });
    setSelectedImage(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setErrors({});
    setIsUpdate(false);
    setCurrentProjectId(null);
    
    // Clear file input
    const input = document.getElementById('project-banner');
    if (input) input.value = '';
 };

  return {
    formData,
    handleInputChange,
    handleImageSelect,
    handleRemoveImage,
    errors,
    loading,
    projects,
    currentProjectId,
    projectCount,
    selectedImage,
    imagePreview,
    deleteProject,
    handleUpdateClick,
    createProject,
    updateProject,
    isUpdate,
    loadProjects,
    resetForm
  };
}

export default UseProjects;