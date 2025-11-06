import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ResumeData, TemplateId, ThemeId, Experience, Education, Skill, FormattingOptions } from '../types';
import { EMPTY_EXPERIENCE, EMPTY_EDUCATION, EMPTY_SKILL, EMPTY_CUSTOM_DETAIL, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import TemplateSelector from './TemplateSelector';
import ThemeSelector from './ThemeSelector';
import KeywordOptimizer from './KeywordOptimizer';
import AiSuggestionModal from './AiSuggestionModal';
import AdsenseBlock from './AdsenseBlock';
import { PersonalInfoIcon, SummaryIcon, ExperienceIcon, EducationIcon, SkillsIcon, AddIcon, TrashIcon, MagicIcon, DownloadIcon, PaletteIcon, DocumentTextIcon, XCircleIcon, ShareIcon, EyeIcon, InformationCircleIcon, GlobeAltIcon, UsersIcon, IdentificationIcon, CalendarIcon } from './icons';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onDataChange: <T,>(section: keyof ResumeData, data: T, index?: number) => void;
  onAddItem: (section: keyof ResumeData, item: any) => void;
  onRemoveItem: (section: keyof ResumeData, index: number) => void;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  onDownloadPdf: () => void;
  formattingOptions: FormattingOptions;
  setFormattingOptions: (options: FormattingOptions) => void;
  onClearAll: () => void;
  onClearSection: (section: keyof ResumeData) => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; onClear?: () => void }> = ({ title, icon, children, onClear }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        {icon}
        <h2 className="text-xl font-bold text-gray-800 ml-3">{title}</h2>
      </div>
      {onClear && (
        <button
          onClick={onClear}
          title={`Clear ${title} section`}
          className="p-1 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )}
    </div>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" rows={5} />
);

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData, onDataChange, onAddItem, onRemoveItem, templateId, setTemplateId, themeId, setThemeId, onDownloadPdf, formattingOptions, setFormattingOptions, onClearAll, onClearSection
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'summary' | 'bulletPoints'; context: any; onAccept: (text: string) => void } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleAiClick = useCallback((type: 'summary' | 'bulletPoints', context: any, onAccept: (text: string) => void) => {
    setModalConfig({ type, context, onAccept });
    setModalOpen(true);
  }, []);

  const handleUpdateField = useCallback(<K extends keyof T, T>(
    section: keyof ResumeData,
    index: number | undefined,
    field: K,
    value: T[K]
  ) => {
    const sectionData = index !== undefined
      ? (resumeData[section] as any[])[index]
      : resumeData[section];

    const updatedData = { ...sectionData, [field]: value };
    onDataChange(section, updatedData, index);
  }, [resumeData, onDataChange]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            handleUpdateField('personalInfo', undefined, 'profilePicture', base64String);
        };
        reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
      handleUpdateField('personalInfo', undefined, 'profilePicture', '');
  };

  const handleShare = useCallback(() => {
    try {
      const jsonString = JSON.stringify(resumeData);
      const base64String = window.btoa(unescape(encodeURIComponent(jsonString)));
      const url = `${window.location.origin}${window.location.pathname}#share=${base64String}`;
      
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    } catch (error) {
      console.error("Failed to generate share link:", error);
    }
  }, [resumeData]);

  const getIconForLabel = (label: string): React.ReactNode => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('nation') || lowerLabel.includes('country')) {
        return <GlobeAltIcon className="h-5 w-5 text-gray-500" />;
    }
    if (lowerLabel.includes('marital') || lowerLabel.includes('relationship')) {
        return <UsersIcon className="h-5 w-5 text-gray-500" />;
    }
    if (lowerLabel.includes('license') || lowerLabel.includes('cnic') || lowerLabel.includes('id')) {
        return <IdentificationIcon className="h-5 w-5 text-gray-500" />;
    }
    if (lowerLabel.includes('birth') || lowerLabel.includes('dob')) {
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
    return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="h-full overflow-y-auto pr-0 lg:pr-4">
      {modalOpen && modalConfig && (
        <AiSuggestionModal
          type={modalConfig.type}
          context={modalConfig.context}
          onClose={() => setModalOpen(false)}
          onAccept={modalConfig.onAccept}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 flex-wrap">
            <div className="w-full"><TemplateSelector selected={templateId} onSelect={setTemplateId} /></div>
            <div className="flex w-full flex-col sm:flex-row sm:w-auto gap-2 flex-wrap">
                <button
                    onClick={handleShare}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    <ShareIcon className="h-5 w-5 mr-2" />
                    {isCopied ? 'Copied!' : 'Share'}
                </button>
                <button
                    onClick={onDownloadPdf}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download PDF
                </button>
                <button
                    onClick={onClearAll}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                    >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Clear All
                </button>
            </div>
        </div>
        <div className="mt-6 border-t pt-6">
             <div className="flex items-center mb-4">
                <PaletteIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800 ml-3">Color Theme</h3>
            </div>
            <ThemeSelector selectedTheme={themeId} onSelectTheme={setThemeId} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800 ml-3">Formatting</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                <select
                    value={formattingOptions.fontFamily}
                    onChange={(e) => setFormattingOptions({ ...formattingOptions, fontFamily: e.target.value as FormattingOptions['fontFamily'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                    {FONT_OPTIONS.map(font => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Line Spacing</label>
                <div className="flex items-center space-x-2">
                    {LINE_HEIGHT_OPTIONS.map(spacing => (
                        <button
                            key={spacing.id}
                            onClick={() => setFormattingOptions({ ...formattingOptions, lineHeight: spacing.id })}
                            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                                formattingOptions.lineHeight === spacing.id
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {spacing.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>


      <Section title="Personal Info" icon={<PersonalInfoIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('personalInfo')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={e => handleUpdateField('personalInfo', undefined, 'fullName', e.target.value)} />
          <Input placeholder="Job Title" value={resumeData.personalInfo.jobTitle} onChange={e => handleUpdateField('personalInfo', undefined, 'jobTitle', e.target.value)} />
          <Input placeholder="Email Address" type="email" value={resumeData.personalInfo.email} onChange={e => handleUpdateField('personalInfo', undefined, 'email', e.target.value)} />
          <Input placeholder="Phone Number" value={resumeData.personalInfo.phone} onChange={e => handleUpdateField('personalInfo', undefined, 'phone', e.target.value)} />
          <Input placeholder="City, State" value={resumeData.personalInfo.address} onChange={e => handleUpdateField('personalInfo', undefined, 'address', e.target.value)} />
          <Input placeholder="LinkedIn Profile URL" value={resumeData.personalInfo.linkedin} onChange={e => handleUpdateField('personalInfo', undefined, 'linkedin', e.target.value)} />
          <Input placeholder="Personal Website/Portfolio" value={resumeData.personalInfo.website} onChange={e => handleUpdateField('personalInfo', undefined, 'website', e.target.value)} />
          <Input placeholder="Nationality" value={resumeData.personalInfo.nationality} onChange={e => handleUpdateField('personalInfo', undefined, 'nationality', e.target.value)} />
        </div>
        <div className="mt-4 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
                {resumeData.personalInfo.profilePicture && (
                    <div className="relative flex-shrink-0">
                        <img src={resumeData.personalInfo.profilePicture} alt="Profile Preview" className="h-20 w-20 rounded-full object-cover" />
                        <button 
                            onClick={removeProfilePicture} 
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 leading-none hover:bg-red-600"
                            title="Remove picture"
                        >
                            <XCircleIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleImageUpload} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
        </div>
      </Section>
      
      <Section title="Custom Details" icon={<InformationCircleIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('customDetails')}>
        <p className="text-sm text-gray-500 mb-4 -mt-2">Add custom fields like Marital Status, etc.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeData.customDetails.map((detail, index) => (
            <div key={detail.id} className="relative bg-gray-50 p-4 border rounded-lg shadow-sm">
                <button onClick={() => onRemoveItem('customDetails', index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors">
                    <TrashIcon className="h-5 w-5"/>
                </button>
                <div className="flex items-start gap-4">
                    <div className="mt-2.5 flex-shrink-0">
                        {getIconForLabel(detail.label)}
                    </div>
                    <div className="flex-1 space-y-2">
                         <Input 
                            placeholder="Label (e.g., Marital Status)" 
                            value={detail.label} 
                            onChange={e => handleUpdateField('customDetails', index, 'label', e.target.value)} 
                         />
                         <Input 
                            placeholder="Value (e.g., Single)" 
                            value={detail.value} 
                            onChange={e => handleUpdateField('customDetails', index, 'value', e.target.value)} 
                         />
                    </div>
                </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => onAddItem('customDetails', { ...EMPTY_CUSTOM_DETAIL, id: crypto.randomUUID() })} 
          className="mt-4 flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
        >
          <AddIcon className="h-5 w-5 mr-2" /> Add Custom Detail
        </button>
      </Section>

      <Section title="Professional Summary" icon={<SummaryIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('summary')}>
        <Textarea placeholder="Write a brief 2-3 sentence summary of your professional experience and career goals." value={resumeData.summary} onChange={e => onDataChange('summary', e.target.value)} />
        <button
          onClick={() => handleAiClick('summary', { jobTitle: resumeData.personalInfo.jobTitle, experience: resumeData.experience, skills: resumeData.skills }, (text) => onDataChange('summary', text))}
          className="mt-2 flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition-colors text-sm"
        >
          <MagicIcon className="h-4 w-4 mr-2" />
          Generate with AI
        </button>
      </Section>

      <Section title="Experience" icon={<ExperienceIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('experience')}>
        {resumeData.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 border rounded-md mb-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input placeholder="Job Title" value={exp.jobTitle} onChange={e => handleUpdateField('experience', index, 'jobTitle', e.target.value)} />
              <Input placeholder="Company Name" value={exp.company} onChange={e => handleUpdateField('experience', index, 'company', e.target.value)} />
              <Input placeholder="City, State" value={exp.location} onChange={e => handleUpdateField('experience', index, 'location', e.target.value)} />
              <div className="flex gap-4">
                <Input placeholder="Start Date (e.g., Jan 2020)" value={exp.startDate} onChange={e => handleUpdateField('experience', index, 'startDate', e.target.value)} />
                <Input placeholder="End Date (e.g., Present)" value={exp.endDate} onChange={e => handleUpdateField('experience', index, 'endDate', e.target.value)} />
              </div>
            </div>
            <Textarea placeholder="Describe your responsibilities and achievements in bullet points. e.g., • Led the development of a new client-facing dashboard..." value={exp.description} onChange={e => handleUpdateField('experience', index, 'description', e.target.value)} />
             <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => handleAiClick('bulletPoints', { jobTitle: exp.jobTitle, company: exp.company, description: exp.description }, (text) => handleUpdateField('experience', index, 'description', text))}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                <MagicIcon className="h-4 w-4 mr-2" />
                Generate Bullets with AI
              </button>
              <button onClick={() => onRemoveItem('experience', index)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="h-5 w-5"/></button>
            </div>
          </div>
        ))}
        <button onClick={() => onAddItem('experience', { ...EMPTY_EXPERIENCE, id: crypto.randomUUID() })} className="mt-2 flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
          <AddIcon className="h-5 w-5 mr-2" /> Add Experience
        </button>
      </Section>
      
      <Section title="Education" icon={<EducationIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('education')}>
        {resumeData.education.map((edu, index) => (
          <div key={edu.id} className="p-4 border rounded-md mb-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input placeholder="Degree or Field of Study" value={edu.degree} onChange={e => handleUpdateField('education', index, 'degree', e.target.value)} />
              <Input placeholder="Institution Name" value={edu.institution} onChange={e => handleUpdateField('education', index, 'institution', e.target.value)} />
              <div className="flex gap-4">
                <Input placeholder="Start Date (e.g., Sep 2013)" value={edu.startDate} onChange={e => handleUpdateField('education', index, 'startDate', e.target.value)} />
                <Input placeholder="End Date (e.g., May 2017)" value={edu.endDate} onChange={e => handleUpdateField('education', index, 'endDate', e.target.value)} />
              </div>
            </div>
            <button onClick={() => onRemoveItem('education', index)} className="text-red-500 hover:text-red-700 p-2 float-right"><TrashIcon className="h-5 w-5"/></button>

          </div>
        ))}
        <button onClick={() => onAddItem('education', { ...EMPTY_EDUCATION, id: crypto.randomUUID() })} className="mt-2 flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
          <AddIcon className="h-5 w-5 mr-2" /> Add Education
        </button>
      </Section>

      <Section title="Skills" icon={<SkillsIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('skills')}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resumeData.skills.map((skill, index) => (
          <div key={skill.id} className="flex items-center bg-gray-50 p-2 border rounded-md">
            <Input placeholder="Skill (e.g., React)" value={skill.name} onChange={e => handleUpdateField('skills', index, 'name', e.target.value)} className="flex-grow" />
            <button onClick={() => onRemoveItem('skills', index)} className="ml-2 text-red-500 hover:text-red-700 p-1"><TrashIcon className="h-4 w-4"/></button>
          </div>
        ))}
        </div>
        <button onClick={() => onAddItem('skills', { ...EMPTY_SKILL, id: crypto.randomUUID() })} className="mt-4 flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
          <AddIcon className="h-5 w-5 mr-2" /> Add Skill
        </button>
      </Section>
      
      <div className="my-6">
        <AdsenseBlock width="w-full" height="h-24" />
      </div>

      <KeywordOptimizer resumeData={resumeData}/>

      {/* Mobile View Toggle */}
      <div className="lg:hidden sticky bottom-4 flex justify-center">
        <Link
            to="/resume/preview"
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
            <EyeIcon className="h-6 w-6 mr-2" />
            Show Preview
        </Link>
      </div>

    </div>
  );
};

export default ResumeEditor;