import dbConnection from "../../database/db.js";
import { deleteProjectBanner, uploadProjectBanner } from "../utils/cloudinary.utils.js";

class ProjectModel{

    static async getAllProjects() {
        try {
            const query = 'SELECT * FROM projects';
            const [result] = await dbConnection.execute(query);
            
            if (result.length > 0) {
                // Prioritize Cloudinary URLs over local paths
                return result.map(project => ({
                    ...project,
                    // If we have Cloudinary URL, use it; otherwise use image_url (but prefer null over local paths)
                    display_image: project.file_url || (project.image_url && project.image_url.startsWith('http') ? project.image_url : null),
                    // Keep original fields for compatibility
                    image_url: project.file_url || project.image_url
                }));
            }
            
            return null;
        } catch (err) {
            throw err;
        }
    }

    static async createProject (
        projectData, 
        banner
    ) {
        try {
            console.log("=== createProject DEBUG ===");
            console.log("Project data:", projectData);
            console.log("Banner file:", banner ? {
                fieldname: banner.fieldname,
                originalname: banner.originalname,
                mimetype: banner.mimetype,
                size: banner.size,
                buffer: banner.buffer ? `Buffer(${banner.buffer.length} bytes)` : 'No buffer'
            } : 'No banner file');
            console.log("============================");

            const query = `INSERT INTO projects (title, tech_used, features, github_url, preview_url,
                            overview, category, status) VALUES (?,?,?,?,?,?,?,?)`;
            const values = [
                    projectData.title,
                    projectData.tech_used,
                    projectData.features,
                    projectData.github_url || null,
                    projectData.preview_url || null,
                    projectData.overview || null,  
                    projectData.category || null,
                    projectData.status || null,
                ];

            const [result] = await dbConnection.execute(query, values);

            const insertId = result.insertId;
            console.log("Project inserted with ID:", insertId);

            if (banner && insertId) {
                try {
                    console.log("Attempting to upload banner to Cloudinary...");
                    const uploadedResult = await uploadProjectBanner(banner.buffer, banner.originalname);
                    console.log("Cloudinary upload result:", uploadedResult);
                    
                    await this.updateFile(insertId, {
                        file_name: uploadedResult.file_name,
                        file_size: uploadedResult.file_size,
                        file_public_id: uploadedResult.public_id,
                        file_url: uploadedResult.file_url
                    });
                    console.log("File metadata updated in database");
                } catch (err) {
                    console.error("Error uploading project banner during creation:", err);
                    throw err;
                }
            }

            const project = await this.getProjectById(insertId);
            if(!project) {
                throw new Error("Failed to create project")
            }
            return project;
        } catch (err) {
            throw err;
        }
    }

    // static async uploadProjectBanner(bannerPath, projectId){
    //     try {
    //         const query = 'UPDATE projects SET image_url=? WHERE id=?';
    //         const [result] = await dbConnection.execute(query, [bannerPath, projectId]);
    //         return result.affectedRows > 0 ? result : null;
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    static async uploadProjectBanner(
        project_id,
        file
    ) {
        console.log("DEBUG: uploadProjectBanner called for project:", project_id);
        const project = await this.getProjectById(project_id);
        if(!project) {
            throw new Error("Project not found");
        }

        console.log("DEBUG: Found project:", project.title);

        if(project.file_public_id) {
            console.log("DEBUG: Deleting old banner from Cloudinary:", project.file_public_id);
            await deleteProjectBanner(project.file_public_id);
        }

        try {
            console.log("DEBUG: Uploading banner to Cloudinary...");
            const result = await uploadProjectBanner(file.buffer, file.originalname);
            console.log("DEBUG: Cloudinary upload result:", result);

            console.log("DEBUG: Updating project database with Cloudinary metadata...");
            const updatedProject = await this.updateFile(project.id, {
                file_public_id: result.public_id,
                file_name: result.file_name,
                file_size: result.file_size,
                file_url: result.file_url
            });

            console.log("DEBUG: Final updated project data:", updatedProject);
            
            if (!updatedProject) {
                throw new Error("Failed to update project with Cloudinary metadata");
            }
            
            return updatedProject;
        } catch (err) {
            console.error("DEBUG: Error uploading project banner:", err);
            throw err;
        }
    }
        

    static async getProjectById(projectId) {
        try {
            const query = 'SELECT * FROM projects WHERE id=?';
            const [rows] = await dbConnection.query(query, [projectId]);

            if (rows.length > 0) {
                const project = rows[0];
                // Prioritize Cloudinary URLs over local paths
                return {
                    ...project,
                    // If we have Cloudinary URL, use it; otherwise use image_url (but prefer null over local paths)
                    display_image: project.file_url || (project.image_url && project.image_url.startsWith('http') ? project.image_url : null),
                    // Keep original fields for compatibility
                    image_url: project.file_url || project.image_url
                };
            }

            return null;
        } catch(err) {
            throw err;
        }
    }

    static async updateFile(id, fileData) {
        console.log("Updating file for", id);
        console.log("File data for updating file; ", fileData);
        try {
            const sql = `
              UPDATE projects
                SET file_public_id=?, file_name=?, file_size=?, file_url=?
                WHERE id=?
            `;
            const [result] = await dbConnection.execute(sql, [
                fileData.file_public_id,
                fileData.file_name,
                fileData.file_size,
                fileData.file_url,
                id
            ]);
            
            console.log("Database update result:", result);
            
            // Return the updated project data
            const updatedProject = await this.getProjectById(id);
            console.log("Updated project after database update:", updatedProject);
            return updatedProject;
        } catch (err) {
            console.error("Error in updateFile:", err);
            throw err;
        }
    }

    static async updateProject(projectData, projectId, banner = null ) {
        try {
            const updated = {};

            // console.log('=== MODEL UPDATE DEBUG ===');
            // console.log('Project ID:', projectId);
            // console.log('Project Data:', projectData);
            // console.log('Status in projectData:', projectData.status, 'Type:', typeof projectData.status);

            const fields = [
                "title", "tech_used", "features", "github_url",
                "preview_url", "overview", "category", "status"
            ];
            // NEVER include "image_url" - force Cloudinary usage only

            fields.forEach(key => {
                if(projectData[key] !== undefined && projectData[key] !== null) {
                    updated[key] = projectData[key];
                    console.log(`Added to update: ${key} = '${projectData[key]}'`);
                }
            });

            // console.log('Final update object:', updated);
            // console.log('==========================')

            if(Object.keys(updated).length === 0 && !banner) return;

            // Update text fields if any
            if(Object.keys(updated).length > 0) {
                const setClause = Object.keys(updated).map(field => `${field}=?`).join(", ");
                const values = Object.values(updated);

                const query = `UPDATE projects SET ${setClause} WHERE id=?`;
                await dbConnection.execute(query, [...values, projectId]);
            }
            
            // If a new banner file is provided, upload and replace existing banner
            if (banner) {
                const updatedWithBanner = await this.uploadProjectBanner(projectId, banner);
                return updatedWithBanner;
            }

            const [updatedProject] = await dbConnection.execute('SELECT * FROM projects WHERE id=?', [projectId]);
            return updatedProject[0];
        } catch(err) {
            throw err;
        }
    }

    static async deleteProjectBanner(project_id) {
        try {
            const query = 'UPDATE projects SET file_name=NULL, file_url=NULL, file_public_id=NULL, file_size=NULL WHERE id=?';
            await dbConnection.execute(query, [project_id]);
            const project = await this.getProjectById(project_id);
            return project;
        } catch (err) {
            console.log("Error deleting project banner");
            throw err;
        }
    }

    static async deleteProject(projectId) {
        try {
            // Get project details to delete associated files from Cloudinary
            const project = await this.getProjectById(projectId);
            if (project && project.file_public_id) {
                try {
                    await deleteProjectBanner(project.file_public_id);
                } catch (err) {
                    console.warn("Failed to delete project banner from Cloudinary:", err);
                    // Continue with database deletion even if Cloudinary deletion fails
                }
            }

            const query = 'DELETE FROM projects WHERE id=?';
            const [result] = await dbConnection.execute(query, [projectId]);

            return result.affectedRows > 0;
        } catch(err) {
            throw err;
        }
    }
}

export default ProjectModel;