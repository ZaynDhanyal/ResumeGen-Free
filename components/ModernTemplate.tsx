import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const ModernTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
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
            <h2 className="text-lg font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: colors.primary }}>
                {title}
            </h2>
            {children}
        </section>
    );

    return (
        <div className={`p-10 min-h-[297mm] ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-lg font-medium">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
            </header>
            
            <div className="grid grid-cols-12 gap-x-8">
                <main className="col-span-12 md:col-span-8">
                    <Section title="Summary">
                        <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                    </Section>
                    <Section title="Experience">
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
                    </Section>
                </main>

                <aside className="col-span-12 md:col-span-4 md:border-l md:pl-8" style={{ borderColor: colors.secondary }}>
                    <Section title="Contact">
                        <div className="space-y-1 text-sm">
                            <p className="break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                            <p>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                            <p>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                            <p className="break-all">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</p>
                            <p className="break-all">{personalInfo.website || SAMPLE_RESUME.personalInfo.website}</p>
                        </div>
                    </Section>
                    {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                        <Section title="Details">
                            <div className="space-y-2 text-sm">
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
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {skillsToRender.map(skill => <span key={skill.id} className="inline-flex items-center text-sm px-3 py-1 rounded" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
                        </div>
                    </Section>
                    <Section title="Education">
                        {educationToRender.map(edu => (
                            <div key={edu.id} className="mb-3 text-sm">
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="italic">{edu.institution}</p>
                                <p style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </Section>
                </aside>
            </div>
        </div>
    );
};

export default ModernTemplate;