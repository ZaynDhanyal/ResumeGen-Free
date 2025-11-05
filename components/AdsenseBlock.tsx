import React from 'react';
import { AdIcon } from './icons';

interface AdsenseBlockProps {
  width?: string;
  height?: string;
  className?: string;
}

const AdsenseBlock: React.FC<AdsenseBlockProps> = ({ width = 'w-72', height = 'h-60', className = '' }) => {
  // This component is disabled.
  return null;
};

export default AdsenseBlock;