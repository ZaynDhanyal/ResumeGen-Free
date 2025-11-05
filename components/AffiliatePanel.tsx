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
};

export default AffiliatePanel;