import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { useProfile } from '../../context/ProfileContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {

    const { profile } = useProfile();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    // Smooth scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false); // Close mobile menu after click
        }
    }

    // Navigation links configuration
    const getNavLinks = (isAuthenticated) => {
        if (isAuthenticated) {
            return [
                { label: 'Dashboard', path: '/dashboard', type: 'route' },
                { label: 'Profile', path: '/admin/profile', type: 'route' },
                { label: 'Skills', path: '/admin/skills', type: 'route' },
                { label: 'Projects', path: '/admin/projects', type: 'route' },
                { label: 'Contact', path: '/admin/contact', type: 'route' },
            ];
        } else {
            return [
                { label: 'Home', path: 'home', type: 'scroll' },
                { label: 'About', path: 'about', type: 'scroll' },
                { label: 'Skills', path: 'skills', type: 'scroll' },
                { label: 'Projects', path: 'projects', type: 'scroll' },
                { label: 'Contact', path: 'contact', type: 'scroll' },
            ];
        }
    }

    // Render navigation link
    const renderNavLink = (link, isMobile = false) => {
        const baseClasses = `hover:text-[#FD6F00]/70 transition-colors cursor-pointer ${isMobile ? 'block py-2 hover:text-[#FD6F00]/70' : ''}`;
        
        if (link.type === 'route') {
            return (
                <Link 
                    key={link.label}
                    to={link.path} 
                    className={baseClasses}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {link.label}
                </Link>
            );
        } else {
            return (
                <button 
                    key={link.label}
                    onClick={() => scrollToSection(link.path)}
                    className={baseClasses}
                >
                    {link.label}
                </button>
            );
        }
    }

    // Generate initials safely
    const getInitials = () => {
        if (!profile?.name) return 'U';
        return profile.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    }

  return (
    <div className='flex items-center justify-between opacity-99 px-6 py-12 border-b rounded-md border-b-gray-500 sticky top-0 text-white z-30 bg-[#0a0a0a]'>
        <Link to="/" className='text-4xl font-bold uppercase text-[#FD6F00]/80'>
            {getInitials()}.
        </Link>
        
        <div className='hidden md:flex items-center mr-5 px-5'>
            <nav>
                <ul className='flex gap-8 items-center justify-evenly font-medium text-lg'>
                    {getNavLinks(isAuthenticated).map(link => (
                        <li key={link.label} className='relative group'>
                            {renderNavLink(link)}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FD6F00] group-hover:w-full transition-all duration-300"></span>
                        </li>
                    ))}
                    {isAuthenticated && (
                        <li>
                            <Button variant='outline' size='sm' onClick={handleLogout}>
                                Logout
                            </Button>
                        </li>
                    )}
                </ul>    
            </nav>
        </div>

        {/* Mobile menu button - visible on mobile only */}
        <motion.button 
            className='block md:hidden text-[#E0E0E0] hover:text-[#FD6F00] transition-colors'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </motion.button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <>
                {/* Overlay */}
                <motion.div
                    className='fixed inset-0 bg-black/70 z-40 md:hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Slide-out Menu */}
                <motion.div
                    className='fixed top-0 right-0 h-full w-64 bg-[#1a1a1a] border-l border-[#FD6F00] z-50 md:hidden'
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {/* Close button */}
                    <div className='flex justify-end p-4 border-b border-[#FD6F00]'>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='text-[#E0E0E0] hover:text-[#FD6F00] transition-colors'
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    <nav className='px-6 py-6'>
                        <ul className='space-y-4'>
                        {getNavLinks(isAuthenticated).map(link => (
                            <li key={link.label}>
                                {renderNavLink(link, true)}
                            </li>
                        ))}
                        {isAuthenticated && (
                            <li className='pt-4'>
                                <Button 
                                    variant='outline' 
                                    size='sm' 
                                    onClick={handleLogout}
                                    className='w-full'
                                >
                                    Logout
                                </Button>
                            </li>
                        )}
                    </ul>
                </nav>
            </motion.div>
            </>
        )}
    </div>
  )
}

export default Header;
