import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';
import { motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';

const ProjectCard = ({
    projectId,
    imageURL,
    projectTitle,
    description,
    githubLink,
    previewLink,
    techUsed,
    page
}) => {

  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if(page === "allProjects") {
      navigate(`/project/${projectId}`);
    }
  }

  const techUsedArray = typeof techUsed === "string"
    ? techUsed.split(',')
    .map(t => t.trim())
    .filter(t => t) // or can also use .filter(Boolean)
    : Array.isArray(techUsed)
    ? techUsed
    : [];

  return (
    <div 
      className={`relative overflow-hidden group bg-[#1a1a1a] border-3 border-[#FD6F00]/10 rounded-2xl hover:border-[#FD6F00]/40 transition-all duration-300 h-full flex flex-col hover:-translate-y-2
          ${page === "allProjects" ? "cursor-pointer" : ""}  
        `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}  
      onClick={handleCardClick}
    >
      
      <div className='relative h-56 overflow-hidden' >
        {imageURL ? (
          <motion.img
            src={imageURL}
            alt={projectTitle}
            // onLoad={() => console.log('Image loaded successfully:', imageURL)}
            onError={(e) => {
              // console.error('Image failed to load:', imageURL);
              // console.error('Error details:', e);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
            className='w-full h-full object-cover'
            animate={{
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.6 }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div 
          className='w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center'
          style={{ display: imageURL ? 'none' : 'flex' }}
        >
          <div className='text-gray-400 text-center'>
            <div className='text-4xl mb-2'>🖼️</div>
            <div className='text-sm'>No Image</div>
          </div>
        </div>

        { page === "projects" && (
          <div className='absolute inset-0'>
            <div className='absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60'></div>        
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className='absolute inset-0 bg-[#FD6F00]/90 flex items-center justify-center gap-4'
            >
              <a 
              href={githubLink}
              target='_blank'
              rel='noopener noreferer'
              className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#FD6F00] transition-all duration-300 hover:scale-110'
              onClick={(e) => e.stopPropagation()}
              >
                <Github size={24} />
              </a>
              <a 
                href={previewLink}
                target='_blank'
                rel='noopener noreferrer'
                className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#FD6F00] transition-all duration-300 hover:scale-110 '
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={24} />
              </a>
            </motion.div>
          </div>
        )}
      </div>

      {/* project content */}
      <div className='p-6 flex-1 flex-col'>
          <h3 className='text-2xl font-bold text-[#E0E0E0] mb-3 group-hover:text-[#FD6F00] transition-colors duration-300'>
            {projectTitle}
          </h3>
          <p className='text-[#B0B0B0] text-lg leading-relaxed mb-4 flex-1'>
            {description.length > 50 ? description.slice(0, 50) + "..." : description}
          </p>

          {/* Tech used */} 
          <div className='flex flex-wrap gap-2 mb-4'>
            {techUsedArray.slice(0, 3).map((tech, idx) => (
              <span
                key={tech + idx}
                className='text-xs px-3 py-1 rounded-full bg-[#FD6F00]/10 text-[#FD6F00] border border-[FD6F00]/20 font-medium'
              >
                {tech}
              </span>
            ))}
            {techUsedArray.length > 3 && (
              <span className='text-xs px-3 py-1 rounded-full bg-[#FD6F00]/20 text-[#FD6F00] border border-[FD6F00]/30 font-medium'>
                +{techUsedArray.length - 3} more
              </span>
            )}
          </div>

          {/* view details */}
          {page === "projects" && (
            <div
              onClick={() => navigate(`/project/${projectId}`)}
              className='flex items-center text-[#FD6F00] text-medium font-semibbold group-hover:gap-3 transition-all duration-300 cursor-pointer'
            >
              View Details
              <ArrowRight size={20} className='ml-1 group-hover:translate-x-1 transition-transform' />
            </div>
          )}
      </div>

      { page === "allProjects" && (
        <div className='px-4 py-5 mb-2 flex gap-5 flex-wrap'>
          <a 
            href={githubLink}
            target='_blank'
            rel='noopener noreferrer'
            onClick={(e) => e.stopPropagation()}
            className='flex-1 flex items-center justify-center px-5 py-3 rounded-xl gap-3 bg-[#FD6F00]/20 border text-[#FD6F00] border-[#FD6F00]/40 hover:bg-[#FD6F00] hover:text-white transition-all duration-300'
          >
            <Github size={20}/>
            <span className='text-sm'>Code</span>
          </a>
          <a 
            href={previewLink}
            target='_blank'
            rel='noopener noreferrer'
            onClick={(e) => e.stopPropagation()}
            className='flex-1 flex items-center justify-center px-5 py-3 rounded-xl gap-3 bg-[#FD6F00] hover:bg-[#FD6F00]/80 text-white transition-all duration-300'
          >
            <ExternalLink size={20} />
            <span className='text-sm'>Demo</span>
          </a>
        </div>
      )}

    </div>
  )
}

export default ProjectCard;
