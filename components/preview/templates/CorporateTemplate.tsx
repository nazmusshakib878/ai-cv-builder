'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { useResume } from '@/context/ResumeContext';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, design }) => {
  const { updateResumeData } = useResume();
  const { personalInfo, experiences, education, skills, projects, certifications, languages, awards } = data;

  const fontClass =
    design.fontFamily === 'inter'
      ? 'font-sans'
      : design.fontFamily === 'jakarta'
      ? 'font-jakarta'
      : design.fontFamily === 'merriweather'
      ? 'font-serif'
      : design.fontFamily === 'playfair'
      ? 'font-playfair'
      : 'font-mono';

  const fontSizeClass =
    design.fontSize === 'sm' || design.onePageMode
      ? 'text-[12px] leading-[1.38]'
      : design.fontSize === 'lg'
      ? 'text-[14.5px] leading-[1.6]'
      : 'text-[13.5px] leading-[1.5]';

  const spacingClass =
    design.sectionSpacing === 'compact' || design.onePageMode
      ? 'space-y-3'
      : design.sectionSpacing === 'relaxed'
      ? 'space-y-6'
      : 'space-y-4.5';

  const containerPadding = design.onePageMode ? 'p-6 md:p-7' : 'p-8 md:p-10';

  const renderSummary = () => {
    if (!personalInfo.summary) return null;
    return (
      <section key="summary">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
          Professional Profile
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const val = e.currentTarget.textContent || '';
            if (val !== personalInfo.summary) {
              updateResumeData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, summary: val },
              }), 'Edited Summary');
            }
          }}
          className="text-justify text-slate-800 leading-relaxed outline-none focus:bg-blue-50/50 rounded p-1"
        >
          {personalInfo.summary}
        </p>
      </section>
    );
  };

  const renderExperience = () => {
    if (!experiences || experiences.length === 0) return null;
    return (
      <section key="experience">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
          Career History & Experience
        </h2>
        <div className="space-y-3.5">
          {experiences.map((exp, expIdx) => (
            <div key={exp.id || expIdx}>
              <div className="flex justify-between items-baseline text-xs font-bold text-slate-950">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const val = e.currentTarget.textContent || '';
                    updateResumeData((prev) => ({
                      ...prev,
                      experiences: prev.experiences.map((item, i) =>
                        i === expIdx ? { ...item, company: val } : item
                      ),
                    }));
                  }}
                  className="font-serif text-[13.5px] outline-none focus:bg-blue-50 rounded"
                >
                  {exp.company}
                </span>
                <span className="text-slate-600 font-sans font-normal text-[11.5px]">{exp.location}</span>
              </div>

              <div className="flex justify-between items-baseline text-xs text-slate-700 italic mb-1 font-serif">
                <span>{exp.role}</span>
                <span className="font-sans not-italic text-slate-500 text-[11.5px]">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>

              <ul className="list-disc list-outside ml-4 text-xs text-slate-800 space-y-1">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="pl-0.5 leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <section key="education">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
          Academic Qualifications
        </h2>
        <div className="space-y-2">
          {education.map((edu, eduIdx) => (
            <div key={edu.id || eduIdx} className="text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{edu.institution}</span>
                <span className="font-normal text-slate-600 font-sans">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="text-slate-700 italic">
                {edu.degree}, {edu.field} {edu.gpa && <span className="font-semibold text-slate-900 not-italic">• GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <section key="skills">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
          Executive Competencies
        </h2>
        <div className="text-xs text-slate-800">
          <p>{skills.map((s) => s.name).join(' • ')}</p>
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <section key="projects">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
          Key Strategic Projects
        </h2>
        <div className="space-y-2 text-xs">
          {projects.map((p) => (
            <div key={p.id}>
              <div className="font-bold text-slate-950">{p.title}</div>
              <ul className="list-disc list-outside ml-4 text-slate-800 space-y-0.5 mt-0.5">
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (!certifications || certifications.length === 0) return null;
    return (
      <section key="certifications">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
          Certifications & Governance
        </h2>
        <div className="text-xs space-y-1 text-slate-800">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <span><strong>{cert.name}</strong> — {cert.issuer}</span>
              <span className="text-slate-600">{cert.date}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;
    return (
      <section key="languages">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
          Languages
        </h2>
        <div className="text-xs text-slate-800">
          {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
        </div>
      </section>
    );
  };

  const renderAwards = () => {
    if (!awards || awards.length === 0) return null;
    return (
      <section key="awards">
        <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
          Awards & Recognition
        </h2>
        <div className="text-xs space-y-1 text-slate-800">
          {awards.map((award) => (
            <div key={award.id} className="flex justify-between">
              <span><strong>{award.title}</strong> — {award.issuer}</span>
              <span className="text-slate-600">{award.year}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
    certifications: renderCertifications,
    languages: renderLanguages,
    awards: renderAwards,
  };

  const activeOrder =
    design.sectionOrder && design.sectionOrder.length > 0
      ? design.sectionOrder
      : ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'awards'];

  return (
    <div className={`${containerPadding} text-slate-900 bg-white min-h-full ${fontClass} ${fontSizeClass}`}>
      {/* Corporate Header */}
      <header className="border-b-2 border-slate-900 pb-3 mb-3.5">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
          <h1
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const val = e.currentTarget.textContent || '';
              if (val !== personalInfo.fullName) {
                updateResumeData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, fullName: val },
                }), 'Edited Full Name');
              }
            }}
            className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-slate-950 outline-none focus:bg-blue-50/50 rounded px-1"
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const val = e.currentTarget.textContent || '';
              if (val !== personalInfo.jobTitle) {
                updateResumeData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, jobTitle: val },
                }), 'Edited Job Title');
              }
            }}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 outline-none focus:bg-blue-50/50 rounded px-1"
          >
            {personalInfo.jobTitle || 'Target Job Title'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1.5">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && (
            <span>
              <strong>E:</strong> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span>
              <strong>T:</strong> {personalInfo.phone}
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              <strong>LinkedIn:</strong> {personalInfo.linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Dynamic Sections */}
      <div className={spacingClass}>
        {activeOrder.map((sectionKey) => {
          const renderer = sectionMap[sectionKey];
          return renderer ? <React.Fragment key={sectionKey}>{renderer()}</React.Fragment> : null;
        })}
      </div>
    </div>
  );
};
