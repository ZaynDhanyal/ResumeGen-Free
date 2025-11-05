import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { UserCircleIcon } from './icons';

const CreativeTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const colors = (themeMode === 'dark' && theme.dark) ? theme.dark : theme.colors;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';
    
    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
    const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

    const creativeAsideTextColor = '#FFFFFF';

    const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
        <section className={`mb-6 ${className}`}>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-white/30 pb-1 mb-3">
                {title}
            </h2>
            {children}
        </section>
      );

    return (
        <div className={`${fontClass} ${lineHeightClass} grid grid-cols-12 min-h-[297mm]`}>
            <aside className="col-span-12 md:col-span-4 p-10" style={{ backgroundColor: colors.primary, color: creativeAsideTextColor }}>
                <div className="flex flex-col items-center text-center">
                    {personalInfo.profilePicture ? (
                        <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mb-4 border-4 border-white/50 shadow-lg object-cover"/>
                    ) : (
                        <div className="rounded-full w-32 h-32 mb-4 border-4 border-white/50 shadow-lg bg-white/20 flex items-center justify-center">
                            <UserCircleIcon className="h-20 w-20 text-white/80" />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold">{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-md opacity-90">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </div>
                <div className="mt-8 space-y-6 text-sm">
                    <Section title="Contact">
                        <div className="space-y-1 text-xs">
                            <p className="break-words">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                            <p>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                            <p>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</p>
                            <p className="break-words">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</p>
                        </div>
                    </Section>
                    {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                        <Section title="Details">
                            <div className="space-y-2 text-xs">
                                {personalInfo.nationality && (
                                    <div>
                                        <p className="font-semibold">Nationality</p>
                                        <p className="opacity-90">{personalInfo.nationality}</p>
                                    </div>
                                )}
                                {customDetailsToRender.map(detail => (
                                    <div key={detail.id}>
                                        <p className="font-semibold">{detail.label}</p>
                                        <p className="opacity-90">{detail.value}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {skillsToRender.map(skill => <span key={skill.id} className="inline-flex items-center text-xs px-2 py-1 rounded bg-white/20">{skill.name}</span>)}
                        </div>
                    </Section>
                </div>
            </aside>
            <main className="col-span-12 md:col-span-8 p-10" style={{ backgroundColor: colors.background, color: colors.text }}>
                <section className="mb-6">
                    <h2 className="text-2xl font-bold uppercase mb-3" style={{ color: colors.primary }}>Summary</h2>
                    <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-2xl font-bold uppercase mb-3" style={{ color: colors.primary }}>Experience</h2>
                    {experiencesToRender.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                            <div className="flex justify-between items-baseline text-sm opacity-80 mb-1">
                                <p className="font-medium">{exp.company}, {exp.location}</p>
                                <p>{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-2xl font-bold uppercase mb-3" style={{ color: colors.primary }}>Education</h2>
                    {educationToRender.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <h3 className="font-bold text-lg">{edu.degree}</h3>
                            <div className="flex justify-between items-baseline text-sm opacity-80">
                                <p className="italic">{edu.institution}, {edu.location}</p>
                                <p>{edu.startDate} - {edu.endDate}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default CreativeTemplate;