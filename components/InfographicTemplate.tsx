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
        <div className={`flex min-h-[297mm] ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <aside className="w-1/3 p-6" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
                <div className="flex flex-col items-center mb-8">
                    {personalInfo.profilePicture ? (
                        <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mb-4 border-4 object-cover" style={{borderColor: colors.secondary}}/>
                    ) : (
                        <div className="rounded-full w-32 h-32 mb-4 border-4 flex items-center justify-center bg-gray-200" style={{borderColor: colors.secondary}}>
                            <PersonalInfoIcon className="h-20 w-20 text-gray-400" />
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-center">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-md text-center">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </div>
                
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase pb-1 mb-2 border-b-2" style={{ borderColor: colors.secondary }}>Contact</h2>
                    <div className="space-y-2 text-xs">
                        { (personalInfo.email || SAMPLE_RESUME.personalInfo.email) && <p className="flex items-center"><MailIcon className="h-4 w-4 mr-2 shrink-0"/> <span className="break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span></p> }
                        { (personalInfo.phone || SAMPLE_RESUME.personalInfo.phone) && <p className="flex items-center"><PhoneIcon className="h-4 w-4 mr-2 shrink-0"/> {personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p> }
                        { (personalInfo.address || SAMPLE_RESUME.personalInfo.address) && <p className="flex items-center"><GlobeAltIcon className="h-4 w-4 mr-2 shrink-0"/> {personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p> }
                        { (personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin) && <p className="flex items-center"><LinkedinIcon className="h-4 w-4 mr-2 shrink-0"/> <span className="break-all">{personalInfo.linkedin}</span></p> }
                    </div>
                </section>
                
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase pb-1 mb-2 border-b-2" style={{ borderColor: colors.secondary }}>Skills</h2>
                    <div className="space-y-2">
                        {skillsToRender.map(skill => (
                            <div key={skill.id} className="text-xs">
                                <p>{skill.name}</p>
                                <div className="w-full rounded-full h-1.5 mt-1" style={{backgroundColor: 'rgba(255,255,255,0.3)'}}>
                                    <div className="h-1.5 rounded-full" style={{ width: skillLevelToWidth(skill.level), backgroundColor: colors.secondary }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-lg font-bold uppercase pb-1 mb-2 border-b-2" style={{ borderColor: colors.secondary }}>Education</h2>
                    {educationToRender.map(edu => (
                        <div key={edu.id} className="mb-3">
                            <h3 className="font-bold text-sm">{edu.degree}</h3>
                            <p className="text-xs italic">{edu.institution}</p>
                            <p className="text-xs opacity-80">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </section>
                 {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                     <section className="mt-6">
                        <h2 className="text-lg font-bold uppercase pb-1 mb-2 border-b-2" style={{ borderColor: colors.secondary }}>Details</h2>
                        <div className="space-y-2 text-xs">
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
                    </section>
                )}
            </aside>
            <main className="w-2/3 p-6">
                <section className="mb-6">
                    <h2 className="text-2xl font-bold uppercase" style={{ color: colors.primary }}>Summary</h2>
                    <p className="text-sm mt-2 border-l-4 pl-4" style={{borderColor: colors.secondary}}>{summary || SAMPLE_RESUME.summary}</p>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold uppercase" style={{ color: colors.primary }}>Experience</h2>
                     <div className="mt-2 border-l-4 pl-4" style={{borderColor: colors.secondary}}>
                        {experiencesToRender.map(exp => (
                            <div key={exp.id} className="mb-4 relative">
                                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full" style={{backgroundColor: colors.primary}}></div>
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
                    </div>
                </section>
            </main>
        </div>
    );
};

export default InfographicTemplate;
