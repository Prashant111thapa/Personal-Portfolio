import React from 'react'
import Input from '../../../components/shared/Input';
import { ImagePlus, X } from 'lucide-react';
import Button from '../../../components/shared/Button';

const ProjectForm = ({
    formData = {},
    handleInputChange = () => {},
    handleImageSelect = () => {},
    handleRemoveImage = () => {},
    errors ={},
    loading = false,
    selectedImage,
    imagePreview,
    createProject,
    updateProject,
    isUpdate = false,
}) => {

    const safeFormData = {
        title: '',
        status: '',
        github_url: '',
        preview_url: '',
        tech_used: '',
        features: '',
        overview: '',
        category: '',
        image_url: '',
        ...formData // Override with actual data
    };

    const getImageToShow = () => {
        console.log('Image Debug:', { 
            imagePreview, 
            isUpdate, 
            imageUrl: safeFormData.image_url, 
            selectedImage 
        });
        
        if (imagePreview) return imagePreview;
        if (isUpdate && safeFormData.image_url) {
            // Make sure to use full URL for existing images
            return safeFormData.image_url.startsWith('http') 
                ? safeFormData.image_url 
                : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${safeFormData.image_url}`;
        }
        return null;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };
  return (
    <div className="w-full md:w-[60%] px-3 py-8 rounded-lg border border-[#FD6F00]/30 bg-[#121212]">
        <h2 className="text-2xl font-bold text-white mb-6">
            {isUpdate ? 'Update Project' : 'Create New Project'}
        </h2>

        <form 
            onSubmit={isUpdate ? updateProject : createProject}
            className='space-y-4'
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <Input
                        label="Title"
                        name="title"
                        value={formData?.title }
                        onChange={handleInputChange}
                        placeholder='Enter project title'
                        className={`w-full ${errors?.title ? "border-2 border-red-500" : ""}`}
                    />
                    {errors?.title ? <span className='text-sm text-red-500'>{errors?.title}</span> : ""}
                </div>
                <div className='mt-1'>
                    <label className='text-white font-medium mt-2 block'>Category</label>
                    <select 
                        name="category"
                        value={formData?.category }
                        onChange={handleInputChange}
                        className='w-full p-4 rounded-md bg-[#1e1e1e] text-white border border-[#FD6F00]/30 focus:outline-none focus:ring-2 focus:ring-[#FD6F00]'
                    >
                        <option value="">Select Category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Desktop Application">Desktop Application</option>
                        <option value="API/Backend">API/Backend</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='mt-1'>
                    <label className='text-white font-medium mt-2 block'>Status</label>
                    <select 
                        name="status"
                        value={formData?.status }
                        onChange={handleInputChange}
                        className='w-full p-4 rounded-md bg-[#1e1e1e] text-white border border-[#FD6F00]/30 focus:outline-none focus:ring-2 focus:ring-[#FD6F00]'
                    >
                        <option value="">Select Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="not-started">Not Yet Started</option>
                    </select>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                    label="Github URL"
                    name="github_url"
                    value={formData?.github_url }
                    onChange={handleInputChange}
                    placeholder='Enter github repository url'
                    className='w-full'
                />
                <Input 
                    label="Preview URL"
                    name="preview_url"
                    value={formData?.preview_url }
                    onChange={handleInputChange}
                    placeholder='Enter live demo url'
                    className='w-full'
                />
            </div>

            <div>
                <Input
                    label="Tech Used (comma seperated)"
                    name="tech_used"
                    value={formData?.tech_used }
                    onChange={handleInputChange}
                    placeholder='e.g React, Node.js, MongoDB'
                    className={`w-full ${errors?.tech_used ? "border-2 border-red-500" : ""}`}
                />
                {errors?.tech_used ? <span className='text-sm text-red-500'>{errors?.tech_used}</span> : ""}
            </div>

            <div>
               <label className='text-white font-medium mb-1 block'>Features (Comma seperated)*</label>
                <textarea
                    name="features"
                    value={formData?.features }
                    onChange={handleInputChange}
                    placeholder='List the key features of the project'
                    rows={4}
                    className={`w-full p-4 rounded-md bg-[#1e1e1e] text-white border border-[#FD6F00]/30 focus:outline-none focus:ring-2 focus:ring-[#FD6F00] resize-vertical ${errors?.features ? "border-2 border-red-500" : ""}`}
                />
                {errors?.features ? <span className='text-sm text-red-500'>{errors?.features}</span> : null}
            </div>

            <div>
                <label className='text-white font-medium mb-1 block'>Overview</label>
                <textarea
                    name="overview"
                    value={formData?.overview }
                    onChange={handleInputChange}
                    placeholder='Brief description of the project'
                    rows={3}
                    className='w-full p-4 rounded-md bg-[#1e1e1e] text-white border border-[#FD6F00]/30 focus:outline-none focus:ring-2 focus:ring-[#FD6F00] resize-vertical'
                />
            </div>

            <div className='w-full border border-[#FD6F00]/30 rounded-md p-5 bg-[#1a1a1a]'>
                <label className='text-white font-medium mb-3 block'>Project Banner</label>
            
                <div className='space-y-3'>
                    {getImageToShow() ? (
                        <div className='relative inline-block'>
                            <img 
                                src={getImageToShow()}
                                 alt="Project preview"
                                 className='w-full max-w-md h-48 object-cover rounded-md border border-[#FD6F00]/20'
                            />
                            <button
                                type='button'
                                onClick={handleRemoveImage}
                                className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors'
                            >
                                <X size={16} />
                            </button>
                            <div className='mt-2 text-sm text-gray-400'>
                             {selectedImage ? 'New image selected' : isUpdate ? 'Current project image' : 'Image preview'}
                            </div>
                        </div>
                    ): (
                        <div
                           className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#FD6F00]/30 rounded-md cursor-pointer hover:border-[#FD6F00]/60 transition-colors'
                           onClick={() => document.getElementById("project-banner").click()} 
                        >
                            <ImagePlus size={40} className='text-white/60 hover:text-white/80 transition-colors mb-2' />
                            <span className='text-white/60'>Click to upload project banner</span>
                            <span className='text-white/40 text-sm'>PNG, JPEG, JPG, WEBP (Max 5MB)</span>
                        </div>
                    )}

                    <button
                        type='button'
                        onClick={() => document.getElementById('project-banner').click()}
                        className='px-4 py-2 bg-[#FD6F00]/20 hover:bg-[#FD6F00]/30 text-[#FD6F00] rounded-md transition-colors border border-[#FD6F00]/30'    
                    >
                        {getImageToShow() ? 'Change Image' : 'Select Image'}
                    </button>
                </div>

                <input
                    id='project-banner'
                    type='file'
                    accept='image/png,image/jpeg,image/jpg,image/webp'
                    onChange={handleImageSelect}
                    className='hidden'
                />

                <div className='pt-4'>
                    <Button
                        type="submit"
                        onClick={createProject}
                        disabled={loading}
                        className='w-full'
                    >
                        {loading
                            ? `${isUpdate ? "Updating...": "Creating..."}`
                            : `${isUpdate ? "Update Project" : "Create Project"}`
                        }
                    </Button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default ProjectForm;
