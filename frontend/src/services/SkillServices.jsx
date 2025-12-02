import api from "./api";

class SkillServices {
    static async createSkill(skillData) {
        try {
            const response = await api.post("/skill/create", skillData);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async updateSkill(skillData, skillId) {
        try {
            const response = await api.patch(`/skill/${skillId}`, skillData);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async deleteSkill(skillId) {
        try {
            const response = await api.delete(`/skill/${skillId}`);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async getAllSkills() {
        try {
            const response = await api.get("/skill/skills");
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    static handleError(err) {
        if(err.response) {
            return {
                message: err.response.data?.message || "An error occurred",
                staus: err.response.status,
                data: err.response.data
            }
        } else if(err.request) {
            return {
                message: "Network error. Please check your internet connection and try again.",
                status: 0
            }
        } else {
            return {
                message: "An unexpected error occurred.",
                status: -1
            }
        }
    }

}

export default SkillServices;