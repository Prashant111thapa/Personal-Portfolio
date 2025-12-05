import React from 'react'
import { motion } from 'framer-motion';
import usePublicContact from '../../hooks/usePublicContact';
import { useProfile } from '../../context/ProfileContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { Github, Linkedin, Mail, MapPin, PhoneCall, Send } from 'lucide-react';


const Contact = () => {

  const { profile } = useProfile();

  const {    
    errors,
    formData,
    handleInputChange,
    createContact, 
  } = usePublicContact();

  return (
    <section id="contact" className='min-h-screen bg-[#0d0d0d] px-5 py-15'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-[#E0E0E0] mb-4">
          Get In <span className="text-[#FD6F00]">Touch</span>
        </h2>
        <div className="w-24 h-1 bg-[#FD6F00] mx-auto rounded-full mb-4"></div>
        <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Let's connect!
        </p>
        </motion.div>

      <div className='grid lg:grid-cols-2 gap-12'>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='space-y-8'
        >
          <div>
            <h3 className='text-2xl font-bold text-[#E0E0E0] mb-6'>Contact Information</h3>
          
            <div className='space-y-4'>
              <motion.a
                href={`mailto:${profile?.email}`}
                whileHover={{ x: 5 }}
                className='flex items-ceneter gap-4 px-5 py-7 rounded-xl group border bg-[#1a1a1a] border-[#FD6F00]/20 hover:border-[#FD6F00]/60 transition-all duration-300'
              >
                <div className='w-12 h-12 rounded-lg bg-[#FD6F00]/10 flex items-center justify-center group-hover:bg-[#FD6F00]/20 transition-all duration-300'>
                  <Mail size={30} className='text-[#FD6F00]'/>
                </div>
                <div>
                  <p className='text-[#B0B0B0] text-sm'>Email</p>
                  <p className='text-[#E0E0E0] font-medium'>{profile?.email}</p>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ x: 5 }}
                className='flex items-center gap-4 px-5 py-7 rounded-xl group border bg-[#1a1a1a] border-[#FD6F00]/20 hover:border-[#FD6F00]/60 transition-all duration-300'
              >
                <div className='w-12 h-12 rounded-lg bg-[#FD6F00]/10 group-hover:bg-[#FD6F00]/20 flex items-center justify-center'>
                  <PhoneCall size={30} className='text-[#FD6F00]'/>
                </div>
                <div>
                  <p className='text-[#B0B0B0] text-sm'>Phone</p>
                  <p className='text-[#E0E0E0] font-medium'>{profile?.contact_no}</p>
                </div>
              </motion.div>
  
              <motion.div
                whileHover={{ x: 5 }}
                className='flex items-center gap-4 px-5 py-7 rounded-xl group border bg-[#1a1a1a] border-[#FD6F00]/20 hover:border-[#FD6F00]/60 transition-all duration-300'
              >
                <div className='w-12 h-12 rounded-lg bg-[#FD6F00]/10 group-hover:bg-[#FD6F00]/20 flex items-center justify-center'>
                  <MapPin size={30} className='text-[#FD6F00]'/>
                </div>
                <div>
                  <p className='text-[#B0B0B0] text-sm'>Location</p>
                  <p className='text-[#E0E0E0] font-medium'>{profile?.location}</p>
                </div>
              </motion.div>

            </div>
          </div>

          <div>
            <h2 className='text-2xl mb-6 tracking-tight font-bold'>Follow Me</h2>
            <div className='flex items-center gap-4'>
              <motion.a
                href={profile?.github_url}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.1, y: -5 }}
                className='flex items-center justify-center p-4 bg-[#1a1a1a] border border-[#FD6F00]/20 hover:border-[#FD6F00]/40 rounded-xl text-[#FD6F00] hover:text-white hover:bg-[#FD6F00] hover:shadow-lg hover:shadow-[#FD6F00]/30 transition-all duration-300 cursor-pointer'>
                <Github size={30} />
              </motion.a>
              <motion.a
                href={profile?.linkedin_url}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.1, y: -5 }}
                className='flex items-center justify-center p-4 bg-[#1a1a1a] border border-[#FD6F00]/20 hover:border-[#FD6F00]/40 rounded-xl text-[#FD6F00] hover:text-white hover:bg-[#FD6F00] hover:shadow-lg hover:shadow-[#FD6F00]/30 transition-all duration-300 cursor-pointer'>
                <Linkedin size={30} />
              </motion.a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={createContact} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={`${errors.name ? 'border-2 border-red-500': ""} w-full`}
                />
                {errors.name ? <span className='text-sm text-red-500'>{errors.name}</span> : ""}
              </div>
              <div>
                <Input
                  label="Your Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`${errors.email ? 'border-2 border-red-500': ""} w-full`}
                />
                {errors.email ? <span className='text-sm text-red-500'>{errors.email}</span> : ""}
              </div>
            </div>

            <div>
              <Input
                label="Subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Project Inquiry"
                className={`${errors.subject ? 'border-2 border-red-500': ""} w-full`}
              />
              {errors.subject ? <span className='text-sm text-red-500'>{errors.subject}</span> : ""}
            </div>

            <div>
              <label className="text-[#E0E0E0] text-sm font-medium mb-2 block">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here..."
                rows={6}
                className={`p-4 rounded-md bg-[#1e1e1e] text-white border w-full border-[#FD6F00]/30 focus:outline-none focus:ring-2 focus:ring-[#FD6F00] max-h-30 ${errors.message ? 'border-2 border-red-500': ""}`}
              />
              {errors.message ? <span className='text-sm text-red-500'>{errors.message}</span> : ""}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FD6F00] hover:bg-[#FD6F00]/90 text-white px-8 py-6 text-base rounded-lg group shadow-lg shadow-[#FD6F00]/20 hover:shadow-[#FD6F00]/40 transition-all duration-300"
            >
              Send Message
              <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </form>
        </motion.div>
      </div>

    </section>
  )
}

export default Contact;
