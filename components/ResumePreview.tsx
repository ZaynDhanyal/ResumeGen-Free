import React from 'react';
import { Link } from 'react-router-dom';
import { ResumeData, TemplateId, Theme, ThemeId, FormattingOptions } from '../types';
import { THEMES, FONT_OPTIONS, LINE_HEIGHT_OPTIONS, SAMPLE_RESUME } from '../constants';
import { PersonalInfoIcon, PencilIcon } from './icons';
import TechTemplate from './TechTemplate';
import MinimalistTemplate from './MinimalistTemplate';

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

const ClassicTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
  const { personalInfo, summary, experience, education, skills, customDetails } = data;
  const { colors } = theme;
  const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
  const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

  const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
  const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
  const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
  const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

  return (
    <div className={`p-4 sm:p-8 ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
      <header className="text-center mb-8 border-b-2 pb-4" style={{ borderBottomColor: colors.primary }}>
        <h1 className="text-4xl font-bold tracking-wider uppercase" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
        <p className="text-lg font-light tracking-widest">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
      </header>
      <div className="flex justify-center space-x-6 text-sm mb-8 flex-wrap">
        <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
        <span className="hidden sm:inline">|</span>
        <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
        <span className="hidden sm:inline">|</span>
        <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
      </div>
      {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm mb-8">
              {personalInfo.nationality && (
                  <div>
                      <span className="font-semibold" style={{ color: colors.primary }}>Nationality:</span> {personalInfo.nationality}
                  </div>
              )}
              {customDetailsToRender.map(detail => (
                  <div key={detail.id}>
                      <span className="font-semibold" style={{ color: colors.primary }}>{detail.label}:</span> {detail.value}
                  </div>
              ))}
          </div>
      )}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary }}>Summary</h2>
        <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary }}>Experience</h2>
        {experiencesToRender.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
              <p className="text-sm" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
            </div>
            <p className="text-md italic">{exp.company}, {exp.location}</p>
            <ul className="list-disc list-inside mt-1 text-sm space-y-1">
              {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
            </ul>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary }}>Education</h2>
        {educationToRender.map(edu => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <p className="text-sm" style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
            </div>
            <p className="text-md italic">{edu.institution}, {edu.location}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary }}>Skills</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {skillsToRender.map(skill => <span key={skill.id} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
        </div>
      </section>
    </div>
  );
};

const ModernTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 p-4 sm:p-8 ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <aside className="col-span-1 md:pr-8 md:border-r-2" style={{ borderRightColor: colors.secondary }}>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-md">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </div>
                <section className="mb-6">
                    <h2 className="text-lg font-semibold uppercase mb-2" style={{ color: colors.primary }}>Contact</h2>
                    <p className="text-sm mb-1 break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                    <p className="text-sm mb-1">{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                    <p className="text-sm mb-1">{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                    <p className="text-sm mb-1">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</p>
                    <p className="text-sm mb-1">{personalInfo.website || SAMPLE_RESUME.personalInfo.website}</p>
                </section>
                {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold uppercase mb-2" style={{ color: colors.primary }}>Details</h2>
                        {personalInfo.nationality && (
                            <div className="text-sm mb-1">
                                <p className="font-bold">Nationality</p>
                                <p>{personalInfo.nationality}</p>
                            </div>
                        )}
                        {customDetailsToRender.map(detail => (
                            <div key={detail.id} className="text-sm mb-1">
                                <p className="font-bold">{detail.label}</p>
                                <p>{detail.value}</p>
                            </div>
                        ))}
                    </section>
                )}
                <section className="mb-6">
                    <h2 className="text-lg font-semibold uppercase mb-2" style={{ color: colors.primary }}>Skills</h2>
                    <ul className="space-y-1">
                        {skillsToRender.map(skill => <li key={skill.id} className="text-sm px-2 py-1 rounded" style={{ backgroundColor: colors.secondary }}>{skill.name}</li>)}
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg font-semibold uppercase mb-2" style={{ color: colors.primary }}>Education</h2>
                    {educationToRender.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <h3 className="font-bold text-sm">{edu.degree}</h3>
                            <p className="text-xs italic">{edu.institution}</p>
                            <p className="text-xs" style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </section>
            </aside>
            <main className="col-span-1 md:col-span-2">
                <section className="mb-6">
                    <h2 className="text-2xl font-bold border-b-2 pb-2 mb-3" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Summary</h2>
                    <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold border-b-2 pb-2 mb-3" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Experience</h2>
                    {experiencesToRender.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                                <p className="text-xs" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-md font-medium">{exp.company}, {exp.location}</p>
                            <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

const CreativeTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';
    
    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const creativeBg = '#F9FAFB';
    const creativeTextColor = '#111827';

    return (
        <div className={`p-4 sm:p-8 ${fontClass} ${lineHeightClass} relative`} style={{ backgroundColor: creativeBg, color: creativeTextColor }}>
            <div className="absolute top-0 left-0 w-full md:w-1/3 h-64 md:h-full z-0" style={{ backgroundColor: colors.primary }}></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <aside className="col-span-1 text-white text-center md:text-left">
                    {personalInfo.profilePicture ? (
                        <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-40 h-40 mx-auto mb-6 border-4 border-white shadow-lg object-cover"/>
                    ) : (
                        <div className="rounded-full w-40 h-40 mx-auto mb-6 border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                            <PersonalInfoIcon className="h-20 w-20 text-gray-400" />
                        </div>
                    )}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase mb-2">Contact</h2>
                        <p className="text-sm mb-1 break-words">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                        <p className="text-sm mb-1">{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                    </section>
                    {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold uppercase mb-2">Details</h2>
                             {personalInfo.nationality && (
                                <div className="text-sm mb-2">
                                    <p className="font-semibold">Nationality</p>
                                    <p className="opacity-90">{personalInfo.nationality}</p>
                                </div>
                             )}
                             {customDetailsToRender.map(detail => (
                                <div key={detail.id} className="text-sm mb-2">
                                    <p className="font-semibold">{detail.label}</p>
                                    <p className="opacity-90">{detail.value}</p>
                                </div>
                            ))}
                        </section>
                    )}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase mb-2">Education</h2>
                        {educationToRender.map(edu => (
                            <div key={edu.id} className="mb-2">
                                <h3 className="font-bold text-sm">{edu.degree}</h3>
                                <p className="text-xs italic">{edu.institution}</p>
                            </div>
                        ))}
                    </section>
                </aside>
                <main className="col-span-1 md:col-span-2 md:pl-8 text-gray-800">
                    <header className="mb-8 text-center md:text-left">
                        <h1 className="text-5xl font-extrabold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                        <p className="text-xl" style={{ color: creativeTextColor, opacity: 0.8 }}>{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                    </header>
                    <section className="mb-6">
                        <h2 className="text-xl font-bold uppercase mb-2" style={{ color: colors.primary }}>Summary</h2>
                        <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                    </section>
                    <section className="mb-6">
                        <h2 className="text-xl font-bold uppercase mb-2" style={{ color: colors.primary }}>Experience</h2>
                        {experiencesToRender.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <h3 className="text-lg font-semibold">{exp.jobTitle} at {exp.company}</h3>
                                <p className="text-xs" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                                <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                                    {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                     <section>
                        <h2 className="text-xl font-bold uppercase mb-2" style={{ color: colors.primary }}>Skills</h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {skillsToRender.map(skill => <span key={skill.id} className="text-sm px-3 py-1 rounded" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};


const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  tech: TechTemplate,
  minimalist: MinimalistTemplate,
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId, themeId, formattingOptions }) => {
  const TemplateComponent = templates[templateId];
  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
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