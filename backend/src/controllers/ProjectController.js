import ProjectModel from "../models/Projects.js";
import ProjectService from "../services/ProjectService.js";

class ProjectController {

    static async createProject(req, res) {
        try {
            const {
                title, tech_used, features, github_url,
                preview_url, overview, category, status,
            } = req.body;

            if(!title) return res.status(400).json({ success: false, message: "Title is requried."});
            if(!tech_used) return res.status(400).json({ success: false, message: "Please mention tech used."});
            if(!features) return res.status(400).json({ success: false, message: "Feature is requried."});

            let bannerPath = null;
            if(req.file) {
                bannerPath = `/uploads/project/${req.file.filename}`;
            }

            const projectData = {
                title, tech_used, features, github_url,
                preview_url, overview, category, status,
            };

            const sanitized = ProjectService.sanitizeProjectInput(projectData);

            const result = await ProjectModel.createProject(sanitized, bannerPath);
            if(!result.success) {
                return res.status(400).json({ status: false, message: "Failed to create project."});
            }

            return res.status(201).json({
                success: true,
                data: result,
                message: "Project created successfully."
            });
                
        } catch(err) {
            console.error("Error creating project", err);
            return res.status(500).json({ success: false, message: "Intenal Server Error"});
        }
    }

    static async getProjectById(req, res) {
        try {
            const id = req.params.id;

            if(!id || isNaN(id) || id < 1) {
                return res.status(400).json({ success: false, message: "Valid id is required."});
            }

            const result = await ProjectModel.getProjectById(id);
            if(!result){
                return res.status(400).json({ success: false, message: "Failed to find the project with given id."});
            }

            return res.status(200).json({
                success: true,
                data: result,
                message: "Project retireved successfully."
            });
        } catch(err) {
            console.error("Failed to retieve project with the given id.");
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }

    static async getAllProject(req, res) {
        try{
            const projects = await ProjectModel.getAllProjects();
            
            if(projects && projects.length > 0){
                return res.status(200).json({
                    success: true,
                    data: {
                        projects: projects,
                        count: projects.length
                    },
                    message: "Projects retieved successfully."
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    projects: [],
                    count: 0
                },
                message: "No projects are available."
            });
        } catch(err) {
            console.error("Failed to retieve projects.");
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }

    static async updateProject(req, res) {
        try {
            const projectId = req.params.id;
            const {
                title, tech_used, features, github_url,
                preview_url, overview, category, status
            } = req.body;

            // console.log('=== UPDATE PROJECT DEBUG ===');
            // console.log('Project ID:', projectId);
            // console.log('Request body:', req.body);
            // console.log('Status value:', status, 'Type:', typeof status);
            // console.log('All form data keys:', Object.keys(req.body));
            // console.log('===========================');

            if(!projectId || isNaN(projectId) || projectId < 1) {
                return res.status(400).json({ success: false, message: "Valid project id is required." });
            }

            if(!title) return res.status(400).json({ success: false, message: "Title is required."});
            if(!tech_used) return res.status(400).json({ success: false, message: "Please mention tech used."});
            if(!features) return res.status(400).json({ success: false, message: "Feature is required."});

            const projectExists = await ProjectModel.getProjectById(projectId);
            if(!projectExists) {
                return res.status(404).json({ success: false, message: "Project not found." });
            }

            // Check if new banner image is uploaded
            let bannerPath = null;
            if(req.file) {
                bannerPath = `/uploads/project/${req.file.filename}`;
            }

            const projectData = {
                title, tech_used, features, github_url,
                preview_url, overview, category, status
            };

            // Add image_url only if new image is uploaded
            if(bannerPath) {
                projectData.image_url = bannerPath;
            }

            const sanitized = ProjectService.sanitizeProjectInput(projectData);

            const result = await ProjectModel.updateProject(sanitized, projectId);
            if(!result) {
                return res.status(400).json({ success: false, message: "Failed to update project." });
            }

            return res.status(200).json({
                success: true,
                data: result,
                message: "Project updated successfully."
            });

        } catch(err) {
            console.error("Failed to update project.", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }

    static async deleteProject(req, res) {
        try {
            const projectId = req.params.id;

            if(!projectId || isNaN(projectId) || projectId < 1){
                return res.status(400).json({ success: false, message: "Valid project id is required." });
            }

            const result = await ProjectModel.deleteProject(projectId);
            if(!result) {
                return res.status(400).json({ success: false, message: "Failed to delete project." });
            }

            return res.status(200).json({
                success: true,
                message: "Project deleted successfully."
            });
        } catch(err) {
            console.error("Failed to delete project.");
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }
} 


export default ProjectController;