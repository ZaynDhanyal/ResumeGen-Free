import React, { useState, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { TemplateId } from '../types';
import { TEMPLATES, SAMPLE_RESUME, THEMES, DEFAULT_FORMATTING } from '../constants';

import { EyeIcon, CloseIcon } from './icons';

// Lazy load templates for preview modal
const ClassicTemplate = React.lazy(() => import('./ClassicTemplate'));
const ModernTemplate = React.lazy(() => import('./ModernTemplate'));
const CreativeTemplate = React.lazy(() => import('./CreativeTemplate'));
const TechTemplate = React.lazy(() => import('./TechTemplate'));
const MinimalistTemplate = React.lazy(() => import('./MinimalistTemplate'));
const ElegantTemplate = React.lazy(() => import('./ElegantTemplate'));
const InfographicTemplate = React.lazy(() => import('./InfographicTemplate'));

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  tech: TechTemplate,
  minimalist: MinimalistTemplate,
  elegant: ElegantTemplate,
  infographic: InfographicTemplate,
};


const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onSelect }) => {
  const [hoveredThumbnailId, setHoveredThumbnailId] = useState<TemplateId | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<TemplateId | null>(null);

  const renderPreviewModal = () => {
    if (!previewTemplateId) return null;

    const TemplateComponent = templates[previewTemplateId];
    if (!TemplateComponent) return null;

    const theme = THEMES[0];
    const formatting = DEFAULT_FORMATTING;
    
    return ReactDOM.createPortal(
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] p-4"
        onClick={() => setPreviewTemplateId(null)}
      >
        <div 
          className="relative bg-white shadow-2xl rounded-lg overflow-hidden w-auto h-full max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={() => setPreviewTemplateId(null)} 
            className="absolute top-2 right-2 bg-gray-100 rounded-full p-1.5 text-gray-800 hover:bg-gray-200 z-10"
            aria-label="Close preview"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <div className="h-full overflow-y-auto">
            <div className="transform scale-[0.6] origin-top">
              <div style={{width: '210mm', height: '297mm'}}>
                <Suspense fallback={<div className="h-full flex items-center justify-center">Loading preview...</div>}>
                    <TemplateComponent data={SAMPLE_RESUME} theme={theme} formatting={formatting} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Select a Template</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {TEMPLATES.map(template => (
          <div
            key={template.id}
            className="relative"
            onMouseEnter={() => setHoveredThumbnailId(template.id)}
            onMouseLeave={() => setHoveredThumbnailId(null)}
          >
            <button
              onClick={() => onSelect(template.id)}
              className={`w-full text-center p-2 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                selected === template.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500'
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

            {hoveredThumbnailId === template.id && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg transition-opacity duration-300 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplateId(template.id);
                  }}
                  className="pointer-events-auto flex items-center px-3 py-1.5 bg-white text-gray-800 text-sm font-semibold rounded-md shadow-md hover:bg-gray-200 transition-colors"
                  aria-label={`Preview ${template.name} template`}
                >
                  <EyeIcon className="h-4 w-4 mr-1.5" />
                  Preview
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {renderPreviewModal()}
    </div>
  );
};

export default TemplateSelector;