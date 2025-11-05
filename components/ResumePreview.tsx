import React from 'react';
import { Link } from 'react-router-dom';
import { ResumeData, TemplateId, ThemeId, FormattingOptions, ThemeMode, TemplateProps } from '../types';
import { THEMES } from '../constants';
import { PencilIcon } from './icons';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import TechTemplate from './TechTemplate';
import MinimalistTemplate from './MinimalistTemplate';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId: TemplateId;
  themeId: ThemeId;
  formattingOptions: FormattingOptions;
  themeMode: ThemeMode;
}

const templates: { [key in TemplateId]: React.FC<TemplateProps> } = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  tech: TechTemplate,
  minimalist: MinimalistTemplate,
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId, themeId, formattingOptions, themeMode }) => {
  const TemplateComponent = templates[templateId];
  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden relative">
        <div className="lg:hidden absolute top-4 right-4 z-10">
            <Link
                to="/resume"
                className="flex items-center px-4 py-2 bg-gray-700/80 dark:bg-gray-900/80 backdrop-blur-sm text-white font-bold rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
            >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
            </Link>
        </div>
        <div id="resume-preview">
            <TemplateComponent data={resumeData} theme={selectedTheme} formatting={formattingOptions} themeMode={themeMode} />
        </div>
    </div>
  );
};

export default ResumePreview;