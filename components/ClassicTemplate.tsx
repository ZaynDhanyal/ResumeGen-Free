import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { SectionKey } from '../types';

const ClassicTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
  const { personalInfo, summary, experience, education, skills, customDetails, sectionOrder } = data;
  const { colors } = theme;
  const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
  const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

  const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
  const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
  const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
  const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

  // Fallback if sectionOrder is missing in legacy data
  const order = sectionOrder || ['personalInfo', 'customDetails', 'summary', 'experience', 'education', 'skills'];

  const renderSection = (key: SectionKey) => {
    switch(key) {
        case 'personalInfo':
            // In Classic Template, Personal Info is always the header.
            // We render the header separately below, so we might skip it here or render it if we wanted fully dynamic layout.
            // For "Classic", we'll keep the header fixed at top for design consistency, 
            // but render other sections dynamically.
            // However, the user might want to move Personal Info below summary? Unlikely for Classic resume.
            // To adhere to "layout control", we will render the non-header parts here if placed elsewhere?
            // Standard practice: Header is static. Body sections are dynamic.
            return null; 

        case 'customDetails':
             // Often part of header in Classic, but if moved down, we can render it as a section.
             // For Classic, we rendered it just below header.
             // Let's make it dynamic. If it is in the order list, we render it.
             // BUT: The original template put it right under the contact info.
             // Let's split: Header (Name/Title) is static. Contact/Details/Summary/etc follow order.
             if (customDetailsToRender.length === 0 && !personalInfo.nationality) return null;
             return (
                <div className={`flex justify-center flex-wrap gap-x-4 gap-y-1 text-[10px] mb-3 ${lineHeightClass}`}>
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
             );

        case 'summary':
            if (!summary && !SAMPLE_RESUME.summary) return null;
            return (
                <section className="mb-3">
                    <h2 className="text-sm font-bold border-b pb-1 mb-1.5 uppercase tracking-wide" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Summary</h2>
                    <p className={`text-xs ${lineHeightClass}`}>{summary || SAMPLE_RESUME.summary}</p>
                </section>
            );

        case 'experience':
            return (
                <section className="mb-3">
                    <h2 className="text-sm font-bold border-b pb-1 mb-1.5 uppercase tracking-wide" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Experience</h2>
                    {experiencesToRender.map(exp => (
                    <div key={exp.id} className="mb-2.5">
                        <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-sm font-bold">{exp.jobTitle}</h3>
                        <p className="text-[10px] text-gray-600 font-mono" style={{ color: colors.text, opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-xs italic font-semibold mb-0.5" style={{ color: colors.primary }}>{exp.company}, {exp.location}</p>
                        <ul className={`list-disc list-inside text-xs space-y-0.5 ${lineHeightClass}`}>
                        {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i} className="pl-1">{line.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                    ))}
                </section>
            );

        case 'education':
             return (
                <section className="mb-3">
                    <h2 className="text-sm font-bold border-b pb-1 mb-1.5 uppercase tracking-wide" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Education</h2>
                    {educationToRender.map(edu => (
                    <div key={edu.id} className="mb-2">
                        <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold">{edu.degree}</h3>
                        <p className="text-[10px] font-mono" style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-xs italic opacity-90">{edu.institution}, {edu.location}</p>
                    </div>
                    ))}
                </section>
             );

        case 'skills':
            return (
                <section>
                    <h2 className="text-sm font-bold border-b pb-1 mb-1.5 uppercase tracking-wide" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Skills</h2>
                    <div className={`flex flex-wrap gap-1.5 mt-1.5`}>
                    {skillsToRender.map(skill => <span key={skill.id} className="text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: colors.secondary, color: colors.text }}>{skill.name}</span>)}
                    </div>
                </section>
            );
        default:
            return null;
    }
  };

  return (
    <div className={`p-5 ${fontClass}`} style={{ backgroundColor: colors.background, color: colors.text, minHeight: '297mm' }}>
      <header className="text-center mb-4 border-b-2 pb-2" style={{ borderBottomColor: colors.primary }}>
        <h1 className="text-2xl font-bold tracking-wider uppercase mb-0.5" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
        <p className="text-sm font-medium tracking-widest opacity-80">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
      </header>
      
      <div className={`flex justify-center space-x-3 text-[10px] mb-3 flex-wrap opacity-80 ${lineHeightClass}`}>
        <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
        {personalInfo.phone && <><span className="hidden sm:inline">|</span><span>{personalInfo.phone}</span></>}
        {personalInfo.address && <><span className="hidden sm:inline">|</span><span>{personalInfo.address}</span></>}
        {personalInfo.linkedin && <><span className="hidden sm:inline">|</span><span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span></>}
        {personalInfo.website && <><span className="hidden sm:inline">|</span><span>{personalInfo.website.replace(/^https?:\/\//, '')}</span></>}
      </div>

      {order.map(key => renderSection(key))}
    </div>
  );
};

export default ClassicTemplate;