import dbConnection from "../../database/db.js";

class ProjectModel{

    static async getAllProjects() {
        try {
            const query = 'SELECT * FROM projects';
            const [result] = await dbConnection.execute(query);
            return result.length > 0 ? result : null;
        } catch (err) {
            throw err;
        }
    }

    static async createProject (projectData, bannerPath) {
        try {
            const query = `INSERT INTO projects (title, tech_used, features, github_url, preview_url,
                            overview, category, image_url, status) VALUES (?,?,?,?,?,?,?,?,?)`;

            const values = [
                    projectData.title,
                    projectData.tech_used,
                    projectData.features,
                    projectData.github_url || null,
                    projectData.preview_url || null,
                    projectData.overview || null,  
                    projectData.category || null,
                    bannerPath || null,
                    projectData.status || null,
                ];
            const [result] = await dbConnection.execute(query, values);
            return result.insertId ? { id: result.insertId, success: true } : null;
        } catch (err) {
            throw err;
        }
    }

    static async uploadProjectBanner(bannerPath, projectId){
        try {
            const query = 'UPDATE projects SET image_url=? WHERE id=?';
            const [result] = await dbConnection.execute(query, [bannerPath, projectId]);
            return result.affectedRows > 0 ? result : null;
        } catch (err) {
            throw err;
        }
    }

    static async getProjectById(projectId) {
        try {
            const query = 'SELECT * FROM projects WHERE id=?';
            const [rows] = await dbConnection.execute(query, [projectId]);

            return rows.length > 0 ? rows[0] : null;
        } catch(err) {
            throw err;
        }
    }

    static async updateProject(projectData, projectId ) {
        try {
            const updated = {};

            // console.log('=== MODEL UPDATE DEBUG ===');
            // console.log('Project ID:', projectId);
            // console.log('Project Data:', projectData);
            // console.log('Status in projectData:', projectData.status, 'Type:', typeof projectData.status);

            const fields = [
                "title", "tech_used", "features", "github_url",
                "preview_url", "overview", "category", "image_url", "status"
            ];

            fields.forEach(key => {
                if(projectData[key] !== undefined && projectData[key] !== null) {
                    updated[key] = projectData[key];
                    console.log(`Added to update: ${key} = '${projectData[key]}'`);
                }
            });

            // console.log('Final update object:', updated);
            // console.log('==========================')

            if(Object.keys(updated).length === 0) return;

            const setClause = Object.keys(updated).map(field => `${field}=?`).join(", ");
            const values = Object.values(updated);

            const query = `UPDATE projects SET ${setClause} WHERE id=?`;
            await dbConnection.execute(query, [...values, projectId]);
            
            const [updatedProject] = await dbConnection.execute('SELECT * FROM projects WHERE id=?', [projectId]);

            return updatedProject[0];
        } catch(err) {
            throw err;
        }
    }

    static async deleteProject(projectId) {
        try {
            const query = 'DELETE FROM projects WHERE id=?';
            const result = await dbConnection.execute(query, [projectId]);

            return result.affectedRows > 0;
        } catch(err) {
            throw err;
        }
    }
}

export default ProjectModel;