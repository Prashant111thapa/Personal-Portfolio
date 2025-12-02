import React, { useEffect } from 'react'
import UseProjects from '../../../hooks/UseProjects';
import { motion } from 'framer-motion';
import Button from '../../shared/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProjectCard from '../../shared/ProjectCard';

const AllProjects = () => {

  const { projects, loadProjects, errors, imagePreview } = UseProjects();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  // if(loading) return <div>Loading...</div>
  // if(errors) return <div>Error Loading Projects</div>

  return (
    <div className='min-h-screen bg-[#121212] py-5 px-8'>
      <div className='max-w-7xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-2 border-[#FD6F00] text-[#FD6F00] hover:bg-[#FD6F00] hover:text-white mb-8 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Home
          </Button>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#E0E0E0] mb-4">
            All <span className="text-[#FD6F00]">Projects</span>
          </h1>
          <div className="w-24 h-1 bg-[#FD6F00] rounded-full mb-4"></div>
          <p className="text-[#B0B0B0] text-lg mb-12">
            Explore my complete portfolio of projects and creative solutions
          </p>
        </motion.div>
      
        {/* Projects */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
        >
          {projects.map((project) => (
            <ProjectCard 
              key={project.id}
              projectId={project.id}
              imageURL={project?.image_url ? `http://localhost:5000${project.image_url}` : null}
              projectTitle={project.title}
              description={project?.overview}
              githubLink={project?.github_url}
              previewLink={project?.preview_url}
              techUsed={project.tech_used}
              page='allProjects'
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default AllProjects;
