import React, { useState } from 'react';
import { CoverLetterData, ResumeData, ThemeId, AffiliateBanner, ThemeMode } from '../types';
import AiSuggestionModal from './AiSuggestionModal';
import ThemeSelector from './ThemeSelector';
import { MagicIcon, DownloadIcon, BuildingIcon, PersonalInfoIcon, PaletteIcon, EyeIcon, TrashIcon, ArrowLeftIcon } from './icons';
import CoverLetterPreview from './CoverLetterPreview';

interface CoverLetterEditorProps {
  coverLetterData: CoverLetterData;
  resumeData: ResumeData;
  onDataChange: (field: keyof CoverLetterData, value: string) => void;
  onDownloadPdf: () => void;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  onClearSection: (section: 'recipient' | 'body') => void;
  affiliateBanners: AffiliateBanner[];
  theme: ThemeMode;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; onClear?: () => void }> = ({ title, icon, children, onClear }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
            {icon}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-3">{title}</h2>
        </div>
        {onClear && (
            <button
              onClick={onClear}
              title={`Clear ${title} section`}
              className="p-1 text-gray-400 dark:text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-500 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
        )}
      </div>
      {children}
    </div>
  );
  
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
<input {...props} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-gray-400" />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
<textarea {...props} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-gray-400" rows={15} />
);

const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({ coverLetterData, resumeData, onDataChange, onDownloadPdf, themeId, setThemeId, onClearSection, affiliateBanners, theme }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  
    const handleAiClick = () => {
      setModalOpen(true);
    };

    const handleAcceptSuggestion = (text: string) => {
        onDataChange('body', text);
    }
  
    return (
      <>
        <div className="h-full overflow-y-auto pr-0 lg:pr-4">
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

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 flex-wrap">
                  <div className="w-full">
                      <div className="flex items-center mb-4">
                          <PaletteIcon className="h-6 w-6 text-blue-600" />
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-3">Color Theme</h3>
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
    
          <Section title="Recipient Information" icon={<BuildingIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('recipient')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Recipient's Full Name & Title" value={coverLetterData.recipientName} onChange={e => onDataChange('recipientName', e.target.value)} />
              <Input placeholder="Company Name" value={coverLetterData.recipientCompany} onChange={e => onDataChange('recipientCompany', e.target.value)} />
              <Input placeholder="Date" value={coverLetterData.date} onChange={e => onDataChange('date', e.target.value)} />
              <Input placeholder="Your Full Name" value={coverLetterData.senderName} onChange={e => onDataChange('senderName', e.target.value)} />
            </div>
          </Section>
          
          <Section title="Letter Body" icon={<PersonalInfoIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('body')}>
            <Textarea 
              placeholder="Write your cover letter here, or let AI help you get started!" 
              value={coverLetterData.body} 
              onChange={e => onDataChange('body', e.target.value)} 
            />
            <button
              onClick={handleAiClick}
              className="mt-2 flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors text-sm"
            >
              <MagicIcon className="h-4 w-4 mr-2" />
              Generate with AI
            </button>
          </Section>
        </div>

        <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
                onClick={() => setIsMobilePreviewOpen(true)}
                className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Show Preview"
            >
                <EyeIcon className="h-8 w-8" />
            </button>
        </div>

        {isMobilePreviewOpen && (
            <div className="lg:hidden fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col">
                <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
                    <button 
                        onClick={() => setIsMobilePreviewOpen(false)}
                        className="flex items-center text-blue-600 dark:text-blue-400 font-semibold"
                    >
                        <ArrowLeftIcon className="h-6 w-6 mr-2" />
                        Back to Editor
                    </button>
                    <h2 className="text-lg font-bold">Cover Letter Preview</h2>
                </header>
                <div className="flex-grow overflow-y-auto">
                    <CoverLetterPreview 
                        coverLetterData={coverLetterData} 
                        themeId={themeId}
                        themeMode={theme}
                    />
                </div>
            </div>
        )}
      </>
    );
  };
  
  export default CoverLetterEditor;