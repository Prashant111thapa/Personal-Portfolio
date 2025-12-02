import Header from '../../components/ui/Header';
// import { useAuth } from '../../context/AuthContext';
import HeroSection from '../../components/ui/HeroSection';
import About from '../../components/ui/About';
import Skills from '../../components/ui/Skills';
import Projects from '../../components/ui/projects/Projects';
import Contact from '../../components/ui/Contact';

const Dashboard = () => {

  // const { user } = useAuth();

  return (
    <div className='min-h-screenbg-[#121212] text-white font-medium overflow-hidden'>
      <HeroSection />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </div>
  )
}

export default Dashboard;
