import React from 'react';
import { TemplateProps } from '../types';
import { SAMPLE_RESUME, FONT_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';

const ClassicTemplate: React.FC<TemplateProps> = ({ data, theme, formatting, themeMode }) => {
  const { personalInfo, summary, experience, education, skills, customDetails } = data;
  const colors = (themeMode === 'dark' && theme.dark) ? theme.dark : theme.colors;
  const fontClass = FONT_OPTIONS.find(f => f.id === formatting.fontFamily)?.css || 'font-sans';
  const lineHeightClass = LINE_HEIGHT_OPTIONS.find(l => l.id === formatting.lineHeight)?.css || 'leading-relaxed';

  const experiencesToRender = experience.length > 0 ? experience : SAMPLE_RESUME.experience;
  const educationToRender = education.length > 0 ? education : SAMPLE_RESUME.education;
  const skillsToRender = skills.length > 0 ? skills : SAMPLE_RESUME.skills;
  const customDetailsToRender = customDetails.length > 0 ? customDetails : SAMPLE_RESUME.customDetails;

  const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={`mb-6 ${className}`}>
        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-2 mb-3" style={{ borderBottomColor: colors.primary, color: colors.primary }}>
            {title}
        </h2>
        {children}
    </section>
  );

  return (
    <div className={`p-10 ${fontClass} ${lineHeightClass} min-h-[297mm]`} style={{ backgroundColor: colors.background, color: colors.text }}>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-wider uppercase" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
        <p className="text-lg font-light tracking-widest">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
        <div className="flex justify-center flex-wrap items-center space-x-4 text-xs mt-3 opacity-80">
            <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/3 md:pr-8">
            <Section title="Details">
                <div className="space-y-2 text-xs">
                    {(personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin) && (
                        <div>
                            <p className="font-semibold">LinkedIn</p>
                            <p className="break-all">{personalInfo.linkedin || SAMPLE_RESUME.personalInfo.linkedin}</p>
                        </div>
                    )}
                    {(personalInfo.website || SAMPLE_RESUME.personalInfo.website) && (
                        <div>
                            <p className="font-semibold">Website</p>
                            <p className="break-all">{personalInfo.website || SAMPLE_RESUME.personalInfo.website}</p>
                        </div>
                    )}
                    {personalInfo.nationality && (
                        <div>
                            <p className="font-semibold">Nationality</p>
                            <p>{personalInfo.nationality}</p>
                        </div>
                    )}
                    {customDetailsToRender.map(detail => (
                        <div key={detail.id}>
                            <p className="font-semibold">{detail.label}</p>
                            <p>{detail.value}</p>
                        </div>
                    ))}
                </div>
            </Section>
            <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                    {skillsToRender.map(skill => <span key={skill.id} className="inline-flex items-center text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
                </div>
            </Section>
            <Section title="Education">
                {educationToRender.map(edu => (
                    <div key={edu.id} className="mb-3 text-sm">
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="italic text-xs">{edu.institution}</p>
                        <p className="text-xs" style={{ opacity: 0.7 }}>{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </Section>
          </aside>
          <main className="w-full md:w-2/3">
             <Section title="Summary">
                <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
            </Section>
            <Section title="Experience">
                {experiencesToRender.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                        <p className="text-xs" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-md italic">{exp.company}, {exp.location}</p>
                        <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>
          </main>
      </div>
    </div>
  );
};

export default ClassicTemplate;