
import React from 'react';
import AdsenseBlock from './AdsenseBlock';
import AffiliateBanner from './AffiliateBanner';
import { AFFILIATE_BANNERS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Our Partners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {AFFILIATE_BANNERS.map(banner => (
                    <AffiliateBanner key={banner.name} {...banner} />
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Advertisement</h3>
            <AdsenseBlock width="w-full" height="h-60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">ResumeGen Free</h3>
            <p className="text-gray-400 text-sm">
              Build your professional resume for free with AI-powered assistance.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ResumeGen Free. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
