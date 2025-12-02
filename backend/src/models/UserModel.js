import dbConnection from "../../database/db.js";

class UserModel {
    
    static getProfileById = async (profileId) => {
        try {
            const query = 'SELECT * FROM profile WHERE id = ? LIMIT 1';
            const [rows] = await dbConnection.execute(query, [profileId]);
            if (rows.length > 0) return rows[0];
            return null;
        } catch (err) {
            throw err;
        }
    }

    static getUserByEmail = async (email) => {
        try{
            const query = 'SELECT * FROM user WHERE email=?';
            const [rows] = await dbConnection.execute(query, [email]);

            if(rows.length != 0){
                return rows[0];
            }
            return null;
        } catch (err) {
            throw err;
        }
    }

    static createProfile = async (profileData) => {
        try{
            const query = `
                INSERT INTO profile 
                (name, email, contact_no, location, role, avatar_url,
                about, education, interests, linkedin_url, github_url, resume_url, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

            const values = [
                profileData.name,
                profileData.email,
                profileData.contact_no || null,
                profileData.location || null,
                profileData.role || null,
                profileData.avatar_url || null,
                profileData.about || null,
                profileData.education || null,
                profileData.interests || null,
                profileData.linkedin_url || null,
                profileData.github_url || null,
                profileData.resume_url || null
            ];

            const [result] = await dbConnection.execute(query, values);

            if(result.insertId) {
                return { id: result.insertId, success: true };
            }
            return null;
        } catch(err) {
            throw err;
        }
    }

    static updateResume = async (resumePath) => {
        try{
            // const checkQuery = 'SELECT id FROM profile WHERE id=1';
            const checkQuery = 'SELECT 1 FROM profile LIMIT 1';
            const [existingProfile] = await dbConnection.execute(checkQuery);

            if(existingProfile.length === 0) {
                throw new Error("Profile not found. Please create profile first.")
            }

            const query = 'UPDATE profile SET resume_url=?, updated_at = NOW() LIMIT 1';
            const [result] = await dbConnection.execute(query, [resumePath]);



            return result.affectedRows > 0 ? resumePath : null;

        } catch(err) {
            throw err;
        }
    }
    
    static updateProfileAvatar = async (avatarPath) => {
        try{

            // const checkQuery = 'SELECT id FROM profile WHERE id=1';
            const checkQuery = 'SELECT 1 FROM profile LIMIT 1';
            const [existingProfile] = await dbConnection.execute(checkQuery);

            if(existingProfile.length === 0) {
                throw new Error('Profile not found. Please create profile first.');
            }

            const query = 'UPDATE profile SET avatar_url=?, updated_at=NOW() LIMIT 1';
            const [result] = await dbConnection.execute(query, [avatarPath]);

            return result.affectedRows > 0 ? avatarPath : null;
        } catch (err) {
            throw err;
        }
    }

    static getAllProfile = async () => {
        try {
            const query = 'SELECT * FROM profile';
            const [result] = await dbConnection.execute(query);

            if(result.length > 0) return result;
            return null;
        } catch (err) {
            throw err;
        }
    }

    static updateUserPassword = async (userId, password) => {
        try{
            const query = 'UPDATE user SET password = ? WHERE id = ?';
            const [rows] = await dbConnection.execute(query, [password, userId]);

            return rows.affectedRows > 0;
        } catch(err) {  
            throw err;
        }
    }

    static updateProfile = async (profileData, profileId) => {
        try {

            // const fields = [
            // "name", "email", "contact_no", "location", "role", "about",
            // "education", "interests", "linkedin_url", "github_url"
            // ];

            // fields.forEach(key => {
            //     if (profileData[key]) updated[key] = profileData[key];
            // });

            const updated = {};

           if(profileData.name) updated.name = profileData.name;
           if(profileData.email) updated.email = profileData.email;
           if(profileData.contact_no) updated.contact_no = profileData.contact_no;
           if(profileData.location) updated.location = profileData.location;
           if(profileData.role) updated.role = profileData.role;
           if(profileData.about) updated.about = profileData.about;
           if(profileData.education) updated.education = profileData.education;
           if(profileData.interests) updated.interests = profileData.interests;
           if(profileData.linkedin_url) updated.linkedin_url = profileData.linkedin_url;
           if(profileData.github_url) updated.github_url = profileData.github_url;

           if(Object.keys(updated).length === 0) return false;

           const setClause = Object.keys(updated).map(field => `${field}=?`).join(', ');
           const values = Object.values(updated);
           
            const query = `UPDATE profile SET ${setClause} WHERE id=?`;
            await dbConnection.execute(query, [...values, profileId]);

             const [rows] = await dbConnection.execute('SELECT * FROM profile WHERE id=?' , [profileId]);
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

}

export default UserModel;