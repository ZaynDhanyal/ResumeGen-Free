import React, { useState } from 'react';
import { LogoIcon, MenuIcon, CloseIcon } from './icons';

type View = 'editor' | 'cover-letter' | 'blog' | 'admin';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = (view: View, isMobile: boolean = false) => 
    `w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'bg-blue-600 text-white' 
        : `text-gray-700 ${isMobile ? 'hover:bg-gray-100' : 'hover:bg-gray-200'}`
    }`;

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">ResumeGen Free</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden sm:flex sm:space-x-4">
            <button onClick={() => handleNavClick('editor')} className={navLinkClasses('editor')}>
              Resume
            </button>
            <button onClick={() => handleNavClick('cover-letter')} className={navLinkClasses('cover-letter')}>
              Cover Letter
            </button>
            <button onClick={() => handleNavClick('blog')} className={navLinkClasses('blog')}>
              Blog
            </button>
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
            <button onClick={() => handleNavClick('editor')} className={navLinkClasses('editor', true)}>
              Resume
            </button>
            <button onClick={() => handleNavClick('cover-letter')} className={navLinkClasses('cover-letter', true)}>
              Cover Letter
            </button>
            <button onClick={() => handleNavClick('blog')} className={navLinkClasses('blog', true)}>
              Blog
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;