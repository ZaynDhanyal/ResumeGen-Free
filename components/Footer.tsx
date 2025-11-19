import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-4">ResumeGen Free</h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm max-w-2xl">
              Create professional resumes and cover letters with AI-powered suggestions for free.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-4">
              &copy; {new Date().getFullYear()} ResumeGen Free. All Rights Reserved.
            </p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;