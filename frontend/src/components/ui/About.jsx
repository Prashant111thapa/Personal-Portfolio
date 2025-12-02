import { motion } from 'framer-motion';
import { GraduationCap, Heart, MapPin } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';


const About = () => {

  const { profile } = useProfile();

  return (
    <section id='about' className='pb-15 px-6 sm:px-8 lg:px-12 pt-28 overflow-hidden'>
        <div className='w-full items-start'>
          <motion.div
              className='text-center mb-10 text-[#E0E0E0]'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
          >
              <h2 className='text-4xl sm:text-5xl font-bold mb-4'>
                  About <span className='text-[#FD6F00]'>Me</span>
              </h2>
              <div className='w-24 h-1 bg-[#FD6F00] mx-auto rounded-full'></div>
          </motion.div>

          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex justify-center lg:justify-start overflow-hidden"
            >
              <div className="relative w-full h-90 sm:w-full sm:h-120 md:h-150 rounded-2xl overflow-hidden border-4 border-[#FD6F00]/20 hover:border-[#FD6F00]/40 transition-all duration-300">
                <div className="w-full h-full flex items-center justify-center">
                  {/* <div className="text-center space-y-6">
                    <motion.div
                      className="w-32 h-32 mx-auto rounded-full bg-[#FD6F00]/10 border-4 border-[#FD6F00] flex items-center justify-center text-5xl font-bold text-[#FD6F00]"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(253, 111, 0, 0.2)',
                          '0 0 40px rgba(253, 111, 0, 0.4)',
                          '0 0 20px rgba(253, 111, 0, 0.2)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      PT
                    </motion.div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-[#E0E0E0]">Prashant Thapa</p>
                      <p className="text-[#FD6F00] text-lg">Full berojgar</p>
                    </div>
                  </div> */}

                  { profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url.startsWith('http') ? profile.avatar_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${profile.avatar_url}`}
                      alt={profile.name}
                      className='w-full h-full object-cover rounded-xl'
                    />
                  ): (
                    <div className='w-full h-full bg-linear-to-br from-[#1a1a1a] to-[#121212] rounded-xl flex items-center justify-center'>
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full bg-[#FD6F00]/10 border-3 border-[#FD6F00] flex items-center justify-center text-2xl font-bold text-[#FD6F00]">
                          PT
                        </div>
                        <p className="text-[#B0B0B0]">No Image</p>
                      </div>
                    </div>
                  )}
                  <div className='absolute inset-0 bg-linear-to-tr from-[#1a1a1a]/30 via-transparent to-[#121212]/30 rounded-xl'></div>
                </div>
              </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 30}}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className='space-y-6'
            >
                <p className='text-[#B0B0B0] text-lg leading-relaxed'>
                  {profile?.about}
                </p>

                <div className='space-y-4 pt-4'>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className='flex items-start gap-4 p-5 sm:py-6 md:py-7 rounded-xl bg-[#1a1a1a] border border-[#FD6F00]/10 hover:border-[#FD6F00]/30 transition-all duration-300'
                  >
                    <div className='w-12 h-12 rounded-lg bg-[#FD6F00]/10 flex items-center justify-center shrink-0'>
                      <GraduationCap className='text-[#FD6F00]' size={24}/>
                    </div>
                    <div>
                      <h3 className='text-[#E0E0E0] font-semibold text-lg mb-1'>Education</h3>
                      <p className='text-[#B0B0B0]'>{profile?.education}</p>
                      <p className='text-[#FD6F00] text-sm mt-1'>NAMI College (University of Northampton)</p>
                    </div>

                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className='flex items-start gap-4 p-5 sm:py-6 md:py-7 rounded-xl bg-[#1a1a1a] border-[#FD6F00]/10 hover:[#FD6F00]/30 transition-all duration-300'
                  >
                    <div className='w-12 h-12 flex items-center justify-center shrink-0 bg-[#FD6F00]/10 rounded-lg'>
                      <MapPin className='text-[#FD6F00]' size={24}/>
                    </div>
                    <div>
                      <h3 className='text-[#E0E0E0] font-semibold text-lg mb-1'>Location</h3>
                      <p className='text-[#B0B0B0]'>{profile?.location}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ x: 5 }}
                    className='flex items-start bg-[#1a1a1a] border-[#FD6F00]/10 hover:border-[#FD6F00]/30 p-5 sm:py-6 md:py-7 gap-4 rounded-xl transition-all duration-300'
                  >
                    <div className='w-12 h-12 flex items-center justify-center shrink-0 bg-[#FD6F00]/10 rounded-lg'>
                      <Heart className=' text-[#FD6F00]' size={24} />
                    </div>
                    <div>
                      <h3 className='text-2xl text-[#E0E0E0] font-semibold mb-1'>Interests</h3>
                      <p className='text-[#B0B0B0] text-sm'>{profile?.interests}</p>
                    </div>
                  </motion.div>
                </div>
            </motion.div>
          </div>
        </div>
    </section>
  )
}

export default About;
