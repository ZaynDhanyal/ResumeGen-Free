import React from 'react';
import { CoverLetterData, ThemeId } from '../types';
import { THEMES } from '../constants';

interface CoverLetterPreviewProps {
  coverLetterData: CoverLetterData;
  themeId: ThemeId;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ coverLetterData, themeId }) => {
  const { recipientName, recipientCompany, date, body, senderName } = coverLetterData;
  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const { colors } = selectedTheme;

  const placeholderBody = `Dear ${recipientName || 'Hiring Manager'},\n\nI am writing to express my interest in the position advertised on [Platform]. With my background in [Your Field] and a passion for [Relevant Interest], I am confident that I possess the skills and experience necessary to be a valuable asset to your team at ${recipientCompany || 'your company'}.\n\nIn my previous role at [Previous Company], I [mention a key achievement or responsibility]. This experience has equipped me with [mention key skills]. I am particularly drawn to this opportunity at ${recipientCompany || 'your company'} because [reason for interest].\n\nI am eager to learn more about this opportunity and discuss how my qualifications can benefit your team. Thank you for your time and consideration.`;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div 
        id="cover-letter-preview" 
        className="p-8 font-serif text-sm leading-relaxed"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <div className="mb-8 text-left">
          <p className="font-bold">{senderName || 'Your Name'}</p>
          <p>{date}</p>
        </div>
        <div className="mb-8 text-left">
          <p>{recipientName || 'Hiring Manager'}</p>
          <p>{recipientCompany || 'Company Name'}</p>
        </div>
        <div className={`whitespace-pre-wrap ${!body ? 'opacity-60' : ''}`}>
          {body || placeholderBody}
        </div>
        <div className="mt-8">
          <p>Sincerely,</p>
          <p className="mt-4">{senderName || 'Your Name'}</p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;