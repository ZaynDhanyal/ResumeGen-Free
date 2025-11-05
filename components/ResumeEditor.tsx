import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ResumeData, TemplateId, ThemeId, FormattingOptions, AffiliateBanner, ThemeMode } from '../types';
import { EMPTY_EXPERIENCE, EMPTY_EDUCATION, EMPTY_SKILL, EMPTY_CUSTOM_DETAIL, simpleUUID } from '../constants';
import TemplateSelector from './TemplateSelector';
import ThemeSelector from './ThemeSelector';
import KeywordOptimizer from './KeywordOptimizer';
import AtsChecker from './AtsChecker';
import AiSuggestionModal from './AiSuggestionModal';
import ImageCropperModal from './ImageCropperModal';
import { PersonalInfoIcon, SummaryIcon, ExperienceIcon, EducationIcon, SkillsIcon, AddIcon, TrashIcon, MagicIcon, DownloadIcon, PaletteIcon, XCircleIcon, ShareIcon, EyeIcon, InformationCircleIcon, GlobeAltIcon, UsersIcon, IdentificationIcon, CalendarIcon, ArrowLeftIcon } from './icons';
import ResumePreview from './ResumePreview';

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
  <textarea {...props} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-gray-400 resize-none" rows={5} />
);

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData, onDataChange, onAddItem, onRemoveItem, templateId, setTemplateId, themeId, setThemeId, onDownloadPdf, formattingOptions, setFormattingOptions, onClearAll, onClearSection, affiliateBanners, theme
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'summary' | 'bulletPoints'; context: any; onAccept: (text: string) => void } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState('personalInfo');
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sections = [
    { id: 'personalInfo', title: 'Personal', icon: <PersonalInfoIcon className="h-5 w-5" /> },
    { id: 'customDetails', title: 'Custom', icon: <InformationCircleIcon className="h-5 w-5" /> },
    { id: 'summary', title: 'Summary', icon: <SummaryIcon className="h-5 w-5" /> },
    { id: 'experience', title: 'Experience', icon: <ExperienceIcon className="h-5 w-5" /> },
    { id: 'education', title: 'Education', icon: <EducationIcon className="h-5 w-5" /> },
    { id: 'skills', title: 'Skills', icon: <SkillsIcon className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;
  
    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const threshold = 100;
  
      let currentSectionId = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = sectionRefs.current[section.id];
        if (element && element.offsetTop - threshold <= scrollPosition) {
          currentSectionId = section.id;
          break;
        }
      }
      
      const newId = currentSectionId || 'personalInfo';

      setActiveSectionId(prevId => {
        return newId !== prevId ? newId : prevId;
      });
    };
  
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sections]);


  const handleAiClick = useCallback((type: 'summary' | 'bulletPoints', context: any, onAccept: (text: string) => void) => {
    setModalConfig({ type, context, onAccept });
    setModalOpen(true);
  }, []);

  const handleUpdateField = useCallback((
    section: keyof ResumeData,
    index: number | undefined,
    field: string,
    value: any
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
            setImageToCrop(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSaveCrop = (croppedImageUrl: string) => {
    handleUpdateField('personalInfo', undefined, 'profilePicture', croppedImageUrl);
    setImageToCrop(null);
  };

  const removeProfilePicture = () => {
      handleUpdateField('personalInfo', undefined, 'profilePicture', '');
  };

  const handleShare = useCallback(() => {
    try {
      const jsonString = JSON.stringify(resumeData);
      const base64String = window.btoa(encodeURIComponent(jsonString));
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
        return <GlobeAltIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
    if (lowerLabel.includes('marital') || lowerLabel.includes('relationship')) {
        return <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
    if (lowerLabel.includes('license') || lowerLabel.includes('cnic') || lowerLabel.includes('id')) {
        return <IdentificationIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
    if (lowerLabel.includes('birth') || lowerLabel.includes('dob')) {
        return <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
    return <InformationCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
  };

  return (
    <>
      <div ref={mainContainerRef} className="h-full overflow-y-auto pr-0 lg:pr-4">
        {modalOpen && modalConfig && (
          <AiSuggestionModal
            type={modalConfig.type}
            context={modalConfig.context}
            onClose={() => setModalOpen(false)}
            onAccept={modalConfig.onAccept}
          />
        )}
        {imageToCrop && (
          <ImageCropperModal
            imageSrc={imageToCrop}
            onClose={() => setImageToCrop(null)}
            onCropComplete={handleSaveCrop}
          />
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 flex-wrap">
              <div className="w-full"><TemplateSelector selected={templateId} onSelect={setTemplateId} themeId={themeId} /></div>
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
          <div className="mt-6 border-t dark:border-gray-700 pt-6">
              <div className="flex items-center mb-4">
                  <PaletteIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-3">Color Theme</h3>
              </div>
              <ThemeSelector selectedTheme={themeId} onSelectTheme={setThemeId} />
          </div>
        </div>
        
        <div className="lg:hidden sticky top-0 z-30 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm py-2 px-2 -mx-2 shadow-sm">
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
              {sections.map(section => (
              <button
                  key={section.id}
                  onClick={() => {
                      const element = sectionRefs.current[section.id];
                      if (element) {
                          const top = element.offsetTop - 70;
                          mainContainerRef.current?.scrollTo({ top, behavior: 'smooth' });
                          setActiveSectionId(section.id);
                      }
                  }}
                  className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                      activeSectionId === section.id
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                  {section.icon}
                  <span>{section.title}</span>
              </button>
              ))}
          </div>
        </div>
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        
        <div className="lg:mt-0 mt-4">
          <div ref={el => { sectionRefs.current.personalInfo = el; }}>
            <Section title="Personal Info" icon={<PersonalInfoIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('personalInfo')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={e => handleUpdateField('personalInfo', undefined, 'fullName', e.target.value)} />
                <Input placeholder="Job Title" value={resumeData.personalInfo.jobTitle} onChange={e => handleUpdateField('personalInfo', undefined, 'jobTitle', e.target.value)} />
                <Input placeholder="Email Address" type="email" value={resumeData.personalInfo.email} onChange={e => handleUpdateField('personalInfo', undefined, 'email', e.target.value)} />
                <Input placeholder="Phone Number" value={resumeData.personalInfo.phone} onChange={e => handleUpdateField('personalInfo', undefined, 'phone', e.target.value)} />
                <Input placeholder="City, State" value={resumeData.personalInfo.address} onChange={e => handleUpdateField('personalInfo', undefined, 'address', e.target.value)} />
                <Textarea placeholder="LinkedIn Profile URL" value={resumeData.personalInfo.linkedin} onChange={e => handleUpdateField('personalInfo', undefined, 'linkedin', e.target.value)} rows={1} />
                <Textarea placeholder="Personal Website/Portfolio" value={resumeData.personalInfo.website} onChange={e => handleUpdateField('personalInfo', undefined, 'website', e.target.value)} rows={1} />
                <Input placeholder="Nationality" value={resumeData.personalInfo.nationality} onChange={e => handleUpdateField('personalInfo', undefined, 'nationality', e.target.value)} />
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
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
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"
                      />
                  </div>
              </div>
            </Section>
          </div>
          
          <div ref={el => { sectionRefs.current.customDetails = el; }}>
            <Section title="Custom Details" icon={<InformationCircleIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('customDetails')}>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">Add custom fields like Nationality, etc.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.customDetails.map((detail, index) => (
                  <div key={detail.id} className="relative bg-gray-50 dark:bg-gray-700/50 p-4 border dark:border-gray-700 rounded-lg shadow-sm">
                      <button onClick={() => onRemoveItem('customDetails', index)} className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
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
                onClick={() => onAddItem('customDetails', { ...EMPTY_CUSTOM_DETAIL, id: simpleUUID() })} 
                className="mt-4 flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <AddIcon className="h-5 w-5 mr-2" /> Add Custom Detail
              </button>
            </Section>
          </div>

          <div ref={el => { sectionRefs.current.summary = el; }}>
            <Section title="Professional Summary" icon={<SummaryIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('summary')}>
              <Textarea placeholder="Write a brief 2-3 sentence summary of your professional experience and career goals." value={resumeData.summary} onChange={e => onDataChange('summary', e.target.value)} />
              <button
                onClick={() => handleAiClick('summary', { jobTitle: resumeData.personalInfo.jobTitle, experience: resumeData.experience, skills: resumeData.skills }, (text) => onDataChange('summary', text))}
                className="mt-2 flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors text-sm"
              >
                <MagicIcon className="h-4 w-4 mr-2" />
                Generate with AI
              </button>
            </Section>
          </div>

          <div ref={el => { sectionRefs.current.experience = el; }}>
            <Section title="Experience" icon={<ExperienceIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('experience')}>
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border dark:border-gray-700 rounded-md mb-4 bg-gray-50 dark:bg-gray-700/50">
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
                      className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors text-sm"
                    >
                      <MagicIcon className="h-4 w-4 mr-2" />
                      Generate Bullets with AI
                    </button>
                    <button onClick={() => onRemoveItem('experience', index)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="h-5 w-5"/></button>
                  </div>
                </div>
              ))}
              <button onClick={() => onAddItem('experience', { ...EMPTY_EXPERIENCE, id: simpleUUID() })} className="mt-2 flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <AddIcon className="h-5 w-5 mr-2" /> Add Experience
              </button>
            </Section>
          </div>
          
          <div ref={el => { sectionRefs.current.education = el; }}>
            <Section title="Education" icon={<EducationIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('education')}>
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border dark:border-gray-700 rounded-md mb-4 bg-gray-50 dark:bg-gray-700/50">
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
              <button onClick={() => onAddItem('education', { ...EMPTY_EDUCATION, id: simpleUUID() })} className="mt-2 flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <AddIcon className="h-5 w-5 mr-2" /> Add Education
              </button>
            </Section>
          </div>

          <div ref={el => { sectionRefs.current.skills = el; }}>
            <Section title="Skills" icon={<SkillsIcon className="h-6 w-6 text-blue-600" />} onClear={() => onClearSection('skills')}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {resumeData.skills.map((skill, index) => (
                <div key={skill.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 border dark:border-gray-700 rounded-lg space-y-2">
                  <Input 
                    placeholder="Skill (e.g., React)" 
                    value={skill.name} 
                    onChange={e => handleUpdateField('skills', index, 'name', e.target.value)} 
                  />
                  <div className="flex items-center justify-between">
                    <select
                        value={skill.level}
                        onChange={e => handleUpdateField('skills', index, 'level', e.target.value)}
                        aria-label={`Skill level for ${skill.name}`}
                        className="w-full text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                    </select>
                    <button onClick={() => onRemoveItem('skills', index)} className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                        <TrashIcon className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
              ))}
              </div>
              <button onClick={() => onAddItem('skills', { ...EMPTY_SKILL, id: simpleUUID() })} className="mt-4 flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <AddIcon className="h-5 w-5 mr-2" /> Add Skill
              </button>
            </Section>
          </div>
        </div>
        
        <KeywordOptimizer resumeData={resumeData}/>

        <AtsChecker resumeData={resumeData} />
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
          <div className="lg:hidden fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col animate-fade-in">
              <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
                  <button 
                      onClick={() => setIsMobilePreviewOpen(false)}
                      className="flex items-center text-blue-600 dark:text-blue-400 font-semibold"
                  >
                      <ArrowLeftIcon className="h-6 w-6 mr-2" />
                      Back to Editor
                  </button>
                  <h2 className="text-lg font-bold">Resume Preview</h2>
              </header>
              <div className="flex-grow overflow-y-auto">
                  <ResumePreview 
                      resumeData={resumeData} 
                      templateId={templateId} 
                      themeId={themeId} 
                      formattingOptions={formattingOptions} 
                      themeMode={theme}
                  />
              </div>
          </div>
      )}
    </>
  );
};

export default ResumeEditor;