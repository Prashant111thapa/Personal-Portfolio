import dbConnection from "../../database/db.js";

class SkillsModel {

    static async createSkill(skill) {
        try {
            const query = 'INSERT INTO skills (skill_name, skill_level) VALUES(?, ?)';
            const values = [
                skill.skill_name,
                skill.skill_level || ""
            ];

            const [result] = await dbConnection.execute(query, values);
            return result.insertId ? { id: result.insertId, success: true } : null;
        } catch(err) {
            throw err;
        }
    }

    static async updateSkill(skill, skillId) {
        try {
            const updated = {};

            if(skill.skill_name) updated.skill_name = skill.skill_name;
            if(skill.skill_level) updated.skill_level = skill.skill_level;

            if(Object.keys(updated).length === 0) return;

            const setClause = Object.keys(updated).map(field => `${field}=?`).join(", ");
            const values = Object.values(updated);
            const query = `UPDATE skills SET ${setClause} WHERE id=?`;
            await dbConnection.execute(query, [...values, skillId]);

            const [rows] = await dbConnection.execute('SELECT * FROM skills WHERE id =?', [skillId]);
            return rows.length > 0 ? rows[0] : null;
        } catch(err) {
            throw err;
        }
    }

    static async deleteSkill(skillId) {
        try {
            const query = 'DELETE FROM skills WHERE id=?';
            const [rows] = await dbConnection.execute(query, [skillId]);
            return rows.affectedRows > 0;
        } catch(err) {
            throw err;
        }
    }

    static async getSkillById(skillId) {
        try{
            const query = 'SELECT * FROM skills WHERE id=? LIMIT 1';
            const [result] = await dbConnection.execute(query, [skillId]);
            
            return result.length > 0 ? result[0] : null;
        } catch(err) {
            throw err;
        }
    }

    static async getAllSkills() {
        try{
            const query = 'SELECT * FROM skills';
            const [result] = await dbConnection.execute(query);

            return result.length > 0 ? result : null;
        } catch(err) {
            throw err;
        }
    }
}

export default SkillsModel;