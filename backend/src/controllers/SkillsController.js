import SkillsModel from "../models/SkillsModel.js";
import AuthService from "../services/AuthService.js";

class SkillsController {

    static async createSkill(req, res) {
        try {
            const { skill_name, skill_level } = req.body;

            if(!skill_name) {
                return res.status(400).json({ success: false, message: "Skill name is required."});
            }

            const skillData = {
                skill_name: skill_name.toString().trim().replace(/\s+/g, " "), 
                skill_level: skill_level.toString().trim().replace(/\s+/g, " "),
            };

            const newSkill = await SkillsModel.createSkill(skillData);
            if(!newSkill){
                return res.status(400).json({ success: false, message: "Failed to create skill."});
            }

            return res.status(201).json({ 
                success: true, 
                data: newSkill,
                message: "Skill created successfully." });
        } catch(err) {
            console.log("Error creating skill.", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }

    static async updateSkill(req, res) {
        try {
            const skillId = req.params.id;
            const { skill_name, skill_level } = req.body;

            if(!skillId || isNaN(skillId) || skillId < 1) {
                return res.status(400).json({ success: false, message: "Valid skill id is required." });
            }

            if(!skill_name) {
                return res.status(400).json({ success: false, message: "Skill name is required. " });
            }

            const skillExists = await SkillsModel.getSkillById(skillId);
            if(!skillExists) {
                return res.status(404).status({ success: false, message: "Skill doesn't exist."});
            }

            const updateData = {
                skill_name: skill_name.toString().trim().replace(/\s+/g, " "),
                skill_level: skill_level.toString().trim().replace(/\s+/g, " ")
            }
            
            const updatedSkill = await SkillsModel.updateSkill(updateData, skillId);
            if(!updatedSkill) {
                return res.status(400).json({ success: false, message: "Failed to updated skill. "});
            }

            return res.status(200).json({
                success: true,
                data: updatedSkill,
                message: "Skill updated successfully."
            });

        } catch(err) {
            console.log("Error updating skill.", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }

    static async deleteSkill(req, res) {
        try {
            const skillId = req.params.id;
            if(!skillId || isNaN(skillId) || skillId < 1) {
                return res.status(400).json({ success: false, message: "Valid skill id is required." });
            }

            const skillExists = await SkillsModel.getSkillById(skillId);
            if(!skillExists) {
                return res.status(404).status({ success: false, message: "Skill doesn't exist."});
            }

            const result = await SkillsModel.deleteSkill(skillId);
            if(!result) {
                return res.status(400).json({ success: false, message: "Failed to delete skill. "});
            }

            return res.status(200).json({ success: true, message: "Skill deleted successfully."});
        } catch(err) {
            console.log("Error deleting skill.", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }

    static async getAllSkills(_req, res) {
        try {
            const allSkills = await SkillsModel.getAllSkills();
            res.status(200).json({
                success: true,
                data: {
                    skills: allSkills,
                    count: allSkills.length
                },
                message: "Skills fetched successfully."
            })
        } catch(err){ 
            console.error("Error fetching all skills.", err);

        }
    }

}

export default SkillsController;