import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const ElegantTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const colors = (themeMode === 'dark' && theme.dark) ? theme.dark : theme.colors;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-8 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.primary }}>{title}</h2>
            </div>
            <div className="col-span-12 md:col-span-9">
                {children}
            </div>
        </section>
    );

    return (
        <div className={`p-10 min-h-[297mm] ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <header className="text-center mb-10 pb-6 border-b" style={{ borderColor: colors.secondary }}>
                <h1 className="text-5xl font-serif font-bold tracking-tight">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-lg mt-1">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                <div className="flex justify-center flex-wrap items-center space-x-4 text-xs mt-4 opacity-80">
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

            <Section title="Experience">
                {experiencesToRender.map(exp => (
                    <div key={exp.id} className="mb-6">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                            <p className="text-xs opacity-70">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-md font-semibold">{exp.company}, {exp.location}</p>
                        <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                             {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            <Section title="Education">
                {educationToRender.map(edu => (
                    <div key={edu.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold">{edu.degree}</h3>
                            <p className="text-xs opacity-70">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-md font-semibold">{edu.institution}, {edu.location}</p>
                    </div>
                ))}
            </Section>

            <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                    {skillsToRender.map(skill => (
                        <span key={skill.id} className="text-sm font-medium px-3 py-1 border rounded" style={{ borderColor: colors.secondary, color: colors.text }}>
                            {skill.name}
                        </span>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default ElegantTemplate;