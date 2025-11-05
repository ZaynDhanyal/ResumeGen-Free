import React from 'react';

interface AffiliateBannerProps {
  name: string;
  url: string;
  imageUrl: string;
  description: string;
}

const AffiliateBanner: React.FC<AffiliateBannerProps> = ({ name, url, imageUrl, description }) => {
  // This component is disabled.
  return null;
};

export default AffiliateBanner;