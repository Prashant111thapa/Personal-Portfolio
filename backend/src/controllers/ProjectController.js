import ProjectModel from "../models/Projects.js";
import ProjectService from "../services/ProjectService.js";

class ProjectController {

    static async createProject(req, res) {
        console.log("=== PROJECT CONTROLLER createProject called ===");
        console.log("Headers:", req.headers['content-type']);
        console.log("Body:", req.body);
        console.log("File:", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        } : 'No file received');
        console.log("================================================");

        try {
            const {
                title, tech_used, features, github_url,
                preview_url, overview, category, status,
            } = req.body;

            if(!title) return res.status(400).json({ success: false, message: "Title is requried."});
            if(!tech_used) return res.status(400).json({ success: false, message: "Please mention tech used."});
            if(!features) return res.status(400).json({ success: false, message: "Feature is requried."});

            const bannerFile = req.file || null;

            const projectData = {
                title, tech_used, features, github_url,
                preview_url, overview, category, status,
            };

            const sanitized = ProjectService.sanitizeProjectInput(projectData);

            const result = await ProjectModel.createProject(sanitized, bannerFile);
            if(!result) {
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
            const bannerFile = req.file || null;
            console.log("Banner file: ", bannerFile);
            console.log("CRITICAL: Banner file received?", bannerFile ? 'YES' : 'NO');
            if (bannerFile) {
                console.log("CRITICAL: Banner details:", {
                    fieldname: bannerFile.fieldname,
                    originalname: bannerFile.originalname,
                    size: bannerFile.size,
                    mimetype: bannerFile.mimetype
                });
            } else {
                console.log("CRITICAL: No banner file - should NOT set image_url!");
            }
            const projectData = {
                title, tech_used, features, github_url,
                preview_url, overview, category, status
            };

            // Add image_url only if new image is uploaded (model will handle cloud upload)
            // if(bannerFile) {
            //     projectData.image_url = null;
            // }

            const sanitized = ProjectService.sanitizeProjectInput(projectData);

            const result = await ProjectModel.updateProject(sanitized, projectId, bannerFile);
            if(!result) {
                return res.status(400).json({ success: false, message: "Failed to update project." });
            }

            console.log("CONTROLLER: Final result:", result ? 'Success' : 'Failed');

            return res.status(200).json({
                success: true,
                data: result,
                message: `Project ${bannerFile ? 'and banner ' : ''}updated successfully.`
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

    static async uploadBanner(req, res) {
        try {
            const projectId = req.params.id;
            console.log("Project Id: ", projectId);
        
            
            if(!projectId || isNaN(projectId) || projectId < 1) {
                return res.status(400).json({ success: false, message: "Valid project id is required." });
            }

            const file = req.file;
            if(!file) {
                return res.status(400).json({ success: false, message: "No banner file uploaded" });
            }
            console.log("Req file in project banner:", req.file);

            const updated = await ProjectModel.uploadProjectBanner(projectId, file);
            if(!updated) {
                return res.status(400).json({ success: false, message: "Failed to upload project banner" });
            }
            console.log("Updated", updated);

            return res.status(200).json({
                success: true,
                data: {
                    banner_url: updated.file_url,
                    filename: updated.file_name,
                    public_id: updated.file_public_id
                },
                message: "Project banner uploaded successfully"
            });
        } catch(err) {
            console.error("Error uploading project banner:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }
} 


export default ProjectController;