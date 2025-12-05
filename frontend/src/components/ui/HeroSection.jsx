import { useProfile } from '../../context/ProfileContext';
import { motion } from 'framer-motion'
import Button from '../shared/Button';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

  const navigate = useNavigate();
    const { profile } = useProfile();
    
  return (
    <section id="home" className='flex items-center justify-center px-6 sm:px-8 lg:px-12 pt-20'>
    <div className='w-full items-start'>
        <div className='grid lg:grid-cols-2 gap-12 items-star'>
            <motion.div
                className='space-y-6'
                initials={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <motion.div
                    className='inline-block'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <span className='text-[#FD6F00] text-sm sm:text-base font-semibold tracking-wider uppercase border border-[#FD6F00]/30 px-4 py-2 rounded-full'>
                        Welcome to my portfolio
                    </span>
                </motion.div>

                <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#E0E0E0] leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                >
                Hi, I'm{' '}
                <span className="text-[#FD6F00] relative">
                    {profile?.name || 'Loading...'}
                    <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 bg-[#FD6F00]/50"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 0.8 }}
                    />
                </span>
                </motion.h1>

                <motion.h2 
                    className='text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#B0B0B0]'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    {profile?.role || 'Developer'}
                </motion.h2>

                <motion.p
                    className='text-[#B0B0B0] text-lg leading-relaxed max-w-2xl'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    Crafting digital experiences with modern web technologies
                </motion.p>

                <motion.div
                    className='flex flex-wrap gap-4 pt-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    <Button
                        className='group'
                        onClick={navigate("/projects")}
                    >
                      View Projects
                      <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' size={20}/>
                    </Button>
                    <a
                      href={profile?.resume_url ? (profile.resume_url.startsWith('http') ? profile.resume_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${profile.resume_url}`) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        border-[#FD6F00] text-[#FD6F00] hover:bg-[#FD6F00] hover:text-white shadow-sm hover:shadow-[#FD6F00]/30
                        cursor-pointer border-2 px-6 py-6 text-base rounded-lg transition-all duration-300 ${!profile?.resume_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      View CV
                    </a>
                </motion.div>

                {/* social links */}
                <motion.div
                    className='flex gap-4 pt-6'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    <a
                        href={profile?.github_url || '#'}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-12 h-12 rounded-full border-2 border-[#FD6F00]/30 flex items-center justify-center text-[#FD6F00] hover:text-white hover:bg-[#FD6F00] hover:border-[#FD6F00] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#FD6F00]/30'
                    >
                        <Github size={30} />
                    </a>
                    <a
                        href={profile?.linkedin_url || '#'}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-12 h-12 rounded-full border-2 border-[#FD6F00]/30 flex items-center justify-center text-[#FD6F00] hover:text-white hover:bg-[#FD6F00] hover:border-[#FD6F00] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#FD6F00]/30'
                    >
                        <Linkedin size={30}/>
                    </a>
                </motion.div>
            </motion.div>

          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Animated circles */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#FD6F00]/20"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              <motion.div
                className="absolute inset-8 rounded-full border-2 border-[#FD6F00]/30"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              
              {/* Profile Image Container */}
              <motion.div
                className="absolute inset-16 rounded-full bg-linear-to-br from-[#1a1a1a] to-[#0d0d0d] backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-2xl border border-[#FD6F00]/10"
                animate={{
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {profile?.avatar_url ? (
                  <motion.img
                    src={profile.avatar_url.startsWith('http') ? profile.avatar_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${profile.avatar_url}`}
                    alt={profile?.name || 'Profile'}
                    className="w-full h-full object-cover rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onError={(e) => {
                      console.log('Profile image failed to load');
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-[#FD6F00] mb-2">{'<>'}</div>
                    <div className="text-[#B0B0B0] text-sm">Full Stack</div>
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a]/10 via-transparent to-[#121212]/30 rounded-full pointer-events-none"></div>
              </motion.div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-12 rounded-full bg-[#FD6F00]/5 blur-xl"></div>
            </div>
          </motion.div>
        </div>
    </div>
    </section>
  )
}

export default HeroSection;