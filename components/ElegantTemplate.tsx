import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const ElegantTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    // Elegant template should probably override font to a serif one by default for a classier look.
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-merriweather';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-[.2em] mb-3" style={{ color: colors.primary }}>{title}</h2>
            <div className="border-t-2" style={{borderColor: colors.secondary}}></div>
            <div className="pt-3">
                {children}
            </div>
        </section>
    );

    return (
        <div className={`p-8 ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <header className="text-center mb-8">
                <h1 className="text-5xl font-bold">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-xl mt-2 tracking-wide">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
            </header>
            
            <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-xs mb-8 border-y-2 py-2" style={{borderColor: colors.secondary}}>
                <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
                <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
                <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                {personalInfo.website && <span>{personalInfo.website}</span>}
            </div>

            <Section title="Profile">
                <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
            </Section>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                    <Section title="Experience">
                        {experiencesToRender.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                                    <p className="text-xs font-light" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-md italic">{exp.company}, {exp.location}</p>
                                <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                                    {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                    </Section>
                </div>

                <div className="col-span-4">
                    <Section title="Skills">
                        <div className="flex flex-col gap-1">
                            {skillsToRender.map(skill => <span key={skill.id} className="text-sm">{skill.name}</span>)}
                        </div>
                    </Section>

                    <Section title="Education">
                        {educationToRender.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="text-md font-semibold">{edu.degree}</h3>
                                <p className="text-sm italic">{edu.institution}</p>
                                <p className="text-xs font-light" style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </Section>

                    {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                        <Section title="Details">
                            {personalInfo.nationality && (
                                <div className="text-sm mb-2">
                                    <p className="font-semibold">Nationality</p>
                                    <p>{personalInfo.nationality}</p>
                                </div>
                             )}
                             {customDetailsToRender.map(detail => (
                                <div key={detail.id} className="text-sm mb-2">
                                    <p className="font-semibold">{detail.label}</p>
                                    <p>{detail.value}</p>
                                </div>
                            ))}
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ElegantTemplate;
