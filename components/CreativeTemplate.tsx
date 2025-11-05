import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { PersonalInfoIcon } from './icons';

const CreativeTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const colors = (themeMode === 'dark' && theme.dark) ? theme.dark : theme.colors;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';
    
    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const creativeBg = themeMode === 'dark' ? '#1F2937' : '#FFFFFF';
    const creativeTextColor = themeMode === 'dark' ? '#F9FAFB' : '#111827';
    const creativeAsideTextColor = '#FFFFFF';

    return (
        <div className={`${fontClass} ${lineHeightClass} grid grid-cols-1 md:grid-cols-3`}>
            <aside className="col-span-1 p-8 text-center md:text-left" style={{ backgroundColor: colors.primary, color: creativeAsideTextColor }}>
                {personalInfo.profilePicture ? (
                    <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-40 h-40 mx-auto mb-6 border-4 border-white shadow-lg object-cover"/>
                ) : (
                    <div className="rounded-full w-40 h-40 mx-auto mb-6 border-4 border-white shadow-lg bg-gray-200/50 flex items-center justify-center">
                        <PersonalInfoIcon className="h-20 w-20 text-white/80" />
                    </div>
                )}
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase mb-2 border-b border-white/50 pb-1">Contact</h2>
                    <p className="text-sm mb-1 break-words">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                    <p className="text-sm mb-1">{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                </section>
                {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase mb-2 border-b border-white/50 pb-1">Details</h2>
                            {personalInfo.nationality && (
                            <div className="text-sm mb-2 mt-2">
                                <p className="font-semibold">Nationality</p>
                                <p className="opacity-90">{personalInfo.nationality}</p>
                            </div>
                            )}
                            {customDetailsToRender.map(detail => (
                            <div key={detail.id} className="text-sm mb-2">
                                <p className="font-semibold">{detail.label}</p>
                                <p className="opacity-90">{detail.value}</p>
                            </div>
                        ))}
                    </section>
                )}
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase mb-2 border-b border-white/50 pb-1">Education</h2>
                    {educationToRender.map(edu => (
                        <div key={edu.id} className="mb-2 mt-2">
                            <h3 className="font-bold text-sm">{edu.degree}</h3>
                            <p className="text-xs italic">{edu.institution}</p>
                        </div>
                    ))}
                </section>
            </aside>
            <main className="col-span-1 md:col-span-2 p-8" style={{ backgroundColor: creativeBg, color: creativeTextColor }}>
                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-xl" style={{ opacity: 0.8 }}>{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </header>
                <section className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2" style={{ color: colors.primary }}>Summary</h2>
                    <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2" style={{ color: colors.primary }}>Experience</h2>
                    {experiencesToRender.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <h3 className="text-lg font-semibold">{exp.jobTitle} at {exp.company}</h3>
                            <p className="text-xs" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                            <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                    <section>
                    <h2 className="text-xl font-bold uppercase mb-2" style={{ color: colors.primary }}>Skills</h2>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {skillsToRender.map(skill => <span key={skill.id} className="inline-flex items-center text-sm px-3 py-1 rounded" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CreativeTemplate;
