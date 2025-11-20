import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const ElegantTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-merriweather';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[.2em] mb-1.5" style={{ color: colors.primary }}>{title}</h2>
            <div className="border-t" style={{borderColor: colors.secondary}}></div>
            <div className="pt-2">
                {children}
            </div>
        </section>
    );

    return (
        <div className={`p-6 ${fontClass}`} style={{ backgroundColor: colors.background, color: colors.text, minHeight: '297mm' }}>
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-base mt-1 tracking-wide italic text-gray-600">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
            </header>
            
            <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-[10px] mb-6 border-y py-2" style={{borderColor: colors.secondary}}>
                <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
                <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
                <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
                {personalInfo.linkedin && <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
                {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>}
            </div>

            <Section title="Profile">
                <p className={`text-xs ${lineHeightClass}`}>{summary || SAMPLE_RESUME.summary}</p>
            </Section>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                    <Section title="Experience">
                        <div className="space-y-4">
                        {experiencesToRender.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-semibold">{exp.jobTitle}</h3>
                                    <p className="text-[10px] font-light opacity-75 whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-xs italic mb-1">{exp.company}, {exp.location}</p>
                                <ul className={`list-disc list-inside text-xs space-y-0.5 ${lineHeightClass}`}>
                                    {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i} className="pl-1">{line.replace('•','').trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                        </div>
                    </Section>
                </div>

                <div className="col-span-4">
                    <Section title="Skills">
                        <div className={`flex flex-col gap-1 ${lineHeightClass}`}>
                            {skillsToRender.map(skill => <span key={skill.id} className="text-xs border-b border-gray-100 pb-0.5">{skill.name}</span>)}
                        </div>
                    </Section>

                    <Section title="Education">
                        <div className="space-y-2">
                        {educationToRender.map(edu => (
                            <div key={edu.id}>
                                <h3 className="text-xs font-semibold leading-tight">{edu.degree}</h3>
                                <p className="text-[10px] italic">{edu.institution}</p>
                                <p className="text-[9px] font-light opacity-75">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                        </div>
                    </Section>

                    {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                        <Section title="Details">
                            <div className={`space-y-1.5 text-xs ${lineHeightClass}`}>
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
                </div>
            </div>
        </div>
    );
};

export default ElegantTemplate;