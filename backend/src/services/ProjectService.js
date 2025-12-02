class ProjectService {
    
    static sanitizeProjectInput (projectData) {
        const sanitized = {};
        if(projectData.title) sanitized.title = projectData.title.toString().trim().replace(/\s+/g, ' ');
        if(projectData.tech_used) sanitized.tech_used = projectData.tech_used.toString().trim().replace(/\s+/g, ' ');
        if(projectData.features) sanitized.features = projectData.features.toString().trim().replace(/\s+/g, ' ');
        if(projectData.github_url) sanitized.github_url = this.sanitizeURL(projectData.github_url);
        if(projectData.preview_url) sanitized.preview_url = this.sanitizeURL(projectData.preview_url);
        if(projectData.overview) sanitized.overview = projectData.overview.toString().trim().replace(/\s+/g, ' ');
        if(projectData.category) sanitized.category = projectData.category.toString().trim().replace(/\s+/g, ' ');
        if(projectData.status) sanitized.status = projectData.status.toString().trim();
        if(projectData.image_url) sanitized.image_url = projectData.image_url.toString().trim();

        return sanitized;
    }

    static sanitizeURL(url) {
        if(!url) return;

        let sanitizedURL = url.toString().trim();

        if(sanitizedURL && !sanitizedURL.match(/^https?:\/\//)){
            sanitizedURL = 'https://' + sanitizedURL;
        }

        return sanitizedURL;
    }
}

export default ProjectService;