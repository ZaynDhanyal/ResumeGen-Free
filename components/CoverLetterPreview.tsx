import React from 'react';
import Link from 'next/link';
import { CoverLetterData, ThemeId, ThemeMode } from '../types';
import { THEMES, SAMPLE_COVER_LETTER } from '../constants';
import { PencilIcon } from './icons';

interface CoverLetterPreviewProps {
  coverLetterData: CoverLetterData;
  themeId: ThemeId;
  themeMode: ThemeMode;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ coverLetterData, themeId, themeMode }) => {
  const { recipientName, recipientCompany, date, body, senderName } = coverLetterData;
  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const colors = (themeMode === 'dark' && selectedTheme.dark) ? selectedTheme.dark : selectedTheme.colors;

  const contentBody = body || SAMPLE_COVER_LETTER.body;
  
  const getDynamicStyles = (text: string) => {
    const length = text.length;
    if (length > 1500) {
      return 'text-xs leading-snug';
    } else if (length > 800) {
      return 'text-sm leading-normal';
    }
    return 'text-base leading-relaxed';
  };

  const dynamicTextStyles = getDynamicStyles(contentBody);

  return (
    <div className="relative">
      <div className="lg:hidden absolute top-4 right-4 z-10">
          <Link
              href="/cover-letter"
              className="flex items-center px-4 py-2 bg-gray-700/80 dark:bg-gray-900/80 backdrop-blur-sm text-white font-bold rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
          >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
          </Link>
      </div>
      <div 
        id="cover-letter-preview" 
        className={`w-full max-w-[794px] mx-auto shadow-lg font-serif min-h-[297mm] p-10 ${dynamicTextStyles}`}
        style={{ backgroundColor: colors.secondary, color: colors.text }}
      >
        <div className="mb-8 text-left">
          <p className="font-bold" style={{ color: colors.primary }}>{senderName || SAMPLE_COVER_LETTER.senderName}</p>
          <p style={{ color: colors.primary, opacity: 0.8 }}>{date || SAMPLE_COVER_LETTER.date}</p>
        </div>
        <div className="mb-8 text-left">
          <p className="font-semibold" style={{ color: colors.primary }}>{recipientName || SAMPLE_COVER_LETTER.recipientName}</p>
          <p style={{ color: colors.primary, opacity: 0.8 }}>{recipientCompany || SAMPLE_COVER_LETTER.recipientCompany}</p>
        </div>
        <div className={`whitespace-pre-wrap`}>
          {contentBody}
        </div>
        <div className="mt-8">
          <p>Sincerely,</p>
          <p className="mt-4 font-semibold" style={{ color: colors.primary }}>{senderName || SAMPLE_COVER_LETTER.senderName}</p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;