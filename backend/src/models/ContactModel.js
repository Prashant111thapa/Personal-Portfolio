import dbConnection from "../../database/db.js";

class ContactModel {

    static async createContact(contactInfo) {
        try {
            const query = `INSERT INTO contact (name, email, subject, message, created_at)
                            VALUES(?,?,?,?, NOW())`;

            const [result] = await dbConnection.execute(query, 
                [
                    contactInfo.name,
                    contactInfo.email,
                    contactInfo.subject,
                    contactInfo.message || "",
                ]
            );

            return result.insertId ? { id: result.insertId, success: true } : null;
        } catch(err){
            throw err;
        }
    }

    static async markAsRead(contactId) {
        try {
            const query = 'UPDATE contact SET status=?  WHERE id=?';
            await dbConnection.execute(query, ['read', contactId]);

            const contacts = await dbConnection.execute('SELECT * FROM contact WHERE id=?', [contactId]);
            return contacts[0];
        } catch (err) {
            throw err;
        }
    }

    static async getAllContact() {
        try {
            const query = `SELECT * FROM contact 
                ORDER BY (status = 'unread') DESC, created_at DESC
                `;
            const [rows] = await dbConnection.execute(query);

            return rows.length > 0 ? rows : null;
        } catch (err) {
            throw err;
        }
    }

    static async getContactByStatus(msgStatus) {
        try {   
            const query = 'SELECT * FROM contact WHERE status=?';
            const [rows] = await dbConnection.execute(query, [msgStatus]);

            return rows.length > 0 ? rows : null;
        } catch (err) {
            throw err;
        }
    }

    static async deleteContactMessage(contactId) {
        try {
            const query = 'DELETE FROM contact WHERE id=?';
            const [rows] = await dbConnection.execute(query, [contactId]);

            return rows.affectedRows > 0;
        } catch (err) {
            throw err;
        }
    }

    static async findContactById(contactId){
        try{
            const query = 'SELECT * FROM contact WHERE id=?';
            const [rows] = await dbConnection.execute(query, [contactId]);

            return rows.length > 0 ? rows : null;
        } catch (err) {
            throw err;
        }
    }
}

export default ContactModel;