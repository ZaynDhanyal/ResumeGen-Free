
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
  /*
  return (
    <div className={`${width} ${height} ${className} bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-md`}>
      <div className="text-center text-gray-500">
        <AdIcon className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm font-semibold">Ad Slot</p>
        <p className="text-xs">({width} x {height})</p>
      </div>
    </div>
  );
  */
};

export default AdsenseBlock;