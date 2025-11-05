import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const skillLevelToPercentage = (level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') => {
    switch (level) {
        case 'Beginner': return '25%';
        case 'Intermediate': return '50%';
        case 'Advanced': return '75%';
        case 'Expert': return '100%';
        default: return '0%';
    }
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
    
    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-0 min-h-[297mm] ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <aside className="col-span-12 md:col-span-4 p-4 sm:p-8" style={{ backgroundColor: colors.secondary }}>
                <header className="mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-lg" style={{ color: colors.text, opacity: 0.9 }}>{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </header>
                
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Contact</h2>
                    <p className="text-xs mb-1 break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                    <p className="text-xs mb-1 break-all">{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                    <p className="text-xs mb-1 break-all">{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                    <p className="text-xs mb-1 break-all">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</p>
                    <p className="text-xs mb-1 break-all">{personalInfo.website || SAMPLE_RESUME.personalInfo.website}</p>
                </section>

                {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                     <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Details</h2>
                        <div className="space-y-2">
                            {personalInfo.nationality && (
                                <div>
                                    <p className="text-xs font-bold">Nationality</p>
                                    <p className="text-xs">{personalInfo.nationality}</p>
                                </div>
                            )}
                            {customDetailsToRender.map(detail => (
                                <div key={detail.id}>
                                    <p className="text-xs font-bold">{detail.label}</p>
                                    <p className="text-xs">{detail.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Skills</h2>
                    <div className="space-y-3">
                        {skillsToRender.map(skill => (
                            <div key={skill.id} className="flex items-center gap-2">
                                <p className="w-1/3 text-xs font-semibold truncate" title={skill.name}>{skill.name}</p>
                                <div className="w-2/3">
                                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full" style={{ width: skillLevelToPercentage(skill.level), backgroundColor: colors.primary }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Education</h2>
                    {educationToRender.map(edu => (
                        <div key={edu.id} className="mb-3">
                            <h3 className="font-bold text-xs">{edu.degree}</h3>
                            <p className="text-xs italic">{edu.institution}</p>
                            <p className="text-xs" style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </section>
            </aside>
            <main className="col-span-12 md:col-span-8 p-4 sm:p-8">
                <section className="mb-6">
                    <h2 className="text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-3" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Summary</h2>
                    <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold uppercase tracking-wider border-b-2 pb-2 mb-3" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Experience</h2>
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
                </section>
            </main>
        </div>
    );
};

export default TechTemplate;