import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ResumeData, TemplateId, Theme, ThemeId, FormattingOptions } from '../types';
import { THEMES } from '../constants';
import { PencilIcon } from './icons';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId: TemplateId;
  themeId: ThemeId;
  formattingOptions: FormattingOptions;
}

export interface TemplateProps {
  data: ResumeData;
  theme: Theme;
  formatting: FormattingOptions;
}

// Lazy load templates
const ClassicTemplate = React.lazy(() => import('./ClassicTemplate'));
const ModernTemplate = React.lazy(() => import('./ModernTemplate'));
const CreativeTemplate = React.lazy(() => import('./CreativeTemplate'));
const TechTemplate = React.lazy(() => import('./TechTemplate'));
const MinimalistTemplate = React.lazy(() => import('./MinimalistTemplate'));
const ElegantTemplate = React.lazy(() => import('./ElegantTemplate'));
const InfographicTemplate = React.lazy(() => import('./InfographicTemplate'));

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  tech: TechTemplate,
  minimalist: MinimalistTemplate,
  elegant: ElegantTemplate,
  infographic: InfographicTemplate,
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId, themeId, formattingOptions }) => {
  // Default to ClassicTemplate if not found
  const TemplateComponent = templates[templateId] || templates.classic;
  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <div id="resume-preview-container" className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden relative">
        <div className="lg:hidden absolute top-4 right-4 z-10">
            <Link
                to="/resume"
                className="flex items-center px-4 py-2 bg-gray-700 text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-colors"
            >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
            </Link>
        </div>
        <div id="resume-preview">
            {/* Adding key={templateId} forces React to destroy the old component and mount the new one fresh.
                This fixes issues where data might not visually update or styling might leak between templates. */}
            <Suspense fallback={<div className="p-12 text-center text-gray-500 min-h-[297mm] flex items-center justify-center">Loading template...</div>}>
                <TemplateComponent key={templateId} data={resumeData} theme={selectedTheme} formatting={formattingOptions} />
            </Suspense>
        </div>
    </div>
  );
};

export default ResumePreview;