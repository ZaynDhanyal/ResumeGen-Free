
import React from 'react';

interface AffiliateBannerProps {
  name: string;
  url: string;
  imageUrl: string;
  description: string;
}

const AffiliateBanner: React.FC<AffiliateBannerProps> = ({ name, url, imageUrl, description }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors group"
    >
      <img src={imageUrl} alt={`${name} logo`} className="w-full h-16 object-cover rounded-md mb-2" />
      <h4 className="font-semibold text-white group-hover:text-blue-300">{name}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </a>
  );
};

export default AffiliateBanner;
