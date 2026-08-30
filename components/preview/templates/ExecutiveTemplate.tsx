'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { useResume } from '@/context/ResumeContext';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
      ? 'text-[14px] leading-[1.55]'
      : 'text-[13px] leading-[1.45]';

  const spacingClass =
    design.sectionSpacing === 'compact' || design.onePageMode
      ? 'space-y-3'
      : design.sectionSpacing === 'relaxed'
      ? 'space-y-6'
      : 'space-y-4';

  const containerPadding = design.onePageMode ? 'p-6 md:p-7' : 'p-8 md:p-10';

  const renderSummary = () => {
    if (!personalInfo.summary) return null;
    return (
      <section
        key="summary"
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
        className="p-3.5 rounded-lg bg-slate-50 border-l-4 border-slate-900 text-slate-800 leading-relaxed italic text-xs outline-none focus:bg-blue-50/50"
      >
        {personalInfo.summary}
      </section>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <section key="skills">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
          Core Competencies & Skills
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {skills.map((skill) => (
            <div key={skill.id} className="p-2 rounded-md bg-slate-100/70 border border-slate-200 text-xs font-medium text-slate-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="truncate">{skill.name}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderExperience = () => {
    if (!experiences || experiences.length === 0) return null;
    return (
      <section key="experience">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
          Executive Leadership Experience
        </h2>
        <div className="space-y-4">
          {experiences.map((exp, expIdx) => (
            <div key={exp.id || expIdx}>
              <div className="flex justify-between items-baseline">
                <span className="font-extrabold text-slate-950 text-sm">{exp.role}</span>
                <span className="text-xs font-mono text-slate-600">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-xs font-semibold text-blue-700 mb-1.5">
                {exp.company} • {exp.location}
              </div>
              <ul className="text-xs text-slate-700 space-y-1">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">›</span>
                    <span className="flex-1 leading-relaxed">{bullet}</span>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
          Academic Credentials
        </h2>
        <div className="space-y-2 text-xs">
          {education.map((edu, eduIdx) => (
            <div key={edu.id || eduIdx}>
              <div className="flex justify-between font-bold text-slate-950">
                <span>{edu.institution}</span>
                <span className="font-mono text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="text-slate-700">
                {edu.degree}, {edu.field} {edu.gpa && <span className="font-semibold text-slate-900">• GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <section key="projects">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
          Strategic Initiatives & Projects
        </h2>
        <div className="space-y-2 text-xs">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="font-bold text-slate-950">{proj.title}</div>
              <ul className="text-slate-700 space-y-0.5 mt-0.5">
                {proj.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-600">›</span>
                    <span>{b}</span>
                  </li>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
          Certifications & Board Affiliations
        </h2>
        <div className="text-xs space-y-1 text-slate-700">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <span className="font-medium text-slate-900">{cert.name} — {cert.issuer}</span>
              <span className="font-mono text-slate-500">{cert.date}</span>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
          Languages
        </h2>
        <div className="text-xs text-slate-700">
          {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
        </div>
      </section>
    );
  };

  const renderAwards = () => {
    if (!awards || awards.length === 0) return null;
    return (
      <section key="awards">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
          Honors & Distinctions
        </h2>
        <div className="text-xs space-y-1 text-slate-700">
          {awards.map((award) => (
            <div key={award.id} className="flex justify-between">
              <span className="font-semibold text-slate-900">{award.title} — {award.issuer}</span>
              <span className="font-mono text-slate-500">{award.year}</span>
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
      : ['summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages', 'awards'];

  return (
    <div className={`${containerPadding} text-slate-900 bg-white min-h-full ${fontClass} ${fontSizeClass}`}>
      {/* Executive Hero Header */}
      <header className="p-4 sm:p-5 rounded-xl bg-slate-950 text-white mb-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
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
              className="text-2xl md:text-3xl font-extrabold tracking-tight text-white outline-none focus:bg-slate-800 rounded px-1"
            >
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p
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
              className="text-xs uppercase tracking-widest font-semibold text-blue-400 mt-0.5 outline-none focus:bg-slate-800 rounded px-1"
            >
              {personalInfo.jobTitle || 'Target Job Title'}
            </p>
          </div>

          <div className="text-xs text-slate-300 space-y-0.5 text-left md:text-right font-mono">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
          </div>
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
