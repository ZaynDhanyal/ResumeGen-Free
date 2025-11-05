import React from 'react';
import AdsenseBlock from './AdsenseBlock';
import { CloseIcon, DownloadIcon } from './icons';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onConfirm }) => {
  // This component has been disabled.
  return null;
};

export default AdModal;