import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const ModernTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-5 ${fontClass}`} style={{ backgroundColor: colors.background, color: colors.text, minHeight: '297mm' }}>
            <aside className="col-span-4 pr-3 border-r" style={{ borderColor: colors.secondary }}>
                <div className="text-left mb-5">
                    <h1 className="text-xl font-bold leading-tight mb-1" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-xs font-medium opacity-80">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </div>
                
                <section className="mb-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.primary }}>Contact</h2>
                    <div className={`text-[10px] space-y-0.5 ${lineHeightClass}`}>
                        <p className="break-all font-medium">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                        <p>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                        <p>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                        {personalInfo.linkedin && <p className="break-all opacity-80">{personalInfo.linkedin.replace(/^https?:\/\//, '')}</p>}
                        {personalInfo.website && <p className="break-all opacity-80">{personalInfo.website.replace(/^https?:\/\//, '')}</p>}
                    </div>
                </section>

                {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                    <section className="mb-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.primary }}>Details</h2>
                        <div className={`text-[10px] space-y-1 ${lineHeightClass}`}>
                            {personalInfo.nationality && (
                                <div><span className="font-semibold">Nationality:</span> <br/>{personalInfo.nationality}</div>
                            )}
                            {customDetailsToRender.map(detail => (
                                <div key={detail.id}>
                                    <span className="font-semibold">{detail.label}:</span> <br/>{detail.value}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="mb-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.primary }}>Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {skillsToRender.map(skill => (
                            <span key={skill.id} className="text-[10px] px-2 py-0.5 rounded bg-gray-100" style={{ backgroundColor: colors.secondary }}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.primary }}>Education</h2>
                    <div className={`space-y-2 ${lineHeightClass}`}>
                    {educationToRender.map(edu => (
                        <div key={edu.id}>
                            <h3 className="font-bold text-[10px] leading-tight">{edu.degree}</h3>
                            <p className="text-[10px] italic mb-0.5 opacity-80">{edu.institution}</p>
                            <p className="text-[9px] opacity-60">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                    </div>
                </section>
            </aside>

            <main className="col-span-8">
                <section className="mb-4">
                    <h2 className="text-sm font-bold border-b pb-1 mb-1.5 uppercase tracking-wide" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Summary</h2>
                    <p className={`text-xs ${lineHeightClass}`}>{summary || SAMPLE_RESUME.summary}</p>
                </section>
                
                <section>
                    <h2 className="text-sm font-bold border-b pb-1 mb-2 uppercase tracking-wide" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Experience</h2>
                    <div className="space-y-3">
                    {experiencesToRender.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-sm font-bold">{exp.jobTitle}</h3>
                                <p className="text-[10px] font-mono opacity-75 whitespace-nowrap ml-2">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-xs font-semibold mb-1" style={{ color: colors.primary }}>{exp.company}, {exp.location}</p>
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

export default ModernTemplate;