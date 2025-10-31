
import React from 'react';
import { AffiliateBanner as AffiliateBannerType } from '../types';
import AffiliateBanner from './AffiliateBanner';
import { UsersIcon } from './icons';

interface AffiliatePanelProps {
    affiliateBanners: AffiliateBannerType[];
}

const AffiliatePanel: React.FC<AffiliatePanelProps> = ({ affiliateBanners }) => {
    // This component is disabled.
    return null;
    /*
    // Don't render if there are no banners
    if (!affiliateBanners || affiliateBanners.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <div className="flex items-center mb-4">
                <UsersIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-3">Recommended Tools</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Boost your job search with these recommended services from our partners.
            </p>
            <div className="space-y-4">
                {affiliateBanners.map(banner => (
                    <AffiliateBanner key={banner.id} {...banner} />
                ))}
            </div>
        </div>
    );
    */
};

export default AffiliatePanel;