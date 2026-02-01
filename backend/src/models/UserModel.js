import dbConnection from "../../database/db.js";
import axios from 'axios';
import { uploadProfile, uploadResumeFile, deleteProfile, deleteResumeFile } from "../utils/cloudinary.utils.js";

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

    static updateResume = async (file) => {
        try{
            const checkQuery = 'SELECT * FROM profile LIMIT 1';
            const [existingProfileRows] = await dbConnection.execute(checkQuery);

            if(existingProfileRows.length === 0) {
                throw new Error("Profile not found. Please create profile first.")
            }

            const profile = existingProfileRows[0];

            // upload to cloudinary
            const uploaded = await uploadReumeFile(file.buffer, file.originalname);

            // update DB with secure URL and metadata
            const query = `UPDATE profile SET resume_url=?, resume_public_id=?, resume_file_name=?, resume_file_size=?, updated_at = NOW() LIMIT 1`;
            const [result] = await dbConnection.execute(query, [
                uploaded.file_url,
                uploaded.public_id,
                uploaded.file_name,
                uploaded.file_size
            ]);

            return result.affectedRows > 0 ? uploaded : null;

        } catch(err) {
            throw err;
        }
    }
    
    static updateProfileAvatar = async (file) => {
        try{
            console.log("DEBUG: updateProfileAvatar called with file:", file.originalname);
            const checkQuery = 'SELECT * FROM profile LIMIT 1';
            const [existingProfileRows] = await dbConnection.execute(checkQuery);

            if(existingProfileRows.length === 0) {
                throw new Error('Profile not found. Please create profile first.');
            }

            const profile = existingProfileRows[0];
            console.log("DEBUG: Found profile:", profile.id);

            // Upload to Cloudinary
            console.log("DEBUG: Uploading to Cloudinary...");
            const uploaded = await uploadProfile(file.buffer, file.originalname);
            console.log("DEBUG: Cloudinary upload result:", uploaded);

            // Optionally delete previous cloud file if we had stored public_id
            if (profile.avatar_public_id) {
                console.log("DEBUG: Deleting old avatar from Cloudinary:", profile.avatar_public_id);
                try { await deleteProfile(profile.avatar_public_id); } catch(e) { /* ignore delete errors */ }
            }

            // Update DB with secure URL and metadata
            console.log("DEBUG: Updating database with Cloudinary metadata...");
            const query = `UPDATE profile SET avatar_url=?, avatar_public_id=?, avatar_file_name=?, avatar_file_size=?, updated_at=NOW() LIMIT 1`;
            const [result] = await dbConnection.execute(query, [
                uploaded.file_url,
                uploaded.public_id,
                uploaded.file_name,
                uploaded.file_size
            ]);
            
            console.log("DEBUG: Database update result:", result);
            console.log("DEBUG: Updated values:", {
                avatar_url: uploaded.file_url,
                public_id: uploaded.public_id,
                file_name: uploaded.file_name,
                file_size: uploaded.file_size
            });

            return result.affectedRows > 0 ? uploaded : null;
        } catch (err) {
            console.error("DEBUG: Error in updateProfileAvatar:", err);
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

    static viewResume = async (profile_id) => {
        const profile = await this.getProfileById(profile_id);
        
        if (!profile || !profile.resume_url) {
            throw new Error("File not found for this profile");
        }

        const cloudinaryUrl = profile.resume_url;
        const filename = profile.resume_file_name || `profile-${profile_id}.pdf`;

        try {
            const response = await axios.get(cloudinaryUrl, {
                responseType: "stream",
            });

            return {
                stream: response.data,
                filename: filename,
                contentType: response.headers["content-type"],
                contentLength: response.headers["content-length"],
                contentEncoding: response.headers["content-encoding"]
            };
        } catch (error) {
            console.error('Download stream error:', error);
            throw new Error("Failed to retrieve file from storage");
        }
    }

}

export default UserModel;