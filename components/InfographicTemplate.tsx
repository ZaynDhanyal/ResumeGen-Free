import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { MailIcon, PhoneIcon, LinkedinIcon, GlobeAltIcon, PersonalInfoIcon } from './icons';

const skillLevelToWidth = (level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') => {
    const levels = { 'Beginner': '25%', 'Intermediate': '50%', 'Advanced': '75%', 'Expert': '100%' };
    return levels[level] || '0%';
};

const InfographicTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    return (
        <div className={`flex min-h-[297mm] ${fontClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <aside className="w-1/3 p-4" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
                <div className="flex flex-col items-center mb-5">
                    {personalInfo.profilePicture ? (
                        <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-24 h-24 mb-3 border-4 object-cover" style={{borderColor: colors.secondary}}/>
                    ) : (
                        <div className="rounded-full w-24 h-24 mb-3 border-4 flex items-center justify-center bg-gray-200" style={{borderColor: colors.secondary}}>
                            <PersonalInfoIcon className="h-12 w-12 text-gray-400" />
                        </div>
                    )}
                    <h1 className="text-lg font-bold text-center leading-tight">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-xs text-center opacity-90 mt-1">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </div>
                
                <section className="mb-5">
                    <h2 className="text-[10px] font-bold uppercase pb-1 mb-2 border-b" style={{ borderColor: colors.secondary }}>Contact</h2>
                    <div className={`space-y-1.5 text-[10px] ${lineHeightClass}`}>
                        { (personalInfo.email || SAMPLE_RESUME.personalInfo.email) && <p className="flex items-center gap-2"><MailIcon className="h-3 w-3 shrink-0"/> <span className="break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span></p> }
                        { (personalInfo.phone || SAMPLE_RESUME.personalInfo.phone) && <p className="flex items-center gap-2"><PhoneIcon className="h-3 w-3 shrink-0"/> {personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p> }
                        { (personalInfo.address || SAMPLE_RESUME.personalInfo.address) && <p className="flex items-center gap-2"><GlobeAltIcon className="h-3 w-3 shrink-0"/> {personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p> }
                        { (personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin) && <p className="flex items-center gap-2"><LinkedinIcon className="h-3 w-3 shrink-0"/> <span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span></p> }
                    </div>
                </section>
                
                <section className="mb-5">
                    <h2 className="text-[10px] font-bold uppercase pb-1 mb-2 border-b" style={{ borderColor: colors.secondary }}>Skills</h2>
                    <div className="space-y-2">
                        {skillsToRender.map(skill => (
                            <div key={skill.id} className="text-[10px]">
                                <p className="mb-0.5">{skill.name}</p>
                                <div className="w-full rounded-full h-1" style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                    <div className="h-1 rounded-full" style={{ width: skillLevelToWidth(skill.level), backgroundColor: colors.secondary }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-[10px] font-bold uppercase pb-1 mb-2 border-b" style={{ borderColor: colors.secondary }}>Education</h2>
                    <div className={`space-y-2 ${lineHeightClass}`}>
                    {educationToRender.map(edu => (
                        <div key={edu.id}>
                            <h3 className="font-bold text-[10px]">{edu.degree}</h3>
                            <p className="text-[10px] italic opacity-90">{edu.institution}</p>
                            <p className="text-[9px] opacity-80">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                    </div>
                </section>
                 {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                     <section className="mt-5">
                        <h2 className="text-[10px] font-bold uppercase pb-1 mb-2 border-b" style={{ borderColor: colors.secondary }}>Details</h2>
                        <div className={`space-y-1.5 text-[10px] ${lineHeightClass}`}>
                            {personalInfo.nationality && (
                                <div>
                                    <p className="font-bold opacity-90">Nationality</p>
                                    <p>{personalInfo.nationality}</p>
                                </div>
                            )}
                            {customDetailsToRender.map(detail => (
                                <div key={detail.id}>
                                    <p className="font-bold opacity-90">{detail.label}</p>
                                    <p>{detail.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </aside>
            <main className="w-2/3 p-5">
                <section className="mb-5">
                    <h2 className="text-lg font-bold uppercase" style={{ color: colors.primary }}>Summary</h2>
                    <p className={`text-xs mt-2 border-l-4 pl-3 ${lineHeightClass}`} style={{borderColor: colors.secondary}}>{summary || SAMPLE_RESUME.summary}</p>
                </section>
                
                <section>
                    <h2 className="text-lg font-bold uppercase mb-3" style={{ color: colors.primary }}>Experience</h2>
                     <div className="border-l-2 ml-1.5 pl-4 space-y-4" style={{borderColor: colors.secondary}}>
                        {experiencesToRender.map(exp => (
                            <div key={exp.id} className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white" style={{backgroundColor: colors.primary}}></div>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-bold">{exp.jobTitle}</h3>
                                    <p className="text-[10px] font-mono opacity-70 whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-xs font-medium mb-1">{exp.company}, {exp.location}</p>
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

export default InfographicTemplate;