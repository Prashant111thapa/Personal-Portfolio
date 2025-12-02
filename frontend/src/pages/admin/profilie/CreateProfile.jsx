import React from 'react'
import Input from '../../../components/shared/Input';
import Button from '../../../components/shared/Button';
import {ImagePlus} from 'lucide-react';

const CreateProfile = ({ 
    formData,
    onInputChange,
    errors,
    loading,
    onSubmit,

    selectedImage,
    handleImageSelect,
    imagePreview,
    handleUploadAvatar,

    selectedResume,
    handleResumeSelect,
    handleUploadResume,

    profileExists, 
    currentProfile
 }) => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  return (
    <div className="w-full md:w-[60%] px-3 py-8 rounded-lg border border-[#FD6F00]/30 bg-[#121212]">
        <form onSubmit={onSubmit} className='space-y-4'>
            <h2 className='text-3xl font-semibold text-[#FD6F00]'>{profileExists ? "Update Profile": "Create Profile"}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <Input 
                        label="Name"
                        name="name"
                        value={formData.name}
                        placeholder="Enter your name"
                        className={`w-full ${errors.name ? "border-2 border-red-500" : ""}`}
                        onChange={onInputChange}
                    />  
                    {errors.name ? <span className='text-red-500 text-sm'>{errors.name}</span> : ""}
                </div>
                <div>
                    <Input 
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email address"
                        className={`w-full ${errors.email ? "border-2 border-red-500" : ""}`}
                        onChange={onInputChange}
                    />  
                    {errors.email ? <span className='text-red-500 text-sm'>{errors.email}</span> : ""}
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input 
                    label="Education"
                    name="education"
                    value={formData.education}
                    placeholder="Enter your education level"
                    className="w-full"
                    onChange={onInputChange}
                />
                <Input 
                    label="Location"
                    name="location"
                    value={formData.location}
                    placeholder="Enter your location"
                    className="w-full"
                    onChange={onInputChange}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input 
                    label="Contact"
                    name="contact_no"
                    value={formData.contact_no}
                    placeholder="Enter your contact number"
                    className="w-full"
                    onChange={onInputChange}
                />                  
                <Input 
                    label="Role"
                    name="role"
                    value={formData.role}
                    placeholder="Enter your role e.g Frontend Developer"
                    className="  w-full"
                    onChange={onInputChange}
                />

            </div>

            <div className="flex flex-col space-y-4">   
                <Input 
                    label="Interests"
                    name="interests"
                    value={formData.interests}
                    placeholder="Enter your interests"
                    className='w-full'
                    onChange={onInputChange}
                />
                <Input 
                    label="Linkedin URL"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    placeholder="Enter your Linkedin URL"
                    className='w-full'
                    onChange={onInputChange}
                />            
                <Input 
                    label="Github URL"
                    name="github_url"
                    value={formData.github_url}
                    placeholder="Enter your Github URL"
                    className='w-full'
                    onChange={onInputChange}
                />

                <label className='text-white font-medium mb-1 p-1'>About</label>
                <textarea 
                    type="text"
                    name="about"
                    onChange={onInputChange}
                    value={formData.about}
                    placeholder="Describe yourself"
                    className='p-4 rounded-md bg-[#1e1e1e] text-white border
                            border-[#FD6F00]/30 focus:outline-none focus:ring-2 focus:ring-[#FD6F00] max-h-30'
                ></textarea>
                <Button 
                    disabled={loading}
                    type="submit"
                >
                    {loading 
                     ? `${profileExists ? "Updating..." : "Creating..."}`
                     : `${profileExists ? "Update Profile": "Create Profile"}`
                    }
                </Button>
            </div>
        </form>

        {/* Profile Avatar Upload */}
        <div className="flex flex-col md:flex-row items-center justify-between mx-3 my-4 p-5 border border-[#FD6F00]/30 rounded-lg hover:border-[#FD6F00]/50">
            <div className='relative'>
                <div
                    className='w-40 h-40 bg-gray-500 rounded-full flex items-center justify-center border border-[#FD6F00] shadow-lg shadow-[#fd6f00]/60 hover:shadow-[#FD6F00]/80'
                    onClick={() => document.getElementById('avatar-input').click()}
                >
                    {imagePreview ? (
                        <img  
                            src={imagePreview}
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-full"
                        />
                    ): (
                        <ImagePlus
                            size={48}
                            className='text-white/60 hover:text-white/80 transition-colors'
                        />
                    )}
                </div>

                {/* Hidden file input */}
                <input 
                    id='avatar-input'
                    type='file'
                    accept='.png,.jpg,.jpeg,.webp'
                    onChange={handleImageSelect}
                    className='hidden'
                />
            </div>

            {/* <div className='flex flex-col space-y-2'>
                    <Button onClick={() => document.getElementById('avatar-input').click()}>
                        {selectedImage ? 'change Image' : 'Select Image'}
                    </Button>
            </div> */}

            {selectedImage && (
                 <Button 
                    onClick={handleUploadAvatar} 
                    className='mt-3'
                >
                    {currentProfile?.avatar_url ? 'Update Avatar' : 'Upload Avatar'}
                </Button>
            )}
           
        </div>

        <div className="flex flex-col md:flex-row items-center md:justify-between mx-3 p-5 border border-[#FD6F00]/30 rounded-lg hover:border-[#FD6F00]/50 gap-4">
            <div className="flex flex-col w-full md:w-auto">
                <label className='text-white font-medium mb-1 p-1'>Resume Upload</label>
                
                {/* Show current resume if exists */}
                {currentProfile?.resume_url && (
                    <div className="mb-2">
                        <span className="text-blue-400 text-sm">Current: </span>
                        <a 
                            href={`${API_BASE}${currentProfile.resume_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline text-sm"
                        >
                            View Current Resume
                        </a>
                    </div>
                )}
                
                <input
                    id="resume-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeSelect}
                    className="text-white"
                />
                {selectedResume && (
                    <span className="text-green-500 text-sm mt-1">{selectedResume.name}</span>
                )}
            </div>
            
            {selectedResume && (
                <Button onClick={handleUploadResume} className="w-full md:w-auto">
                    {currentProfile?.resume_url ? 'Update Resume' : 'Add Resume'}
                </Button>
            )}
        </div>

    </div>
  );
}

export default CreateProfile;
