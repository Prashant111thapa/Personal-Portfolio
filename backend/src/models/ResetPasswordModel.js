import dbConnection from "../../database/db.js";

class ResetPasswordModel {
    
    static async createResetCode(userId, code, expiresAt) {
        try {
            const query = 'INSERT INTO reset_password (user_id, code, expires_at) VALUES(?, ?, ?)';
            const [result] = await dbConnection.execute(query, [userId, code, expiresAt]);
            return result.insertId ? { id: result.insertId } : null;
        } catch(err) {
            throw err;
        }
    }

    static async invalidateExistingCodes(userId) {
        try {
            const query = 'UPDATE reset_password SET used = TRUE WHERE user_id = ? AND used = FALSE';
            const [rows] = await dbConnection.execute(query, [userId]);
            return rows.affectedRows > 0;
        } catch(err) {
            throw err;
        }
    }

    static async findValidCode(code) {
        try {
            const query = `
                SELECT rp.*, u.email, u.id as user_id 
                FROM reset_password rp 
                JOIN user u ON rp.user_id = u.id 
                WHERE rp.code = ? AND rp.used = FALSE AND rp.expires_at > NOW()
            `;
            const [rows] = await dbConnection.execute(query, [code]);
            return rows.length > 0 ? rows[0] : null;
        } catch(err) {
            throw err;
        }
    }

    static async markCodeAsUsed(code) {
        try {
            const query = 'UPDATE reset_password SET used = TRUE WHERE code = ?';
            const [rows] = await dbConnection.execute(query, [code]);
            return rows.affectedRows > 0;
        } catch(err) {
            throw err;
        }
    }

    static async deleteExpiredCodes() {
        try {
            const query = 'DELETE FROM reset_password WHERE expires_at < NOW()';
            const [rows] = await dbConnection.execute(query);
            return rows.affectedRows;
        } catch(err) {
            throw err;
        }
    }
    
}

export default ResetPasswordModel;