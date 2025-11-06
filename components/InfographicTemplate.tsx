import React from 'react';
import { TemplateProps } from './ResumePreview';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { MailIcon, PhoneIcon, LinkedinIcon, PersonalInfoIcon, ExperienceIcon, EducationIcon, SkillsIcon, SummaryIcon } from './icons';

const skillLevelToPercentage = (level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') => {
    switch (level) {
        case 'Beginner': return 25;
        case 'Intermediate': return 50;
        case 'Advanced': return 75;
        case 'Expert': return 100;
        default: return 0;
    }
};

const InfographicTemplate: React.FC<TemplateProps> = ({ data, theme, formatting }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const { colors } = theme;
    const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
    const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

    const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
    const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
    const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;

    // FIX: Specify a more precise type for the icon prop to allow cloning with className.
    const Section: React.FC<{ title: string; icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; children: React.ReactNode }> = ({ title, icon, children }) => (
        <section className="mb-8">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
                </div>
                <h2 className="text-2xl font-bold ml-4" style={{ color: colors.primary }}>{title}</h2>
            </div>
            {children}
        </section>
    );

    return (
        <div className={`p-8 ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
            <header className="flex flex-col sm:flex-row items-center mb-10">
                {personalInfo.profilePicture ? (
                     <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-40 h-40 mr-8 border-8 object-cover" style={{ borderColor: colors.secondary }}/>
                ) : (
                    <div className="rounded-full w-40 h-40 mr-8 border-8 flex items-center justify-center" style={{ borderColor: colors.secondary, backgroundColor: colors.secondary }}>
                         <PersonalInfoIcon className="h-24 w-24" style={{color: colors.primary}} />
                    </div>
                )}
                <div>
                    <h1 className="text-5xl font-extrabold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                    <p className="text-2xl mt-1">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-4">
                        {personalInfo.email && <p className="flex items-center"><MailIcon className="h-4 w-4 mr-2" style={{color: colors.primary}} />{personalInfo.email}</p>}
                        {personalInfo.phone && <p className="flex items-center"><PhoneIcon className="h-4 w-4 mr-2" style={{color: colors.primary}} />{personalInfo.phone}</p>}
                        {personalInfo.linkedin && <p className="flex items-center"><LinkedinIcon className="h-4 w-4 mr-2" style={{color: colors.primary}} />{personalInfo.linkedin}</p>}
                    </div>
                </div>
            </header>

            <Section title="About Me" icon={<SummaryIcon />}>
                <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <Section title="Experience" icon={<ExperienceIcon />}>
                        <div className="relative border-l-2 pl-6" style={{ borderColor: colors.secondary }}>
                            {experiencesToRender.map((exp) => (
                                <div key={exp.id} className="mb-6 relative">
                                    <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                                    <p className="text-xs font-semibold" style={{ color: colors.primary }}>{exp.startDate} - {exp.endDate}</p>
                                    <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                                    <p className="text-md italic">{exp.company}, {exp.location}</p>
                                    <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                                       {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
                <div>
                    <Section title="Education" icon={<EducationIcon />}>
                         <div className="relative border-l-2 pl-6" style={{ borderColor: colors.secondary }}>
                            {educationToRender.map(edu => (
                                <div key={edu.id} className="mb-6 relative">
                                    <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                                    <p className="text-xs font-semibold" style={{ color: colors.primary }}>{edu.startDate} - {edu.endDate}</p>
                                    <h3 className="text-lg font-bold">{edu.degree}</h3>
                                    <p className="text-md italic">{edu.institution}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                    <Section title="Skills" icon={<SkillsIcon />}>
                        <div className="space-y-4">
                            {skillsToRender.map(skill => (
                                <div key={skill.id}>
                                    <p className="text-sm font-bold mb-1">{skill.name}</p>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-1/5 h-2 mr-1 rounded-sm" style={{ backgroundColor: i < skillLevelToPercentage(skill.level) / 20 ? colors.primary : colors.secondary }}></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default InfographicTemplate;