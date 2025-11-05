import React, { useState } from 'react';
import { TemplateId, ThemeId, ThemeMode } from '../types';
import { TEMPLATES, SAMPLE_RESUME, THEMES, DEFAULT_FORMATTING } from '../constants';
import { CloseIcon, SunIcon, MoonIcon } from './icons';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import TechTemplate from './TechTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import CorporateTemplate from './CorporateTemplate';
import ElegantTemplate from './ElegantTemplate';
import InfographicTemplate from './InfographicTemplate';

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
  themeId: ThemeId;
}

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  tech: TechTemplate,
  minimalist: MinimalistTemplate,
  corporate: CorporateTemplate,
  elegant: ElegantTemplate,
  infographic: InfographicTemplate,
};


const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onSelect, themeId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<TemplateId | null>(null);
  const [previewThemeMode, setPreviewThemeMode] = useState<ThemeMode>('light');

  const handlePreview = (id: TemplateId) => {
    setPreviewTemplateId(id);
    setModalOpen(true);
  };
  
  const handleSelect = () => {
    if (previewTemplateId) {
      onSelect(previewTemplateId);
      setModalOpen(false);
    }
  };

  const TemplateComponent = previewTemplateId ? templates[previewTemplateId] : null;
  const selectedThemeForPreview = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Select a Template</h3>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => handlePreview(template.id)}
            className={`w-full text-center p-2 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
              selected === template.id
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/50 shadow-md'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
          >
            <img 
              src={template.imageUrl} 
              alt={`${template.name} template preview`} 
              className="w-full h-24 sm:h-32 object-cover object-top rounded-md mb-2 border border-gray-300 dark:border-gray-600"
            />
            <span className={`font-medium text-sm ${selected === template.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-300'}`}>
              {template.name}
            </span>
          </button>
        ))}
      </div>

      {modalOpen && previewTemplateId && TemplateComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {TEMPLATES.find(t => t.id === previewTemplateId)?.name} Template Preview
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Preview Mode:</span>
                <button
                  onClick={() => setPreviewThemeMode('light')}
                  title="Light Mode Preview"
                  className={`p-2 rounded-full transition-colors ${previewThemeMode === 'light' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <SunIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPreviewThemeMode('dark')}
                  title="Dark Mode Preview"
                  className={`p-2 rounded-full transition-colors ${previewThemeMode === 'dark' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <MoonIcon className="h-5 w-5" />
                </button>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
              <div className="w-full max-w-[794px] mx-auto shadow-lg">
                <TemplateComponent
                  data={SAMPLE_RESUME}
                  theme={selectedThemeForPreview}
                  formatting={DEFAULT_FORMATTING}
                  themeMode={previewThemeMode}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={handleSelect}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Select this Template
              </button>
            </div>
          </div>
        </div>
      )}
      <style>
        {`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}
      </style>
    </div>
  );
};

export default TemplateSelector;