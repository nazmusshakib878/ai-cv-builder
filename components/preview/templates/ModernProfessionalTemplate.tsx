'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { useResume } from '@/context/ResumeContext';
import { Mail, Phone, MapPin, Link } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const ModernProfessionalTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
      ? 'space-y-5'
      : 'space-y-4';

  const bulletMarginClass =
    design.lineSpacing === 'compact' || design.onePageMode
      ? 'space-y-0.5'
      : design.lineSpacing === 'relaxed'
      ? 'space-y-1.5'
      : 'space-y-1';

  const containerPadding = design.onePageMode ? 'p-6 md:p-7' : 'p-8 md:p-9';

  const renderSummary = () => {
    if (!personalInfo.summary) return null;
    return (
      <section key="summary">
        <div className="flex items-center gap-2 mb-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Professional Summary
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>
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
          className="text-slate-700 leading-relaxed outline-none focus:bg-blue-50/50 rounded p-1"
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
        <div className="flex items-center gap-2 mb-2">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Work Experience
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <div className="space-y-3.5">
          {experiences.map((exp, expIdx) => (
            <div key={exp.id || expIdx} className="relative pl-3 border-l-2 border-slate-100 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <div>
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
                    className="font-bold text-slate-950 text-[13.5px] outline-none focus:bg-blue-50 rounded"
                  >
                    {exp.role}
                  </span>
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
                    className="text-slate-600 font-medium text-xs outline-none focus:bg-blue-50 rounded"
                  >
                    {' '}— {exp.company}
                  </span>
                </div>
                <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-[11.5px] text-slate-500 mb-1">{exp.location}</div>

              <ul className={`text-slate-700 ${bulletMarginClass}`}>
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5 text-xs">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 opacity-80"
                      style={{ backgroundColor: design.accentColor }}
                    />
                    <span
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
                      className="flex-1 outline-none focus:bg-blue-50/50 rounded"
                    >
                      {b}
                    </span>
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
        <div className="flex items-center gap-2 mb-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Education
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>
        <div className="space-y-2 text-xs">
          {education.map((edu, eduIdx) => (
            <div key={edu.id || eduIdx}>
              <div
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
                className="font-bold text-slate-900 outline-none focus:bg-blue-50 rounded"
              >
                {edu.institution}
              </div>
              <div className="text-slate-700">
                {edu.degree}, {edu.field}
              </div>
              <div className="text-[11px] text-slate-500">
                {edu.startDate} – {edu.endDate} {edu.gpa && <span className="font-semibold text-slate-700">• GPA: {edu.gpa}</span>}
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
        <div className="flex items-center gap-2 mb-2">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Skills & Key Competencies
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {skills.map((s) => (
            <span
              key={s.id}
              className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-800 font-semibold text-[11.5px] border border-slate-200"
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
        <div className="flex items-center gap-2 mb-2">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Featured Projects
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-950">
                  {proj.title} {proj.role && <span className="font-medium text-slate-600">({proj.role})</span>}
                </span>
                {proj.techStack && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {proj.techStack.join(' • ')}
                  </span>
                )}
              </div>
              <ul className={`mt-0.5 text-slate-700 ${bulletMarginClass}`}>
                {proj.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span className="flex-1">{b}</span>
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
        <div className="flex items-center gap-2 mb-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Certifications
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>
        <div className="space-y-1.5 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id}>
              <div className="font-bold text-slate-900">{cert.name}</div>
              <div className="text-[11px] text-slate-600">
                {cert.issuer} • {cert.date}
              </div>
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
        <div className="flex items-center gap-2 mb-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Languages
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>
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
        <div className="flex items-center gap-2 mb-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ color: design.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
            Honors & Awards
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>
        <div className="space-y-1 text-xs text-slate-800">
          {awards.map((award) => (
            <div key={award.id} className="flex justify-between">
              <span className="font-semibold text-slate-900">{award.title} — {award.issuer}</span>
              <span className="text-slate-500">{award.year}</span>
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
      {/* Modern Top Header with Accent Border */}
      <header className="relative pb-3.5 mb-3.5 border-b border-slate-100">
        {/* Top Accent Line */}
        <div
          className="absolute -top-8 -left-8 -right-8 md:-top-9 md:-left-9 md:-right-9 h-2"
          style={{ backgroundColor: design.accentColor }}
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
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
              className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 outline-none focus:bg-blue-50/50 rounded px-1"
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
              className="text-sm font-semibold tracking-wide mt-0.5 outline-none focus:bg-blue-50/50 rounded px-1"
              style={{ color: design.accentColor }}
            >
              {personalInfo.jobTitle || 'Target Job Title'}
            </p>
          </div>

          {/* Quick Contact Chips */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
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
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
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
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1 text-slate-700">
                <Link className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
          </div>
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
