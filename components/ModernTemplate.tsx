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
                    <p className="text-sm mb-1 break-all">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</p>
                    <p className="text-sm mb-1 break-all">{personalInfo.website || SAMPLE_RESUME.personalInfo.website}</p>
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
                <section className="mb-8">
                    <h2 className="text-lg font-semibold uppercase mb-2" style={{ color: colors.primary }}>Skills</h2>
                    <ul className="space-y-1">
                        {skillsToRender.map(skill => <li key={skill.id} className="text-sm px-2 py-1 rounded flex items-center" style={{ backgroundColor: colors.secondary }}>{skill.name}</li>)}
                    </ul>
                </section>
                <section className="mb-6">
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

export default ModernTemplate;