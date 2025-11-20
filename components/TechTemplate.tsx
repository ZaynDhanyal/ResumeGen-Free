import React from 'react';
import { TemplateProps } from './ResumePreview';
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

const TechTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;
    
    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-0 min-h-[297mm] ${fontClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <aside className="col-span-4 p-5" style={{ backgroundColor: colors.secondary }}>
                <header className="mb-6">
                    <h1 className="text-xl font-bold leading-tight mb-1" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-xs font-medium opacity-90">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </header>
                
                <section className="mb-5">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Contact</h2>
                    <div className={`text-[10px] space-y-1 ${lineHeightClass}`}>
                        <p className="break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                        <p>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                        <p>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                        {personalInfo.linkedin && <p className="break-all">{personalInfo.linkedin.replace(/^https?:\/\//, '')}</p>}
                        {personalInfo.website && <p className="break-all">{personalInfo.website.replace(/^https?:\/\//, '')}</p>}
                    </div>
                </section>

                {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                     <section className="mb-5">
                        <h2 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Details</h2>
                        <div className={`space-y-1.5 text-[10px] ${lineHeightClass}`}>
                            {personalInfo.nationality && (
                                <div>
                                    <span className="font-bold">Nationality:</span> {personalInfo.nationality}
                                </div>
                            )}
                            {customDetailsToRender.map(detail => (
                                <div key={detail.id}>
                                    <span className="font-bold">{detail.label}:</span> {detail.value}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                <section className="mb-5">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Skills</h2>
                    <div className="space-y-2">
                        {skillsToRender.map(skill => (
                            <div key={skill.id}>
                                <p className="text-[10px] font-semibold">{skill.name}</p>
                                <div className="w-full bg-gray-300/50 rounded-full h-1 mt-0.5">
                                    <div className="h-1 rounded-full" style={{ width: skillLevelToPercentage(skill.level), backgroundColor: colors.primary }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-[10px] font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Education</h2>
                    <div className={lineHeightClass}>
                    {educationToRender.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <h3 className="font-bold text-[10px] leading-tight">{edu.degree}</h3>
                            <p className="text-[10px] italic opacity-90">{edu.institution}</p>
                            <p className="text-[9px] opacity-70">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                    </div>
                </section>
            </aside>
            <main className="col-span-8 p-5">
                <section className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Summary</h2>
                    <p className={`text-xs ${lineHeightClass}`}>{summary || SAMPLE_RESUME.summary}</p>
                </section>
                
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Experience</h2>
                    <div className="space-y-3">
                    {experiencesToRender.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-sm font-bold">{exp.jobTitle}</h3>
                                <p className="text-[10px] font-mono opacity-70 whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-xs font-semibold mb-1">{exp.company}, {exp.location}</p>
                            <ul className={`list-disc list-inside text-xs space-y-0.5 ${lineHeightClass}`}>
                                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i} className="pl-1">{line.replace('•','').trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TechTemplate;