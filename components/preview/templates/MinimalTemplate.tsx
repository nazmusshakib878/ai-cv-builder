'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { useResume } from '@/context/ResumeContext';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
      ? 'text-[14px] leading-[1.6]'
      : 'text-[13px] leading-[1.5]';

  const spacingClass =
    design.sectionSpacing === 'compact' || design.onePageMode
      ? 'space-y-3'
      : design.sectionSpacing === 'relaxed'
      ? 'space-y-7'
      : 'space-y-5';

  const containerPadding = design.onePageMode ? 'p-6 md:p-7' : 'p-8 md:p-10';

  const renderSummary = () => {
    if (!personalInfo.summary) return null;
    return (
      <section key="summary" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">About</div>
        <div
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
          className="md:col-span-3 text-slate-700 leading-relaxed font-normal outline-none focus:bg-blue-50/50 rounded p-1"
        >
          {personalInfo.summary}
        </div>
      </section>
    );
  };

  const renderExperience = () => {
    if (!experiences || experiences.length === 0) return null;
    return (
      <section key="experience" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience</div>
        <div className="md:col-span-3 space-y-4">
          {experiences.map((exp, expIdx) => (
            <div key={exp.id || expIdx}>
              <div className="flex justify-between items-baseline">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const val = e.currentTarget.textContent || '';
                    updateResumeData((prev) => ({
                      ...prev,
                      experiences: prev.experiences.map((item, i) =>
                        i === expIdx ? { ...item, role: val } : item
                      ),
                    }));
                  }}
                  className="font-bold text-slate-900 text-sm outline-none focus:bg-blue-50 rounded"
                >
                  {exp.role}
                </span>
                <span className="text-xs text-slate-400">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-xs text-slate-600 font-medium mb-1">
                {exp.company} • {exp.location}
              </div>
              <ul className="text-xs text-slate-600 space-y-1 mt-1">
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    — {b}
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
      <section key="education" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Education</div>
        <div className="md:col-span-3 space-y-3">
          {education.map((edu, eduIdx) => (
            <div key={edu.id || eduIdx} className="text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900">{edu.institution}</span>
                <span className="text-slate-400">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="text-slate-600">
                {edu.degree}, {edu.field} {edu.gpa && <span className="font-medium text-slate-800">• GPA: {edu.gpa}</span>}
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
      <section key="skills" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills</div>
        <div className="md:col-span-3 flex flex-wrap gap-2 text-xs text-slate-700">
          {skills.map((s) => (
            <span key={s.id} className="underline decoration-slate-300 underline-offset-4">
              {s.name}
            </span>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <section key="projects" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projects</div>
        <div className="md:col-span-3 space-y-2 text-xs">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="font-bold text-slate-900">{proj.title}</div>
              <ul className="text-slate-600 space-y-0.5 mt-0.5">
                {proj.bullets.map((b, i) => (
                  <li key={i}>— {b}</li>
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
      <section key="certifications" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credentials</div>
        <div className="md:col-span-3 space-y-1 text-xs text-slate-700">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <span>{cert.name} ({cert.issuer})</span>
              <span className="text-slate-400">{cert.date}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;
    return (
      <section key="languages" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Languages</div>
        <div className="md:col-span-3 text-xs text-slate-700">
          {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
        </div>
      </section>
    );
  };

  const renderAwards = () => {
    if (!awards || awards.length === 0) return null;
    return (
      <section key="awards" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awards</div>
        <div className="md:col-span-3 space-y-1 text-xs text-slate-700">
          {awards.map((award) => (
            <div key={award.id} className="flex justify-between">
              <span>{award.title}</span>
              <span className="text-slate-400">{award.year}</span>
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
    <div className={`${containerPadding} text-slate-800 bg-white min-h-full ${fontClass} ${fontSizeClass}`}>
      {/* Swiss Minimal Header */}
      <header className="mb-5">
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
          className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 outline-none focus:bg-blue-50/50 rounded px-1 inline-block"
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
          className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5 outline-none focus:bg-blue-50/50 rounded px-1"
        >
          {personalInfo.jobTitle || 'Target Job Title'}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
          {personalInfo.email && (
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const val = e.currentTarget.textContent || '';
                updateResumeData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: val },
                }));
              }}
              className="outline-none focus:bg-blue-50 rounded"
            >
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const val = e.currentTarget.textContent || '';
                updateResumeData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: val },
                }));
              }}
              className="outline-none focus:bg-blue-50 rounded"
            >
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
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
