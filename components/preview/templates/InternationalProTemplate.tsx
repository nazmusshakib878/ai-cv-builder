'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const InternationalProTemplate: React.FC<TemplateProps> = ({ data, design }) => {
  const {
    personalInfo = { fullName: '', jobTitle: '', email: '', phone: '', location: '', summary: '' },
    experiences = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    awards = [],
  } = data;

  const metrics = computeSmartVerticalSpacing(data, design);

  const fontClass =
    design.fontFamily === 'merriweather'
      ? 'font-serif'
      : design.fontFamily === 'playfair'
      ? 'font-playfair'
      : design.fontFamily === 'mono'
      ? 'font-mono'
      : design.fontFamily === 'jakarta'
      ? 'font-jakarta'
      : 'font-sans';

  return (
    <div
      className={`bg-white text-slate-800 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            TOP HEADER BANNER
           ========================================================= */}
        <div className={`bg-white px-8 ${metrics.headerPadding} border-b border-slate-200 shrink-0`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-slate-900">
                International Professional CV
              </h1>
              <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                Recommended for overseas applications where a modern, no-photo, ATS-readable CV is appropriate
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-teal-800 text-teal-100">
                Overseas Jobs
              </span>
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-slate-700 text-slate-100">
                No Photo
              </span>
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-slate-700 text-slate-100">
                ATS-Readable
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            CANDIDATE HEADER
           ========================================================= */}
        <div className="px-8 pt-5 pb-3 flex items-start justify-between border-b border-slate-300 shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              {personalInfo.fullName || 'YOUR FULL NAME'}
            </h2>
            <p className="text-sm sm:text-base font-bold text-teal-700 mt-0.5">
              {personalInfo.jobTitle || 'Professional Title | Functional Specialization'}
            </p>
          </div>

          <div className="text-right text-[10.5px] text-slate-600 space-y-0.5">
            {personalInfo.email && <div className="font-semibold text-slate-900">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            <div>
              {personalInfo.location || 'Dhaka, Bangladesh'}
              {personalInfo.linkedin && (
                <span> | <span className="text-teal-700 font-medium">{personalInfo.linkedin}</span></span>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN CONTENT: Vertically Balanced Across A4 Canvas
           ========================================================= */}
        <div className={`${metrics.contentPadding} flex-1 flex flex-col justify-between`}>
          {/* PROFESSIONAL SUMMARY */}
          {personalInfo.summary && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Professional Summary
              </h3>
              <p className={`text-slate-700 leading-relaxed text-justify ${metrics.baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* KEY COMPETENCIES (3 or 4 Column Grid) */}
          {skills.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Key Competencies
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-1 text-[10.5px] text-slate-700">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-1.5 truncate">
                    <span className="text-teal-700 font-bold">•</span>
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFESSIONAL EXPERIENCE */}
          {experiences.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                Professional Experience
              </h3>
              <div className={metrics.itemSpacing}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900 text-[11.5px]">{exp.role}</span>
                      <span className="text-[10px] font-semibold text-slate-600">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-teal-800 font-medium">
                      {exp.company} | {exp.location || 'Dhaka, Bangladesh'}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className={`pl-4 space-y-0.5 text-slate-700 ${metrics.baseTextSize}`}>
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="list-disc">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION & QUALIFICATIONS */}
          {education.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Education &amp; Qualifications
              </h3>
              <div className={metrics.itemSpacing}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-[11px]">
                    <div>
                      <div className="font-bold text-slate-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {edu.institution} {edu.location && `| ${edu.location}`}
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 text-right">
                      {edu.endDate || edu.startDate}
                      {edu.gpa && <div className="text-teal-700 font-bold">CGPA: {edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS & LICENSES */}
          {certifications.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Certifications &amp; Professional Credentials
              </h3>
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-bold text-slate-900">{c.name || c.title}</span>
                    {c.issuer && <span className="text-slate-600"> | {c.issuer}</span>}
                    {c.date && <span className="text-slate-500"> | {c.date}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Languages
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10.5px] text-slate-700">
                {languages.map((l) => (
                  <div key={l.id} className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{l.language}:</span>
                    <span className="text-slate-600">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REFERENCES - Anchored at the bottom */}
          <div className="pt-1">
            <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
              References
            </h3>
            <p className={`text-slate-600 italic ${metrics.baseTextSize}`}>Available upon request</p>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
           ========================================================= */}
        <div className="px-8 py-3 bg-[#f8fafc] border-t border-slate-200 text-center text-[10px] text-slate-500 shrink-0">
          International Professional Format • Standard A4 • ATS-Optimized
        </div>
      </div>
    </div>
  );
};
