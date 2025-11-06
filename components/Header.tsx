import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon, MenuIcon, CloseIcon } from './icons';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinkClasses = (path: string, isMobile: boolean = false) => {
    const isActive = location.pathname.startsWith(path);
    if (isMobile) {
      return `block w-full text-left px-4 py-3 rounded-md text-lg font-medium transition-colors ${
        isActive
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`;
    }
    // Desktop styles
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-gray-200'
    }`;
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className={`bg-white transition-all duration-300 ${isSticky ? 'shadow-md sticky top-0 z-50' : 'shadow-sm'}`}>
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
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 sm:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <Link to="/resume" onClick={handleNavClick} className="flex items-center">
                <LogoIcon className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">ResumeGen</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
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
      </div>
    </>
  );
};

export default Header;