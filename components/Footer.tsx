import React from 'react';
import { AffiliateBanner as AffiliateBannerType } from '../types';

interface FooterProps {
    affiliateBanners: AffiliateBannerType[];
}

const Footer: React.FC<FooterProps> = ({ affiliateBanners }) => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white mt-12 border-t dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1">
          <div>
            <h3 className="text-lg font-semibold mb-4">ResumeGen Free</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create professional resumes and cover letters with AI-powered suggestions for free.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-4">
              &copy; {new Date().getFullYear()} ResumeGen Free. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;