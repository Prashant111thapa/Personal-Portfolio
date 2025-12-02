import ContactModel from "../models/ContactModel.js";
import AuthService from "../services/AuthService.js";

class ContactController {

    static async createContact(req, res) {
        try {
            const { name, email, subject, message } = req.body;

            if(!name) return res.status(400).json({ success: false, message: "Name is required" });
            if(!email) return res.status(400).json({ success: false, message: "Email is required" });
            if(!subject) return res.status(400).json({ success: false, message: "Subject is required" });

            const validateEmail = AuthService.validateEmail(email);
            if(!validateEmail.success) return res.status(400).json({ success: false, message: validateEmail.message });

            const sanitizedName = name.toString().trim().replace(/\s+/g, ' ');
            const sanitizedEmail = email.toString().trim().replace(/\s+/g, ' ');
            const sanitizedSubject = subject.toString().trim().replace(/\s+/g, ' ');
            let sanitizedMessage = null;
            if(message) sanitizedMessage = message.toString().trim().replace(/\s+/g, ' ');
            console.log("Sanitized message", sanitizedMessage);

            const contactInfo = {
                name: sanitizedName,
                email: sanitizedEmail,
                subject: sanitizedSubject,
                message: sanitizedMessage || null
            }

            const newContactMsg = await ContactModel.createContact(contactInfo);
            if(!newContactMsg) return res.status(400).json({ success: false, message: "Failed to send inquiry." });

            return res.status(201).json({
                success: true,
                data: newContactMsg,
                message: "Inquiry send successfully."
            });
        } catch (err) {
            console.log("Error creating contact messgae.", err);
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }
    }

    static async getAllContactMessages(req, res) {
        try {
            const result = await ContactModel.getAllContact();
            return res.status(200).json({
                success: true,
                data: {
                    contactMessages: result,
                    count: result.length
                }
            });
        } catch (err) {
            console.log("Error fetching all contact messgaes.");
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }
    }

    static async getContactByStatus(req, res) {
        try {
            const status = req.params.status;
            if(!status || !['read', 'unread'].includes(status.toLowerCase())){
                return res.status(400).json({ success: false, message: "Invalid status filter." });
            }

            const result = await ContactModel.getContactByStatus(status.toLowerCase());
            console.log("Status filter result", result);
            return res.status(200).json({
                success: true,
                data: {
                    contacts: result,
                    count: result.length
                },
                message: "Status filtered successfully"
            });
        } catch (err) {
            console.log("Error filtering by status");
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }
    }

    static async markContactAsRead(req, res) {
        try {
            const contactId = req.params.id;
            if(!contactId || isNaN(contactId) || contactId < 1){
                return res.status(400).json({ success: false, message: "Invalid contact id." });
            }

            const result = await ContactModel.markAsRead(contactId);
            if(!result) {
                return res.status(400).json({ success: false, message: "Failed to mark the contact as read" });
            }

            return res.status(200).json({
                success: true,
                data: result,
                message: "Contact marked read successfully"
            });
        } catch (err) {
            console.log("Error marking contact as read");
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }
    }

    static async deleteContactMessage(req, res) {
        try {
            const contactId = req.params.id;
            if(!contactId || isNaN(contactId) || contactId < 1){
                return res.status(400).json({ success: false, message: "Invalid contact id." });
            }

            const contactExists = await ContactModel.findContactById(contactId);
            if(!contactExists){
                return res.status(404).json({ success: false, message: "Contact Message not found."});
            }

            const result = await ContactModel.deleteContactMessage(contactId);
            if(!result) {
                return res.status(400).json({ success: false, message: "Failed to delete contact message"});
            }

            return res.status(200).json({
                success: true,
                message: "Contact message deleted successfully"
            })
        } catch(err) {
            console.log("Error deleting contact message", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }
}

export default ContactController;