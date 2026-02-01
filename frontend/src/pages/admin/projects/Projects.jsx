import React, { useState } from 'react'
import ProjectForm from './ProjectForm';
import UseProjects from '../../../hooks/UseProjects';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Button from '../../../components/shared/Button';

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'

  const {
    formData, 
    handleInputChange, 
    handleImageSelect,
    errors, 
    loading, 
    selectedImage, 
    imagePreview,
    createProject, 
    updateProject, 
    uploadProjectBanner,
    deleteProject,
    isUpdate, 
    handleRemoveImage,
    projects,
    handleUpdateClick,
    loadProjects,
    resetForm
  } = UseProjects();

  const handleAddProject = () => {
    resetForm(); // Reset form data for new project
    setCurrentView('form');
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    handleUpdateClick(project);
    setCurrentView('form');
    setShowForm(true);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setShowForm(false);
    // Reset form data when going back
    loadProjects();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (isUpdate) {
      success = await updateProject(e);
    } else {
      success = await createProject(e);
    }
    
    // If successful, go back to list
    if (success) {
      handleBackToList();
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      'completed': { label: 'Completed', color: 'text-green-500 bg-green-500/10' },
      'pending': { label: 'Pending', color: 'text-yellow-500 bg-yellow-500/10' },
      'not-started': { label: 'Not Started', color: 'text-red-500 bg-red-500/10' }
    };
    
    const statusInfo = statusMap[status] || { label: status, color: 'text-gray-500 bg-gray-500/10' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (currentView === 'form') {
    return (
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {isUpdate ? 'Update Project' : 'Add New Project'}
          </h1>
          <Button
            onClick={handleBackToList}
            className="bg-gray-600 hover:bg-gray-700 w-full sm:w-auto"
          >
            Back to Projects
          </Button>
        </div>
        
        <div className='w-full flex items-center justify-center py-4 sm:py-7 px-3 sm:px-6'>
          <ProjectForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageSelect={handleImageSelect}
            handleRemoveImage={handleRemoveImage}
            errors={errors}
            loading={loading}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            createProject={handleFormSubmit}
            updateProject={handleFormSubmit}
            uploadProjectBanner={uploadProjectBanner}
            isUpdate={isUpdate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Projects Management</h1>
        <Button
          onClick={handleAddProject}
          className="bg-[#FD6F00] hover:bg-[#FD6F00]/80 text-white flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Project
        </Button>
      </div>

      {/* Projects Table */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#FD6F00]/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD6F00]"></div>
            <p className="mt-2">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-lg mb-4">No projects found</p>
            <Button
              onClick={handleAddProject}
              className="bg-[#FD6F00] hover:bg-[#FD6F00]/80 text-white"
            >
              <Plus size={16} className="mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#2a2a2a] border-b border-[#FD6F00]/20">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    SN.
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider hidden lg:table-cell">
                    Tech Used
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FD6F00]/10">
                {projects.map((project, index) => (
                  <tr key={project.id} className="hover:bg-[#FD6F00]/5 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-white">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(project.file_url || project.image_url) && (
                          <img 
                            src={(project.file_url || project.image_url).startsWith('http') ? (project.file_url || project.image_url) : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${(project.file_url || project.image_url)}`}
                            alt={project.title}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover mr-2 sm:mr-3"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-white truncate max-w-[120px] sm:max-w-none">{project.title}</div>
                          {project.overview && (
                            <div className="text-xs text-gray-400 truncate max-w-[100px] sm:max-w-xs">
                              {project.overview.substring(0, 30)}{project.overview.length > 30 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-white hidden sm:table-cell">
                      {project.category || 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      {formatStatus(project.status)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white max-w-xs hidden lg:table-cell">
                      <div className="truncate" title={project.tech_used}>
                        {project.tech_used || 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-1.5 sm:p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit project"
                        >
                          <Edit size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(project)}
                          className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete project"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        {project.preview_url && (
                          <a
                            href={project.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 sm:p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-colors"
                            title="View project"
                          >
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Statistics */}
      {projects.length > 0 && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#1a1a1a] border border-[#FD6F00]/30 rounded-lg p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Total Projects</h3>
            <p className="text-lg sm:text-2xl font-bold text-white">{projects.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-green-500/30 rounded-lg p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Completed</h3>
            <p className="text-lg sm:text-2xl font-bold text-green-500">
              {projects.filter(p => p.status === 'completed').length}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-lg p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Pending</h3>
            <p className="text-lg sm:text-2xl font-bold text-yellow-500">
              {projects.filter(p => p.status === 'pending').length}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-red-500/30 rounded-lg p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Not Started</h3>
            <p className="text-lg sm:text-2xl font-bold text-red-500">
              {projects.filter(p => p.status === 'not-started').length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects;
