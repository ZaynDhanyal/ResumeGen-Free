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
        <section className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: colors.primary }}>{title}</h2>
            <div className="border-l-2 pl-6" style={{ borderColor: colors.secondary }}>
                {children}
            </div>
        </section>
    );

    return (
        <div className={`p-6 sm:p-12 min-h-[297mm] font-serif ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <header className="text-center mb-10">
                <h1 className="text-5xl font-serif font-bold tracking-tight">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-lg mt-1 font-sans">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                <div className="flex justify-center flex-wrap items-center space-x-4 text-xs mt-4 font-sans opacity-80">
                    <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
                    <span>&bull;</span>
                    <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
                    <span>&bull;</span>
                    <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
                </div>
            </header>

            <Section title="Summary">
                <p className="text-sm font-sans">{summary || SAMPLE_RESUME.summary}</p>
            </Section>

            {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                <Section title="Details">
                    <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                        {personalInfo.nationality && (
                             <div>
                                <p className="font-semibold">Nationality</p>
                                <p>{personalInfo.nationality}</p>
                            </div>
                        )}
                        {customDetailsToRender.map(detail => (
                            <div key={detail.id}>
                                <p className="font-semibold">{detail.label}</p>
                                <p>{detail.value}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            <Section title="Experience">
                {experiencesToRender.map(exp => (
                    <div key={exp.id} className="mb-6">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-sans font-bold">{exp.jobTitle}</h3>
                            <p className="text-xs font-sans opacity-70">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-md font-sans font-semibold">{exp.company}, {exp.location}</p>
                        <ul className="list-disc list-inside mt-2 text-sm font-sans space-y-1">
                             {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            <Section title="Education">
                {educationToRender.map(edu => (
                    <div key={edu.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-sans font-bold">{edu.degree}</h3>
                            <p className="text-xs font-sans opacity-70">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-md font-sans font-semibold">{edu.institution}, {edu.location}</p>
                    </div>
                ))}
            </Section>

            <Section title="Skills">
                <div className="flex flex-wrap gap-2 font-sans">
                    {skillsToRender.map(skill => (
                        <span key={skill.id} className="text-sm font-medium px-3 py-1 border-2 rounded-full" style={{ borderColor: colors.secondary, color: colors.primary }}>
                            {skill.name}
                        </span>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default ElegantTemplate;
