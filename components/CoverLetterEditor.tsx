import React, { useState } from 'react';
import { CoverLetterData, ResumeData, ThemeId } from '../types';
import AiSuggestionModal from './AiSuggestionModal';
import ThemeSelector from './ThemeSelector';
import { MagicIcon, DownloadIcon, BuildingIcon, PersonalInfoIcon, PaletteIcon } from './icons';

interface CoverLetterEditorProps {
  coverLetterData: CoverLetterData;
  resumeData: ResumeData;
  onDataChange: (field: keyof CoverLetterData, value: string) => void;
  onDownloadPdf: () => void;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}

// Reusable Section component for consistent UI
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-bold text-gray-800 ml-3">{title}</h2>
      </div>
      {children}
    </div>
  );
  
// Reusable Input component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
<input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
);

// Reusable Textarea component
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
<textarea {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" rows={15} />
);

const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({ coverLetterData, resumeData, onDataChange, onDownloadPdf, themeId, setThemeId }) => {
    const [modalOpen, setModalOpen] = useState(false);
  
    const handleAiClick = () => {
      setModalOpen(true);
    };

    const handleAcceptSuggestion = (text: string) => {
        onDataChange('body', text);
    }
  
    return (
      <div className="h-full overflow-y-auto pr-4">
        {modalOpen && (
          <AiSuggestionModal
            type="coverLetter"
            context={{ 
                resumeData, 
                recipientName: coverLetterData.recipientName,
                recipientCompany: coverLetterData.recipientCompany
            }}
            onClose={() => setModalOpen(false)}
            onAccept={handleAcceptSuggestion}
          />
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                 <div className="w-full">
                    <div className="flex items-center mb-4">
                        <PaletteIcon className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-800 ml-3">Color Theme</h3>
                    </div>
                    <ThemeSelector selectedTheme={themeId} onSelectTheme={setThemeId} />
                </div>
                <button
                    onClick={onDownloadPdf}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors flex-shrink-0"
                >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download PDF
                </button>
            </div>
        </div>
  
        <Section title="Recipient Information" icon={<BuildingIcon className="h-6 w-6 text-blue-600" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Recipient's Full Name & Title" value={coverLetterData.recipientName} onChange={e => onDataChange('recipientName', e.target.value)} />
            <Input placeholder="Company Name" value={coverLetterData.recipientCompany} onChange={e => onDataChange('recipientCompany', e.target.value)} />
            <Input placeholder="Date" value={coverLetterData.date} onChange={e => onDataChange('date', e.target.value)} />
            <Input placeholder="Your Full Name" value={coverLetterData.senderName} onChange={e => onDataChange('senderName', e.target.value)} />
          </div>
        </Section>
        
        <Section title="Letter Body" icon={<PersonalInfoIcon className="h-6 w-6 text-blue-600" />}>
          <Textarea 
            placeholder="Write your cover letter here, or let AI help you get started!" 
            value={coverLetterData.body} 
            onChange={e => onDataChange('body', e.target.value)} 
          />
          <button
            onClick={handleAiClick}
            className="mt-2 flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition-colors text-sm"
          >
            <MagicIcon className="h-4 w-4 mr-2" />
            Generate with AI
          </button>
        </Section>
      </div>
    );
  };
  
  export default CoverLetterEditor;