import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SkillServices from '../../services/SkillServices';

const Skills = () => {

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSkills = async () => {
    setLoading(true);
    try{
      const skillsResponse = await SkillServices.getAllSkills();
      if(skillsResponse.success) {
        setSkills(skillsResponse.data.skills);
      } else {
        setSkills([]);
      }
    } catch(err) {
      console.error("Error loading skills", err);
      setSkills([]);
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <section id='skills' className='bg-[#0d0d0d] py-20 px-6 sm:px-8 lg:px-12 text-[#E0E0E0]'>
      <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='text-center mb-16'
        >
            <h2 className='text-4xl sm:text-5xl font-bold mb-4 text-[#E0E0E0]'>
                My <span className='text-[#FD6F00]'>Skills</span>
            </h2>
            <div className='rounded-full h-1 w-24 bg-[#FD6F00] mx-auto mb-4'></div>
            <p className='text-lg text-[#B0B0B0] tracking-tight mx-auto'>Technologies and tools I use to bring ideas to life</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'
      >
        {Array.isArray(skills) && skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className='relative group'
          >
            <div className='px-6 py-8 relative flex items-center justify-center bg-linear-to-br from-[#1a1a1a] to-[#121212] border border-[#FD6F00]/20 group rounded-xl transition-all overflow-hidden'>
              <div className='absolute inset-0 bg-linear-to-br from-[#FD6F00] to-[#ff8c3a] transition-opacity duration-300 opacity-0 group-hover:opacity-5'></div>
              
              <div className='relative z-10 flex flex-col items-center justify-center space-y-3'>
                <div className='w-12 h-12 bg-linear-to-br from-[#FD6F00] to-[#ff8c3a] rounded-lg opacity-10 group-hover:opacity-20 flex items-center justify-center transition-all duration-300'>
                  <div className=''></div>
                </div>
                <p className='group-hover:text-[#FD6F00] font-semibold text-medium'>{skill.skill_name}-({skill.skill_level})</p>
              </div>
              <div className='absolute top-0 right-0 w-8 h-8 bg-linear-to-br from-[#FD6F00] to-[#ff8c3a] rounded-bl-full opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      </div>
    </section>
  );
}

export default Skills;