import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { MailIcon, PhoneIcon, GlobeAltIcon, LinkedinIcon } from './icons';

const ElegantTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 min-h-[297mm] ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            {/* Sidebar */}
            <aside className="col-span-1 p-8" style={{ backgroundColor: colors.secondary }}>
                {personalInfo.profilePicture && (
                    <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mx-auto mb-6 border-4 object-cover" style={{ borderColor: colors.primary }} />
                )}
                <div className="text-center md:text-left">
                    <section className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: colors.primary }}>Contact</h2>
                        <div className="space-y-2 text-xs">
                            {personalInfo.email && <p className="flex items-center"><MailIcon className="h-4 w-4 mr-2 flex-shrink-0" /> <span className="break-all">{personalInfo.email}</span></p>}
                            {personalInfo.phone && <p className="flex items-center"><PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" /> {personalInfo.phone}</p>}
                            {personalInfo.linkedin && <p className="flex items-center"><LinkedinIcon className="h-4 w-4 mr-2 flex-shrink-0" /> <span className="break-all">{personalInfo.linkedin}</span></p>}
                            {personalInfo.website && <p className="flex items-center"><GlobeAltIcon className="h-4 w-4 mr-2 flex-shrink-0" /> <span className="break-all">{personalInfo.website}</span></p>}
                        </div>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: colors.primary }}>Skills</h2>
                        <ul className="list-disc list-inside text-xs space-y-1">
                            {skillsToRender.map(skill => <li key={skill.id}>{skill.name}</li>)}
                        </ul>
                    </section>
                     <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: colors.primary }}>Education</h2>
                        {educationToRender.map(edu => (
                            <div key={edu.id} className="mb-3 text-xs">
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="italic">{edu.institution}</p>
                                <p className="opacity-80">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </section>
                </div>
            </aside>
            {/* Main Content */}
            <main className="col-span-2 p-8">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-5xl font-bold font-serif" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-xl mt-1 tracking-wide">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                </header>
                
                <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-2 mb-4 font-serif" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Profile</h2>
                    <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
                </section>
                
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-2 mb-4 font-serif" style={{ borderBottomColor: colors.primary, color: colors.primary }}>Experience</h2>
                    {experiencesToRender.map(exp => (
                        <div key={exp.id} className="mb-6">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                                <p className="text-xs" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-md font-medium italic">{exp.company}, {exp.location}</p>
                            <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default ElegantTemplate;
