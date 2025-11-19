import React from 'react';
import { Link } from 'react-router-dom';
import { ResumeData, TemplateId, Theme, ThemeId, FormattingOptions } from '../types';
import { THEMES } from '../constants';
import { PersonalInfoIcon, PencilIcon } from './icons';

import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import TechTemplate from './TechTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import ElegantTemplate from './ElegantTemplate';
import InfographicTemplate from './InfographicTemplate';

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
  const TemplateComponent = templates[templateId] || ClassicTemplate;
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
            <TemplateComponent data={resumeData} theme={selectedTheme} formatting={formattingOptions} />
        </div>
    </div>
  );
};

export default ResumePreview;