import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const MinimalistTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>{title}</h2>
            {children}
        </section>
    );

    return (
        <div className={`p-6 ${fontClass}`} style={{ backgroundColor: colors.background, color: colors.text, minHeight: '297mm' }}>
            <header className="text-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight mb-1">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-sm font-light tracking-wide uppercase opacity-80">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-[10px] mt-2 text-gray-600">
                    <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
                    <span className="text-gray-300">&bull;</span>
                    <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
                    <span className="text-gray-300">&bull;</span>
                    <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
                </div>
            </header>

            <Section title="Summary">
                <p className={`text-xs ${lineHeightClass}`}>{summary || SAMPLE_RESUME.summary}</p>
            </Section>

            {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                <Section title="Additional Details">
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] ${lineHeightClass}`}>
                        {personalInfo.nationality && (
                            <div>
                                <p className="font-bold">Nationality</p>
                                <p>{personalInfo.nationality}</p>
                            </div>
                        )}
                        {customDetailsToRender.map(detail => (
                            <div key={detail.id}>
                                <p className="font-bold">{detail.label}</p>
                                <p>{detail.value}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            <Section title="Experience">
                <div className="space-y-4">
                {experiencesToRender.map(exp => (
                    <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="text-sm font-bold" style={{ color: colors.primary }}>{exp.jobTitle}</h3>
                            <p className="text-[10px] font-mono opacity-70 whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-xs font-semibold mb-1">{exp.company}, {exp.location}</p>
                        <ul className={`list-disc list-inside text-xs space-y-0.5 ${lineHeightClass}`}>
                            {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i} className="pl-1">{line.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                ))}
                </div>
            </Section>

            <Section title="Education">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {educationToRender.map(edu => (
                    <div key={edu.id}>
                        <h3 className="text-xs font-bold leading-tight" style={{ color: colors.primary }}>{edu.degree}</h3>
                        <div className="flex justify-between items-baseline mt-0.5">
                            <p className="text-[10px] font-medium">{edu.institution}</p>
                            <p className="text-[9px] opacity-70">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    </div>
                ))}
                </div>
            </Section>

            <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                    {skillsToRender.map(skill => (
                        <span key={skill.id} className="text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: colors.secondary, color: colors.primary }}>
                            {skill.name}
                        </span>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default MinimalistTemplate;