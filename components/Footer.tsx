import React from 'react';
import AdsenseBlock from './AdsenseBlock';
import AffiliateBanner from './AffiliateBanner';
import { AffiliateBanner as AffiliateBannerType } from '../types';

interface FooterProps {
    affiliateBanners: AffiliateBannerType[];
}

const Footer: React.FC<FooterProps> = ({ affiliateBanners }) => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 hidden">
            <h3 className="text-lg font-semibold mb-4">Our Partners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {affiliateBanners.map(banner => (
                    <AffiliateBanner key={banner.id} {...banner} />
                ))}
            </div>
          </div>
          <div className="hidden">
            <h3 className="text-lg font-semibold mb-4">Advertisement</h3>
            <AdsenseBlock width="w-full" height="h-60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">ResumeGen Free</h3>
            <p className="text-gray-400 text-sm">
              Create professional resumes and cover letters with AI-powered suggestions for free.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              &copy; {new Date().getFullYear()} ResumeGen Free. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
