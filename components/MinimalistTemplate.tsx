import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const MinimalistTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const colors = (themeMode === 'dark' && theme.dark) ? theme.dark : theme.colors;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;
    
    const mutedTextColor = themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const bodyTextColor = themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700';


    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest pb-2 mb-4 border-b" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>{title}</h2>
            {children}
        </section>
    );

    return (
        <div className={`p-6 sm:p-10 ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold tracking-tight">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-xl mt-1 font-light tracking-wide">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                <div className={`flex justify-center items-center space-x-3 text-xs mt-4 ${mutedTextColor}`}>
                    <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
                    <span>&bull;</span>
                    <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
                    <span>&bull;</span>
                    <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
                </div>
            </header>

            <Section title="Summary">
                <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
            </Section>

            {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                <Section title="Additional Details">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {personalInfo.nationality && (
                            <div>
                                <p className="font-semibold">Nationality</p>
                                <p className={bodyTextColor}>{personalInfo.nationality}</p>
                            </div>
                        )}
                        {customDetailsToRender.map(detail => (
                            <div key={detail.id}>
                                <p className="font-semibold">{detail.label}</p>
                                <p className={bodyTextColor}>{detail.value}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            <Section title="Experience">
                {experiencesToRender.map(exp => (
                    <div key={exp.id} className="mb-6">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold" style={{ color: colors.primary }}>{exp.jobTitle}</h3>
                            <p className={`text-xs font-mono ${mutedTextColor}`} style={{ opacity: 0.7 }}>{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-md font-semibold">{exp.company}, {exp.location}</p>
                        <ul className={`list-disc list-inside mt-2 text-sm space-y-1 ${bodyTextColor}`}>
                            {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            <Section title="Education">
                {educationToRender.map(edu => (
                    <div key={edu.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold" style={{ color: colors.primary }}>{edu.degree}</h3>
                            <p className={`text-xs font-mono ${mutedTextColor}`} style={{ opacity: 0.7 }}>{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-md font-semibold">{edu.institution}, {edu.location}</p>
                    </div>
                ))}
            </Section>

            <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                    {skillsToRender.map(skill => (
                        <span key={skill.id} className="text-sm px-4 py-1.5 rounded" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
                            {skill.name}
                        </span>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default MinimalistTemplate;