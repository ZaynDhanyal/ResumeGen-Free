import React from 'react';
import { CoverLetterData, ThemeId } from '../types';
import { THEMES, SAMPLE_COVER_LETTER } from '../constants';

interface CoverLetterPreviewProps {
  coverLetterData: CoverLetterData;
  themeId: ThemeId;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ coverLetterData, themeId }) => {
  const { recipientName, recipientCompany, date, body, senderName } = coverLetterData;
  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const { colors } = selectedTheme;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div 
        id="cover-letter-preview" 
        className="p-8 font-serif text-sm leading-relaxed"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <div className="mb-8 text-left">
          <p className="font-bold">{senderName || SAMPLE_COVER_LETTER.senderName}</p>
          <p>{date || SAMPLE_COVER_LETTER.date}</p>
        </div>
        <div className="mb-8 text-left">
          <p>{recipientName || SAMPLE_COVER_LETTER.recipientName}</p>
          <p>{recipientCompany || SAMPLE_COVER_LETTER.recipientCompany}</p>
        </div>
        <div className={`whitespace-pre-wrap`}>
          {body || SAMPLE_COVER_LETTER.body}
        </div>
        <div className="mt-8">
          <p>Sincerely,</p>
          <p className="mt-4">{senderName || SAMPLE_COVER_LETTER.senderName}</p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;