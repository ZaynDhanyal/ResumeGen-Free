import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { PersonalInfoIcon } from './icons';

const CreativeTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';
    
    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const creativeBg = '#F9FAFB';
    const creativeTextColor = '#111827';

    return (
        <div className={`p-5 ${fontClass} relative`} style={{ backgroundColor: creativeBg, color: creativeTextColor, minHeight: '297mm' }}>
            <div className="absolute top-0 left-0 w-full md:w-1/3 h-48 md:h-full z-0" style={{ backgroundColor: colors.primary }}></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                <aside className="col-span-1 text-white text-center md:text-left pt-5">
                    {personalInfo.profilePicture ? (
                        <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-28 h-28 mx-auto mb-5 border-4 border-white shadow-lg object-cover"/>
                    ) : (
                        <div className="rounded-full w-28 h-28 mx-auto mb-5 border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                            <PersonalInfoIcon className="h-14 w-14 text-gray-400" />
                        </div>
                    )}
                    <section className="mb-5 px-2">
                        <h2 className="text-xs font-bold uppercase mb-2 border-b border-white/30 pb-1">Contact</h2>
                        <div className={`text-[10px] space-y-1 ${lineHeightClass}`}>
                            <p className="break-all">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                            <p>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                            <p>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                        </div>
                    </section>
                    {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                        <section className="mb-5 px-2">
                            <h2 className="text-xs font-bold uppercase mb-2 border-b border-white/30 pb-1">Details</h2>
                             <div className={`text-[10px] space-y-1.5 ${lineHeightClass}`}>
                                 {personalInfo.nationality && (
                                    <div>
                                        <p className="font-semibold opacity-90">Nationality</p>
                                        <p>{personalInfo.nationality}</p>
                                    </div>
                                 )}
                                 {customDetailsToRender.map(detail => (
                                    <div key={detail.id}>
                                        <p className="font-semibold opacity-90">{detail.label}</p>
                                        <p>{detail.value}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    <section className="mb-5 px-2">
                        <h2 className="text-xs font-bold uppercase mb-2 border-b border-white/30 pb-1">Education</h2>
                        <div className={`space-y-2 ${lineHeightClass}`}>
                            {educationToRender.map(edu => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-[10px]">{edu.degree}</h3>
                                    <p className="text-[9px] italic opacity-90">{edu.institution}</p>
                                    <p className="text-[9px] opacity-80">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
                <main className="col-span-2 md:pl-2 pt-5 text-gray-800">
                    <header className="mb-6 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold mb-1" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                        <p className="text-base font-medium" style={{ color: creativeTextColor, opacity: 0.8 }}>{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                    </header>
                    <section className="mb-5">
                        <h2 className="text-sm font-bold uppercase mb-2 border-b-2 pb-1" style={{ borderColor: colors.secondary, color: colors.primary }}>Summary</h2>
                        <p className={`text-xs ${lineHeightClass}`}>{summary || SAMPLE_RESUME.summary}</p>
                    </section>
                    <section className="mb-5">
                        <h2 className="text-sm font-bold uppercase mb-2 border-b-2 pb-1" style={{ borderColor: colors.secondary, color: colors.primary }}>Experience</h2>
                        <div className="space-y-4">
                        {experiencesToRender.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-bold">{exp.jobTitle}</h3>
                                    <p className="text-[10px] opacity-70 whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-xs font-semibold mb-1.5" style={{color: colors.primary}}>{exp.company}, {exp.location}</p>
                                <ul className={`list-disc list-inside text-xs space-y-0.5 ${lineHeightClass}`}>
                                    {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i} className="pl-1">{line.replace('•','').trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                        </div>
                    </section>
                     <section>
                        <h2 className="text-sm font-bold uppercase mb-2 border-b-2 pb-1" style={{ borderColor: colors.secondary, color: colors.primary }}>Skills</h2>
                        <div className={`flex flex-wrap gap-1.5 mt-1 ${lineHeightClass}`}>
                            {skillsToRender.map(skill => <span key={skill.id} className="text-[10px] px-2 py-1 rounded font-medium" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CreativeTemplate;