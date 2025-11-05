'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LogoIcon, MenuIcon, CloseIcon, SunIcon, MoonIcon } from './icons';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

// New component to safely access search params
const AdminLink: React.FC<{
  navLinkClasses: (path: string, isMobile?: boolean) => string;
  handleNavClick?: () => void;
  isMobile?: boolean;
}> = ({ navLinkClasses, handleNavClick, isMobile = false }) => {
  const searchParams = useSearchParams();
  const isAdminVisible = searchParams ? searchParams.get('admin') === 'true' : false;

  if (!isAdminVisible) {
    return null;
  }

  if (isMobile) {
    return (
      <Link href="/admin" onClick={handleNavClick} className={navLinkClasses('/admin', true)}>
        Admin
      </Link>
    );
  }

  return (
    <Link href="/admin" className={navLinkClasses('/admin')}>
      Admin
    </Link>
  );
};

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
    const isActive = pathname ? pathname.startsWith(path) : false;
    if (isMobile) {
      return `block w-full text-left px-4 py-3 rounded-md text-lg font-medium transition-colors ${
        isActive
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`;
    }
    // Desktop styles
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 ${isSticky ? 'shadow-md dark:shadow-gray-800 sticky top-0 z-50' : 'shadow-sm dark:shadow-none'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/resume" className="flex-shrink-0 flex items-center">
              <LogoIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">ResumeGen Free</span>
            </Link>
            
            <div className="flex items-center">
              {/* Desktop Nav */}
              <nav className="hidden sm:flex sm:space-x-4">
                <Link href="/resume" className={navLinkClasses('/resume')}>
                  Resume
                </Link>
                <Link href="/cover-letter" className={navLinkClasses('/cover-letter')}>
                  Cover Letter
                </Link>
                <Link href="/blog" className={navLinkClasses('/blog')}>
                  Blog
                </Link>
                <Suspense fallback={null}>
                  <AdminLink navLinkClasses={navLinkClasses} />
                </Suspense>
              </nav>

              <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>

              {/* Mobile Menu Button */}
              <div className="sm:hidden ml-2">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                  {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
              </div>
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
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl z-50 sm:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/resume" onClick={handleNavClick} className="flex items-center">
                <LogoIcon className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">ResumeGen</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
            <Link href="/resume" onClick={handleNavClick} className={navLinkClasses('/resume', true)}>
              Resume
            </Link>
            <Link href="/cover-letter" onClick={handleNavClick} className={navLinkClasses('/cover-letter', true)}>
              Cover Letter
            </Link>
            <Link href="/blog" onClick={handleNavClick} className={navLinkClasses('/blog', true)}>
              Blog
            </Link>
            <Suspense fallback={null}>
              <AdminLink navLinkClasses={navLinkClasses} handleNavClick={handleNavClick} isMobile={true} />
            </Suspense>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;