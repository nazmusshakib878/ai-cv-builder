'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { useResume } from '@/context/ResumeContext';
import { Stethoscope, ShieldCheck } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const HealthcareTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
      <section key="summary">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5 flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
          Professional Summary
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
          className="text-slate-800 leading-relaxed text-justify outline-none focus:bg-emerald-50/50 rounded p-1"
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-2.5">
          Professional Experience
        </h2>
        <div className="space-y-3">
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
                  className="font-bold text-slate-900 text-sm outline-none focus:bg-emerald-50 rounded"
                >
                  {exp.role}
                </span>
                <span className="text-xs font-medium text-emerald-800">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-xs text-slate-600 font-semibold mb-1">
                {exp.company} • {exp.location}
              </div>
              <ul className="text-xs text-slate-700 space-y-1">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5">
          Clinical Education & Credentials
        </h2>
        <div className="space-y-2 text-xs">
          {education.map((edu, eduIdx) => (
            <div key={edu.id || eduIdx}>
              <div className="flex justify-between font-bold text-slate-900">
                <span>{edu.institution}</span>
                <span className="text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="text-slate-700">
                {edu.degree}, {edu.field} {edu.gpa && <span className="font-semibold text-emerald-900">• GPA: {edu.gpa}</span>}
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          Clinical Competencies & Standards
        </h2>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {skills.map((s) => (
            <span
              key={s.id}
              className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 font-medium text-[11.5px] border border-emerald-200"
            >
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
      <section key="projects">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5">
          Clinical Projects & Quality Audits
        </h2>
        <div className="space-y-2 text-xs">
          {projects.map((p) => (
            <div key={p.id}>
              <div className="font-bold text-slate-900">{p.title}</div>
              <ul className="text-slate-700 space-y-0.5 mt-0.5">
                {p.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600">•</span>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5">
          Licensure & Board Certifications
        </h2>
        <div className="space-y-1.5 text-xs text-slate-800">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <div>
                <span className="font-bold text-slate-950">{cert.name}</span> — {cert.issuer}
                {cert.credentialId && <span className="text-slate-500 text-[11px]"> (ID: {cert.credentialId})</span>}
              </div>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5">
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-0.5 mb-1.5">
          Awards & Recognition
        </h2>
        <div className="space-y-1 text-xs text-slate-800">
          {awards.map((award) => (
            <div key={award.id} className="flex justify-between">
              <span className="font-semibold text-slate-900">{award.title} — {award.issuer}</span>
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
      {/* Healthcare Header */}
      <header className="border-b-2 border-emerald-700 pb-3 mb-3.5">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
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
              className="text-2xl md:text-3xl font-extrabold text-emerald-950 tracking-tight outline-none focus:bg-emerald-50 rounded px-1"
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
              className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-0.5 outline-none focus:bg-emerald-50 rounded px-1"
            >
              {personalInfo.jobTitle || 'Target Job Title'}
            </div>
          </div>
          <div className="text-xs text-slate-600 space-y-0.5 md:text-right">
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
