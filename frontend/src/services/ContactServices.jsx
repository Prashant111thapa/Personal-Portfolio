import api from "./api";

class ContactServices{

    static async createContact(contactInfo) {
        try{
            const response = await api.post("/contact/create", contactInfo);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async getAllContactMsg() {
        try{
            const response = await api.get("/contact/contacts");
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async getContactByStatus(status) {
        try{
            const response = await api.get(`/contact/${status}`);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async markContactAsRead(contactId) {
        try{
            const response = await api.patch(`/contact/${contactId}`);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static async deleteContact (contactId) {
        try{
            const response = await api.delete(`/contact/${contactId}`);
            return response.data;
        } catch(err) {
            throw this.handleError(err);
        }
    }

    static handleError(err) {
        if(err.response){
            // Server responded with error status
            return {
                message: err.response.data?.message || `Server error (${err.response.status})`,
                data: err.response?.data,
                status: err.response.status
            }
        } else if(err.request) {
            // Network error
            return {
                message: "Network error. Please check your connection and try again.",
                status: 0
            }
        } else {
            // Other errors
            return {
                message: err.message || "An unexpected error occurred",
                status: -1
            }
        }
    }

}

export default ContactServices;