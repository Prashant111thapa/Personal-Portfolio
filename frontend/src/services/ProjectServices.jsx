import api from "./api";

class ProjectServices {

    static async getAllProjects () {
        try {
            const response = await api.get("/project/");
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async getProjectById (projectId) {
        try {
            const response = await api.get(`/project/${projectId}`);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async createProject (projectData) {
        try {
            // Check if projectData is FormData (for file uploads)
            const isFormData = projectData instanceof FormData;
            
            const response = await api.post("/project/create", projectData, {
                headers: isFormData ? {
                    'Content-Type': 'multipart/form-data'
                } : {}
            });
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async updateProject (projectId, projectData) {
        try {
            // Check if projectData is FormData (for file uploads)
            const isFormData = projectData instanceof FormData;
            console.log("is formdata", isFormData);
            console.log("Project id: ", projectId);
            console.log("Project data frontend:  ", projectData);
            
            const response = await api.patch(`/project/${projectId}`, projectData, {
                headers: isFormData ? {
                    'Content-Type': 'multipart/form-data'
                } : {}
            });
            console.log("resposne: ", response.data);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async deleteProject (projectId) {
        try {
            const response = await api.delete(`/project/${projectId}`);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }
    static async uploadProjectBanner(projectId, bannerFile) {
        try {
            const formData = new FormData();
            formData.append('banner', bannerFile);
            const response = await api.post(
                `/project/upload-banner/${projectId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }
    static handleError(err) {
        if(err.response) {
            return {
                message: err.response.data?.message || "An error occurred",
                status: err.response.status,
                data: err.response.data
            }
        } else if(err.request) {
            return {
                message: "Please check your internet connection and try again!",
                status: 0
            }
        }

        if(err) {
           return {
                message: "An unexpected error occurred",
                status: -1
            } 
        }
    }

} 

export default ProjectServices;