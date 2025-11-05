import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { MailIcon, PhoneIcon, LocationMarkerIcon, LinkIcon, GlobeAltIcon, ExperienceIcon, EducationIcon, SkillsIcon } from './icons';

const skillLevelToDots = (level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') => {
    const levels = { 'Beginner': 2, 'Intermediate': 3, 'Advanced': 4, 'Expert': 5 };
    return levels[level] || 0;
};

const InfographicTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
    const { personalInfo, summary, experience, education, skills, customDetails } = data;
    const colors = (themeMode === 'dark' && theme.dark) ? theme.dark : theme.colors;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;

    const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <section className="mb-8">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: colors.primary, color: 'white' }}>
                    {icon}
                </div>
                <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>{title}</h2>
            </div>
            {children}
        </section>
    );

    const TimelineItem: React.FC<{ item: any; isExp?: boolean }> = ({ item, isExp = false }) => (
        <div className="relative pl-8">
            <div className="absolute -left-[5px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}` }}></div>
            <p className="text-xs font-mono absolute -top-5 right-0" style={{ opacity: 0.7 }}>{item.startDate} - {item.endDate}</p>
            <h3 className="text-lg font-bold">{isExp ? item.jobTitle : item.degree}</h3>
            <p className="text-md font-semibold">{isExp ? item.company : item.institution}, {item.location}</p>
            {isExp && (
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    {item.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                </ul>
            )}
        </div>
    );

    return (
        <div className={`p-10 min-h-[297mm] ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <header className="text-center mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <h1 className="text-4xl sm:text-5xl font-extrabold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                <p className="text-lg sm:text-xl mt-1 font-light">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
            </header>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs sm:text-sm mb-8 border-y-2 py-4" style={{ borderColor: colors.secondary }}>
                <div className="flex items-center justify-center gap-2"><MailIcon className="h-4 w-4" style={{ color: colors.primary }} /> <span className="truncate">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span></div>
                <div className="flex items-center justify-center gap-2"><PhoneIcon className="h-4 w-4" style={{ color: colors.primary }} /> <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span></div>
                <div className="flex items-center justify-center gap-2"><LocationMarkerIcon className="h-4 w-4" style={{ color: colors.primary }} /> <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span></div>
                <div className="flex items-center justify-center gap-2"><LinkIcon className="h-4 w-4" style={{ color: colors.primary }} /> <span className="truncate">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</span></div>
            </div>

            <p className="text-center text-sm mb-8">{summary || SAMPLE_RESUME.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Section title="Experience" icon={<ExperienceIcon className="h-6 w-6" />}>
                        <div className="relative border-l-2 pl-8 space-y-8" style={{ borderColor: colors.primary }}>
                            {experiencesToRender.map((exp) => <TimelineItem key={exp.id} item={exp} isExp />)}
                        </div>
                    </Section>
                    <Section title="Education" icon={<EducationIcon className="h-6 w-6" />}>
                        <div className="relative border-l-2 pl-8 space-y-8" style={{ borderColor: colors.primary }}>
                            {educationToRender.map(edu => <TimelineItem key={edu.id} item={edu} />)}
                        </div>
                    </Section>
                </div>
                <div>
                    <Section title="Skills" icon={<SkillsIcon className="h-6 w-6" />}>
                        <div className="space-y-4">
                            {skillsToRender.map(skill => (
                                <div key={skill.id}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-semibold">{skill.name}</p>
                                        <div className="flex space-x-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span
                                                    key={i}
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: i < skillLevelToDots(skill.level) ? colors.primary : 'rgba(0,0,0,0.1)' }}
                                                ></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                    {personalInfo.nationality && (
                         <Section title="Details" icon={<GlobeAltIcon className="h-6 w-6" />}>
                            <p className="text-sm"><b>Nationality:</b> {personalInfo.nationality}</p>
                         </Section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfographicTemplate;