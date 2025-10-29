import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon, MenuIcon, CloseIcon } from './icons';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinkClasses = (path: string, isMobile: boolean = false) => {
    const isActive = location.pathname.startsWith(path);
    return `w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white' 
        : `text-gray-700 ${isMobile ? 'hover:bg-gray-100' : 'hover:bg-gray-200'}`
    }`;
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/resume" className="flex-shrink-0 flex items-center">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">ResumeGen Free</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden sm:flex sm:space-x-4">
            <Link to="/resume" className={navLinkClasses('/resume')}>
              Resume
            </Link>
            <Link to="/cover-letter" className={navLinkClasses('/cover-letter')}>
              Cover Letter
            </Link>
            <Link to="/blog" className={navLinkClasses('/blog')}>
              Blog
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
              {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg">
          <nav className="flex flex-col p-2 space-y-1">
            <Link to="/resume" onClick={handleNavClick} className={navLinkClasses('/resume', true)}>
              Resume
            </Link>
            <Link to="/cover-letter" onClick={handleNavClick} className={navLinkClasses('/cover-letter', true)}>
              Cover Letter
            </Link>
            <Link to="/blog" onClick={handleNavClick} className={navLinkClasses('/blog', true)}>
              Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;