import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const skillLevelToDots = (level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') => {
    const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    return levels[level] || 0;
};

const TechTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const colors = (themeMode === 'dark' && theme.dark) ? theme.dark : theme.colors;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;
    
    const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
        <section className={`mb-6 ${className}`}>
            <h2 className="text-lg font-bold uppercase tracking-wider pb-1 mb-3 text-left" style={{ color: colors.primary }}>
                {title}
            </h2>
            {children}
        </section>
    );

    return (
        <div className={`grid grid-cols-12 gap-0 min-h-[297mm] ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <aside className="col-span-12 md:col-span-4 p-10" style={{ backgroundColor: colors.secondary }}>
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-lg" style={{ color: colors.text, opacity: 0.9 }}>{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </header>
                
                <Section title="Contact">
                    <div className="space-y-1 text-xs">
                        <p className="break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                        <p>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                        <p>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                        <p className="break-all">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</p>
                        <p className="break-all">{personalInfo.website || SAMPLE_RESUME.personalInfo.website}</p>
                    </div>
                </Section>
                
                <Section title="Skills">
                    <div className="space-y-3">
                        {skillsToRender.map(skill => (
                            <div key={skill.id}>
                                <p className="text-xs font-semibold mb-1">{skill.name}</p>
                                <div className="flex space-x-1">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className="h-2 w-full rounded-full"
                                            style={{ backgroundColor: i < skillLevelToDots(skill.level) ? colors.primary : '#d1d5db' }}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="Education">
                    {educationToRender.map(edu => (
                        <div key={edu.id} className="mb-3 text-sm">
                            <h3 className="font-bold">{edu.degree}</h3>
                            <p className="text-xs italic">{edu.institution}</p>
                            <p className="text-xs" style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </Section>
            </aside>
            <main className="col-span-12 md:col-span-8 p-10">
                <Section title="Summary">
                    <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                </Section>
                
                <Section title="Experience">
                    {experiencesToRender.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                                <p className="text-xs font-mono" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-md font-medium">{exp.company}, {exp.location}</p>
                            <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>
            </main>
        </div>
    );
};

export default TechTemplate;