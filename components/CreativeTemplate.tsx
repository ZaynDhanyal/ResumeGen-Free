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
        <div className={`p-4 sm:p-8 ${fontClass} ${lineHeightClass} relative`} style={{ backgroundColor: creativeBg, color: creativeTextColor }}>
            <div className="absolute top-0 left-0 w-full md:w-1/3 h-64 md:h-full z-0" style={{ backgroundColor: colors.primary }}></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <aside className="col-span-1 text-white text-center md:text-left">
                    {personalInfo.profilePicture ? (
                        <img src={personalInfo.profilePicture} alt="Profile" className="rounded-full w-40 h-40 mx-auto mb-6 border-4 border-white shadow-lg object-cover"/>
                    ) : (
                        <div className="rounded-full w-40 h-40 mx-auto mb-6 border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                            <PersonalInfoIcon className="h-20 w-20 text-gray-400" />
                        </div>
                    )}
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase mb-2">Contact</h2>
                        <p className="text-sm mb-1 break-words">{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</p>
                        <p className="text-sm mb-1">{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</p>
                    </section>
                    {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold uppercase mb-2">Details</h2>
                             {personalInfo.nationality && (
                                <div className="text-sm mb-2">
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
                        <h2 className="text-lg font-bold uppercase mb-2">Education</h2>
                        {educationToRender.map(edu => (
                            <div key={edu.id} className="mb-2">
                                <h3 className="font-bold text-sm">{edu.degree}</h3>
                                <p className="text-xs italic">{edu.institution}</p>
                            </div>
                        ))}
                    </section>
                </aside>
                <main className="col-span-1 md:col-span-2 md:pl-8 text-gray-800">
                    <header className="mb-8 text-center md:text-left">
                        <h1 className="text-5xl font-extrabold" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
                        <p className="text-xl" style={{ color: creativeTextColor, opacity: 0.8 }}>{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
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
                            {skillsToRender.map(skill => <span key={skill.id} className="text-sm px-3 py-1 rounded" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CreativeTemplate;