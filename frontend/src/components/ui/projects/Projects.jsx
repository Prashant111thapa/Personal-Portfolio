import React, { useEffect } from 'react'
import UseProjects from '../../../hooks/UseProjects';
import { motion } from 'framer-motion';
import ProjectCard from '../../shared/ProjectCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
const Projects = () => {

    const { loadProjects, projects } = UseProjects();

    useEffect(() => {
        loadProjects();
    }, []);

  return (
    <section id="projects" className='bg-[#121212] min-h-screen px-5 py-15 '>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, staggerChildren: 0.2, delayChildren: 0.3 }}
      >
        <div className='flex items-center justify-center'>
          <div className='p-4'>
              <h1
                  className='relative text-4xl sm:text-5xl font-bold mb-4 text-[#E0E0E0]'
              >
                  Featured <span className='text-[#FD6F00]'>Projects</span>
                  <div className='mx-auto h-1  rounded-full bg-[#FD6F00] w-28 mt-3'></div>
              </h1>
              <p className='text-[#B0B0B0] tracking-tight text-lg mx-auto'>A showcase of my recent work and creative solutions</p>
          </div>
        </div>

        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-9'>
            {projects.slice(0, 3).map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                        <ProjectCard
                            projectId={project.id}
                            imageURL={
                                project?.file_url
                                ? (project.file_url.startsWith('http') ? project.file_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${project.file_url}`)
                                : (project?.image_url ? (project.image_url.startsWith('http') ? project.image_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${project.image_url}`) : null)
                        }
                        projectTitle={project.title}
                        description={project?.overview}
                        githubLink={project?.github_url}
                        previewLink={project?.preview_url}
                        techUsed={project?.tech_used}
                        page="projects"
                    />
                </motion.div>
            ))}
        </div>
      </motion.div>
      
      <div className='flex items-center justify-center py-15'>
            <Link 
                to="/projects" 
                className='px-6 py-3 flex items-center justify-center gap-2 border-2 border-[#FD6F00] group text-[#FD6F00] hover:text-white hover:bg-[#FD6F00] rounded-lg transition-all duration-300'
            >
                <span>View All Projects</span>
                <ArrowRight size={20} className='text-[#FD6F00] group-hover:text-white group-hover:translate-x-2 transition-transform'/>
            </Link>
        </div>
    </section>
  )
}

export default Projects;
