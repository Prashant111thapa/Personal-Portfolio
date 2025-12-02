import React from 'react'
import Header from '../components/ui/Header';
import HeroSection from '../components/ui/HeroSection';
import About from '../components/ui/About';
import Skills from '../components/ui/Skills';
import Projects from '../components/ui/projects/Projects';
import Contact from '../components/ui/Contact';

const Portfolio = () => {
  return (
    <div className='min-h-screen bg-[#121212] text-white font-medium overflow-hidden'>
      <HeroSection />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}

export default Portfolio;