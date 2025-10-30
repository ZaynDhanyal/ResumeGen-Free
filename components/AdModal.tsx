import React, { useState, useEffect } from 'react';
import AdsenseBlock from './AdsenseBlock';
import { CloseIcon, DownloadIcon } from './icons';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen) {
      setCountdown(3); // Reset countdown when modal opens
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all relative">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Advertisement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Please view this ad to support our free service. Your download will be available shortly.</p>
            <AdsenseBlock width="w-full" height="h-60" />
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg flex justify-end space-x-4 border-t dark:border-gray-700">
          <button
            onClick={onConfirm}
            disabled={countdown > 0}
            className="w-full flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:bg-green-300 disabled:cursor-not-allowed transition-all"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            {countdown > 0 ? `Continue to Download in ${countdown}...` : 'Continue to Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdModal;