
import React, { useEffect, useState } from 'react'
import Skills from './Skills';
import SkillServices from '../../../services/SkillServices';
import { toast } from 'react-toastify';

const ManageSkills = () => {

  const [formData, setFormData] = useState({
    skill_name: "",
    skill_level: ""
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skillsCount, setSkillsCount] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if(error) {
      setError("");
    }
  }


  const fetchSkills = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await SkillServices.getAllSkills();
      if(result.success) {
        setSkills(result.data.skills);
        setSkillsCount(result.data.count);
      } else {
        setSkills([]);
        setSkillsCount(0);
      }
    } catch(err) {
      console.error("Error fetching skills", err);
      toast.error("Failed to retireve skills");
      setLoading(false);
      setError("");
    } finally{  
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  const createSkill = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(!formData.skill_name) {
      setError("Skill name is required.");
      setLoading(false);
      return;
    } 

    try {
      const result = await SkillServices.createSkill(formData);
      if(result.success) {
        toast.success("Skill created successfully.");
        await fetchSkills();
        setError("");
        setFormData({
          skill_name: "",
          skill_level: ""
        });
      }
    } catch(err) {
      console.log("Error creating skill.");
      toast.error("Failed to create skill.");
    } finally {
      setLoading(false);
    }

  }

  const handleClickUpdate = (skill) => {
    setIsUpdate(true);
    setCurrentSkillId(skill.id);
    setFormData({
      skill_name: skill.skill_name,
      skill_level: skill.skill_level || ""
    });
  }

  const updateSkill = async (e) => {
    e.preventDefault();

    setLoading(true);
    if(!formData.skill_name) {
      setError("Skill name is required.");
      setLoading(false);
      return;
    }

    try {
      const result = await SkillServices.updateSkill(formData, currentSkillId);
      if(result.success) {
        toast.success("Skill updated successfully.");
        setError("");
        await fetchSkills();
        setFormData({ skill_name: "", skill_level: "" });
        setCurrentSkillId(null);
        setIsUpdate(false);
      }
    } catch(err) {
      console.log("Error updating skill", err);
      toast.error("Failed to update skill.");
    } finally {
      setLoading(false);
    }
  }

  const deleteSkill = async (skillID) => {
    if(!window.confirm("Are you sure you want to delete this skill? This action can't be undone.")) return;

    setLoading(true);
    try {
      const result = await SkillServices.deleteSkill(skillID);
      if(result.success) {
        toast.success("Skill deleted successfully.");
        await fetchSkills();
      }
    } catch(err) {
      console.log("Error deleting skill", err);
      toast.error("Failed to delete skill");
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Skills
        formData={formData}
        handleInputChange={handleInputChange}
        loading={loading}
        error={error}

        isUpdate={isUpdate}
        count={skillsCount}
        skills={skills}

        onSubmit={createSkill}
        onUpdate={updateSkill}
        handleClickUpdate={handleClickUpdate}
        onDelete={deleteSkill}
      />
    </div>
  )
}

export default ManageSkills;
