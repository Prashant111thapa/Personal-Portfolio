import api from "./api";

class AuthService{

    static async getUserByEmail (email) {
        try {
            const response = await api.post("/auth/email", { email });
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async createProfile (profileInfo) {
        try{
            const response = await api.post('/auth/profile/create', profileInfo);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    static async getAllProfile() {
        try{
            const response = await api.get("/auth/profile");
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async uploadProfileAvatar(avatarFile) {
        try{
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            const response = await api.post(
                "/auth/profile/upload-avatar",
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async uploadResume(resumeFile) {
        try{
            const formData = new FormData();
            formData.append('resume', resumeFile);
            const response = await api.post(
                "/auth/profile/upload-resume",
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async updateProfile(profileInfo, profileId) {
        try {
            const response = await api.patch(`/auth/profile/${profileId}`, profileInfo);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    //  Password Reset methods
    static async requestPasswordReset  (email) {
        try {
            const response = await api.post("/auth/request-reset", {email});
            return response.data;
        } catch(err) {
           throw this.handleError(err);
        }
    }   

    static async resetPassword(code, newPassword) {
        try {
            const response = await api.post("/auth/reset-password", { code, newPassword });
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async verifyResetCode(code) {
        try {
            const response = await api.get(`/auth/verify-code/${code}`);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static handleError(err){
        if(err.response){
            return {
                message: err.response.data?.message || "An error occurred",
                status: err.response.status,
                data: err.response.data
            };
        } else if(err.request){
            return {
                message: "Network error - please check your internet connection",
                status: 0
            };
        } else{
            return {
                message: err.message || "An unexpected error occurred",
                status: -1
            };
        }
    }


}

export default AuthService;