import  { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectServices from '../../../services/ProjectServices';
import { ArrowLeft, Github, ExternalLink, Calendar, Code2, CheckCircle2 } from 'lucide-react';


const ProjectDetails = () => {

    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const result = await ProjectServices.getProjectById(id);
            if(result.success) {
                setProject(result.data);
            } else {
                setProject(null);
            }
        } catch(err) {
            console.error("Error fetching project", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("Project Id", id);
        fetchProject();
    }, [id]);

    const techUsed = project?.tech_used;
    const features = project?.features;

  const techStack = typeof techUsed === "string"
    ? techUsed.split(',')
    .map(t => t.trim())
    .filter(t => t) // or can also use .filter(Boolean)
    : Array.isArray(techUsed)
    ? techUsed
    : [];

    const featuresList = typeof features === "string"
      ? features.split(",")
        .map(f => f.trim())
        .filter(Boolean)
          : Array.isArray(features)
          ? features
      : [];

    console.log("details tech used", techStack);

    if(loading) {
        return (
          <div className='flex items-center justify-center min-h-screen'>
              <div className='border-2 border-[#FD6F00]/80 animate-spin w-8 h-8 rounded-full'></div>
              <p>Loading...</p>
          </div>
        );
    }

  return (
    <div className='min-h-screen p-6 text-[#E0E0E0]'>
      {/* Image and titles */}
      <div className='relative h-[60vh] overflow-hidden'>
        <motion.img 
            src={project?.image_url ? (project.image_url.startsWith('http') ? project.image_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${project.image_url}`) : ''}
            alt={project?.title}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-b from-[#121212]/70 via-[#121212]/50 to-[#121212]'></div>
      
        {/* overlay */}
        <div className='flex items-center absolute inset-0'>
            <div className=' px-6 sm:px-8 lg:px-12 w-full'>
             <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
             >
              <Link
                to="/projects"
                className='px-7 py-3 flex items-center rounded-xl w-50 group border-2 border-[#FD6F00] text-[#FD6F00] hover:bg-[#FD6F00] hover:text-white mb-6 group backdrop-blur-sm'
              >
                <ArrowLeft size={20} className='mr-2 group-hover:text-white group-hover:-translate-x-1' />
                Back to Projects
              </Link>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                {project?.title}
              </h1>
             </motion.div>

              <div className="flex flex-wrap gap-3 mb-6">
                {techStack.map(tech => (
                  <span
                    key={"tech" + tech}
                    className="px-4 py-2 rounded-lg bg-[#FD6F00]/20 backdrop-blur-sm text-[#FD6F00] border border-[#FD6F00]/30 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href={project?.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FD6F00] text-white hover:bg-[#FD6F00]/90 transition-all duration-300 group"
                >
                  <Github size={20} />
                  <span>View Code</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={project?.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[#FD6F00] text-[#FD6F00] hover:bg-[#FD6F00] hover:text-white backdrop-blur-sm transition-all duration-300 group"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

              
        </div>
      </div>

      <div className="px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#E0E0E0] mb-4">
                Project <span className="text-[#FD6F00]">Overview</span>
              </h2>
              <div className="w-20 h-1 bg-[#FD6F00] rounded-full mb-6"></div>
              <p className="text-[#B0B0B0] text-lg leading-relaxed">
                {project?.overview}
              </p>
              {/* <p className="text-[#B0B0B0] text-lg leading-relaxed mt-4">
                This project demonstrates modern web development practices with a focus on user experience, 
                performance, and scalability. Built with cutting-edge technologies, it showcases the ability 
                to create robust and maintainable applications.
              </p> */}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-[#E0E0E0] mb-4">
                Key <span className="text-[#FD6F00]">Features</span>
              </h2>
              <div className="w-20 h-1 bg-[#FD6F00] rounded-full mb-6"></div>
              <div className="grid sm:grid-cols-2 gap-4">
                {featuresList.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-[#1a1a1a] border border-[#FD6F00]/10 hover:border-[#FD6F00]/30 transition-all duration-300"
                  >
                    <CheckCircle2 className="text-[#FD6F00] shrink-0 mt-1" size={20} />
                    <span className="text-[#E0E0E0]">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-[#E0E0E0] mb-4">
                Technologies <span className="text-[#FD6F00]">Used</span>
              </h2>
              <div className="w-20 h-1 bg-[#FD6F00] rounded-full mb-6"></div>
              <div className="flex flex-wrap gap-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 rounded-xl bg-linear-to-br from-[#1a1a1a] to-[#121212] border border-[#FD6F00]/20 hover:border-[#FD6F00]/40 transition-all duration-300"
                  >
                    <span className="text-[#E0E0E0] font-semibold">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#FD6F00]/20"
            >
              <h3 className="text-xl font-bold text-[#E0E0E0] mb-6">Project Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FD6F00]/10 flex items-center justify-center shrink-0">
                    <Calendar className="text-[#FD6F00]" size={20} />
                  </div>
                  <div>
                    <p className="text-[#B0B0B0] text-sm">{project?.status}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FD6F00]/10 flex items-center justify-center shrink-0">
                    <Code2 className="text-[#FD6F00]" size={20} />
                  </div>
                  <div>
                    <p className="text-[#B0B0B0] text-sm">Category</p>
                    <p className="text-[#E0E0E0] font-semibold">{project?.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#FD6F00]/20"
            >
              <h3 className="text-xl font-bold text-[#E0E0E0] mb-6">Quick Links</h3>
              
              <div className="space-y-3">
                <a
                  href={project?.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#121212] hover:bg-[#FD6F00]/10 border border-[#FD6F00]/10 hover:border-[#FD6F00]/30 transition-all duration-300 group"
                >
                  <Github className="text-[#FD6F00]" size={20} />
                  <span className="text-[#E0E0E0] group-hover:text-[#FD6F00] transition-colors">View on GitHub</span>
                </a>
                <a
                  href={project?.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#121212] hover:bg-[#FD6F00]/10 border border-[#FD6F00]/10 hover:border-[#FD6F00]/30 transition-all duration-300 group"
                >
                  <ExternalLink className="text-[#FD6F00]" size={20} />
                  <span className="text-[#E0E0E0] group-hover:text-[#FD6F00] transition-colors">Live Demo</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails;
