'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { useResume } from '@/context/ResumeContext';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const ATSClassicTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
      ? 'text-[12px] leading-[1.35]'
      : design.fontSize === 'lg'
      ? 'text-[14.5px] leading-[1.55]'
      : 'text-[13.5px] leading-[1.45]';

  const spacingClass =
    design.sectionSpacing === 'compact' || design.onePageMode
      ? 'space-y-2.5'
      : design.sectionSpacing === 'relaxed'
      ? 'space-y-6'
      : 'space-y-4';

  const bulletMarginClass =
    design.lineSpacing === 'compact' || design.onePageMode
      ? 'space-y-0.5'
      : design.lineSpacing === 'relaxed'
      ? 'space-y-1.5'
      : 'space-y-1';

  const containerPaddingClass = design.onePageMode ? 'p-6 md:p-7' : 'p-8 md:p-10';

  const renderSummary = () => {
    if (!personalInfo.summary) return null;
    return (
      <section key="summary">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5">
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
          className="text-justify text-slate-800 outline-none focus:bg-blue-50/50 rounded p-1"
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
          Professional Experience
        </h2>
        <div className="space-y-3">
          {experiences.map((exp, expIdx) => (
            <div key={exp.id || expIdx}>
              <div className="flex justify-between items-baseline text-xs font-semibold">
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
                  className="text-slate-950 font-bold text-[13px] outline-none focus:bg-blue-50 rounded"
                >
                  {exp.company}
                </span>
                <span className="text-slate-600 text-[12px] font-normal">{exp.location}</span>
              </div>

              <div className="flex justify-between items-baseline text-xs text-slate-800 italic mb-1">
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
                  className="font-medium text-slate-900 not-italic outline-none focus:bg-blue-50 rounded"
                >
                  {exp.role}
                </span>
                <span className="text-slate-600 text-[11.5px] not-italic">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>

              <ul className={`list-disc list-outside ml-4 text-slate-800 ${bulletMarginClass}`}>
                {exp.bullets.map((bullet, bIdx) => (
                  <li
                    key={bIdx}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const val = e.currentTarget.textContent || '';
                      updateResumeData((prev) => ({
                        ...prev,
                        experiences: prev.experiences.map((item, i) => {
                          if (i === expIdx) {
                            const newBullets = [...item.bullets];
                            newBullets[bIdx] = val;
                            return { ...item, bullets: newBullets };
                          }
                          return item;
                        }),
                      }));
                    }}
                    className="pl-0.5 outline-none focus:bg-blue-50/50 rounded"
                  >
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5">
          Education
        </h2>
        <div className="space-y-1.5">
          {education.map((edu, eduIdx) => (
            <div key={edu.id || eduIdx} className="text-xs">
              <div className="flex justify-between items-baseline">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const val = e.currentTarget.textContent || '';
                    updateResumeData((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === eduIdx ? { ...item, institution: val } : item
                      ),
                    }));
                  }}
                  className="font-bold text-slate-950 outline-none focus:bg-blue-50 rounded"
                >
                  {edu.institution}
                </span>
                <span className="text-slate-600 text-[11.5px]">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-slate-800">
                <span>
                  {edu.degree}, {edu.field}
                  {edu.gpa && <span className="font-medium text-slate-900"> • GPA: {edu.gpa}</span>}
                </span>
                <span className="text-slate-600">{edu.location}</span>
              </div>
              {edu.honors && (
                <div className="text-[11.5px] text-slate-600 italic">Honors: {edu.honors}</div>
              )}
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5">
          Skills & Core Competencies
        </h2>
        <div className="text-xs space-y-1 text-slate-800">
          <div>
            <span className="font-bold text-slate-950">Skills: </span>
            <span>{skills.map((s) => s.name).join(' • ')}</span>
          </div>
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <section key="projects">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
          Key Projects
        </h2>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-bold text-slate-950">
                  {proj.title} {proj.role && <span className="font-normal text-slate-600">| {proj.role}</span>}
                </span>
                {proj.techStack && (
                  <span className="text-[11px] text-slate-600 italic">[{proj.techStack.join(', ')}]</span>
                )}
              </div>
              <ul className={`list-disc list-outside ml-4 text-slate-800 mt-0.5 ${bulletMarginClass}`}>
                {proj.bullets.map((b, i) => (
                  <li key={i} className="pl-0.5">
                    {b}
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5">
          Certifications
        </h2>
        <div className="text-xs space-y-1 text-slate-800">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <span>
                <strong className="text-slate-950">{cert.name}</strong> — {cert.issuer}
              </span>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5">
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5">
          Honors & Awards
        </h2>
        <div className="text-xs space-y-1 text-slate-800">
          {awards.map((award) => (
            <div key={award.id} className="flex justify-between">
              <span>
                <strong className="text-slate-950">{award.title}</strong> — {award.issuer}
              </span>
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
    <div className={`${containerPaddingClass} text-slate-900 bg-white min-h-full ${fontClass} ${fontSizeClass}`}>
      {/* ATS Standard Header */}
      <header className="text-center border-b border-slate-300 pb-3 mb-3.5">
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
          className="text-2xl font-bold tracking-tight text-slate-950 uppercase outline-none focus:bg-blue-50/50 rounded px-1"
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
          className="text-[13px] font-semibold text-slate-700 mt-0.5 uppercase tracking-wider outline-none focus:bg-blue-50/50 rounded px-1 inline-block"
        >
          {personalInfo.jobTitle || 'Target Job Title'}
        </div>

        {/* Contact info in ATS single-line format */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1.5">
          {personalInfo.location && (
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const val = e.currentTarget.textContent || '';
                updateResumeData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, location: val },
                }));
              }}
              className="outline-none focus:bg-blue-50 rounded"
            >
              {personalInfo.location}
            </span>
          )}

          {personalInfo.email && (
            <>
              <span>•</span>
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
                className="text-slate-800 outline-none focus:bg-blue-50 rounded"
              >
                {personalInfo.email}
              </span>
            </>
          )}

          {personalInfo.phone && (
            <>
              <span>•</span>
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
            </>
          )}

          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span className="text-slate-800">{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Dynamic Sections Container */}
      <div className={spacingClass}>
        {activeOrder.map((sectionKey) => {
          const renderer = sectionMap[sectionKey];
          return renderer ? <React.Fragment key={sectionKey}>{renderer()}</React.Fragment> : null;
        })}
      </div>
    </div>
  );
};
