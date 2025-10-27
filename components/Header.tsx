import React from 'react';
import { LogoIcon } from './icons';

type View = 'editor' | 'cover-letter' | 'blog' | 'admin';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navLinkClasses = (view: View) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">ResumeGen Free</span>
          </div>
          <nav className="flex space-x-2 sm:space-x-4">
            <button onClick={() => setView('editor')} className={navLinkClasses('editor')}>
              Resume
            </button>
            <button onClick={() => setView('cover-letter')} className={navLinkClasses('cover-letter')}>
              Cover Letter
            </button>
            <button onClick={() => setView('blog')} className={navLinkClasses('blog')}>
              Blog
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;