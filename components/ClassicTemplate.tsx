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

  return (
    <div className={`p-4 sm:p-8 ${fontClass} ${lineHeightClass}`} style={{ backgroundColor: colors.background, color: colors.text }}>
      <header className="text-center mb-8 border-b-2 pb-4" style={{ borderBottomColor: colors.primary }}>
        <h1 className="text-4xl font-bold tracking-wider uppercase" style={{ color: colors.primary }}>{personalInfo.fullName || SAMPLE_RESUME.personalInfo.fullName}</h1>
        <p className="text-lg font-light tracking-widest">{personalInfo.jobTitle || SAMPLE_RESUME.personalInfo.jobTitle}</p>
      </header>
      <div className="flex justify-center space-x-6 text-sm mb-8 flex-wrap">
        <span>{personalInfo.email || SAMPLE_RESUME.personalInfo.email}</span>
        <span className="hidden sm:inline">|</span>
        <span>{personalInfo.phone || SAMPLE_RESUME.personalInfo.phone}</span>
        <span className="hidden sm:inline">|</span>
        <span>{personalInfo.address || SAMPLE_RESUME.personalInfo.address}</span>
      </div>
      {(customDetailsToRender.length > 0 || personalInfo.nationality) && (
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm mb-8">
              {personalInfo.nationality && (
                  <div>
                      <span className="font-semibold" style={{ color: colors.primary }}>Nationality:</span> {personalInfo.nationality}
                  </div>
              )}
              {customDetailsToRender.map(detail => (
                  <div key={detail.id}>
                      <span className="font-semibold" style={{ color: colors.primary }}>{detail.label}:</span> {detail.value}
                  </div>
              ))}
          </div>
      )}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Summary</h2>
        <p className="text-sm">{summary || SAMPLE_RESUME.summary}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Experience</h2>
        {experiencesToRender.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
              <p className="text-sm" style={{ opacity: 0.8 }}>{exp.startDate} - {exp.endDate}</p>
            </div>
            <p className="text-md italic">{exp.company}, {exp.location}</p>
            <ul className="list-disc list-inside mt-1 text-sm space-y-1">
              {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace('•','').trim()}</li>)}
            </ul>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Education</h2>
        {educationToRender.map(edu => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <p className="text-sm" style={{ opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</p>
            </div>
            <p className="text-md italic">{edu.institution}, {edu.location}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-bold border-b pb-1 mb-2" style={{ borderBottomColor: colors.secondary, color: colors.primary }}>Skills</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {skillsToRender.map(skill => <span key={skill.id} className="inline-flex items-center text-sm px-3 py-1 rounded-full" style={{ backgroundColor: colors.secondary, color: colors.primary }}>{skill.name}</span>)}
        </div>
      </section>
    </div>
  );
};

export default ClassicTemplate;
