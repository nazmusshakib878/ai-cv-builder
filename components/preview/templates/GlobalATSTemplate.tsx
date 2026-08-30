'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const GlobalATSTemplate: React.FC<TemplateProps> = ({ data, design }) => {
  const { personalInfo, experiences = [], education = [], skills = [], certifications = [], languages = [], awards = [] } = data;
  const isOnePage = design.onePageMode;

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

  const baseTextSize =
    design.fontSize === 'sm' || isOnePage ? 'text-[10px] leading-[1.38]' : design.fontSize === 'lg' ? 'text-[11.5px] leading-[1.48]' : 'text-[10.5px] leading-[1.42]';

  const headingTextSize =
    design.fontSize === 'sm' || isOnePage ? 'text-[11px]' : design.fontSize === 'lg' ? 'text-[12.5px]' : 'text-[11.5px]';

  const sectionSpacing =
    design.sectionSpacing === 'compact' || isOnePage ? 'space-y-2' : design.sectionSpacing === 'relaxed' ? 'space-y-3.5' : 'space-y-2.5';

  return (
    <div
      className={`bg-white text-slate-900 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            HEADER (Page 1 Reference)
           ========================================================= */}
        <div className="p-8 pb-3 text-center border-b border-slate-300 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-900">
            {personalInfo.fullName || 'ALEX MORGAN'}
          </h1>
          <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-700 mt-0.5">
            {personalInfo.jobTitle || 'OPERATIONS & QUALITY PROFESSIONAL'}
          </p>
          <div className="text-[10.5px] text-slate-600 mt-1.5 flex flex-wrap justify-center items-center gap-1.5">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.email && <span>| {personalInfo.email}</span>}
            {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* =========================================================
            MAIN 100% SINGLE-COLUMN ATS CONTENT
           ========================================================= */}
        <div className={`p-8 pt-3 ${sectionSpacing} flex-1`}>
          {/* PROFESSIONAL SUMMARY */}
          {personalInfo.summary && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${headingTextSize}`}>
                PROFESSIONAL SUMMARY
              </h2>
              <p className={`text-slate-800 leading-relaxed text-justify ${baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* CORE SKILLS */}
          {skills.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${headingTextSize}`}>
                CORE SKILLS
              </h2>
              <p className={`text-slate-800 font-medium ${baseTextSize}`}>
                {skills.map((s) => s.name).join(' • ')}
              </p>
            </div>
          )}

          {/* PROFESSIONAL EXPERIENCE */}
          {experiences.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-2 ${headingTextSize}`}>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">
                      {exp.role} | {exp.company} | {exp.location || 'Dhaka, Bangladesh'}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-600">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-0.5 pl-3 mt-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className={`list-disc text-slate-800 ${baseTextSize}`}>
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

          {/* EDUCATION */}
          {education.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${headingTextSize}`}>
                EDUCATION
              </h2>
              <div className="space-y-1 text-[10.5px]">
                {education.map((edu) => (
                  <div key={edu.id} className="text-slate-800">
                    <span className="font-bold">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</span>
                    <span> | {edu.institution}</span>
                    <span> | {edu.endDate || edu.startDate}</span>
                    {edu.gpa && <span className="font-semibold"> | GPA: {edu.gpa}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS & LANGUAGES */}
          {(certifications.length > 0 || languages.length > 0) && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${headingTextSize}`}>
                CERTIFICATIONS &amp; LANGUAGES
              </h2>
              <p className={`text-slate-800 ${baseTextSize}`}>
                {[
                  ...certifications.map((c) => c.name || c.title),
                  ...languages.map((l) => `${l.language} - ${l.proficiency}`),
                ].join(' | ')}
              </p>
            </div>
          )}

          {/* AWARDS & ACHIEVEMENTS */}
          {awards.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1 ${headingTextSize}`}>
                HONORS &amp; ACHIEVEMENTS
              </h2>
              <ul className="space-y-0.5 pl-3">
                {awards.map((a) => (
                  <li key={a.id} className={`list-disc text-slate-800 ${baseTextSize}`}>
                    <span className="font-semibold">{a.title}</span>
                    {a.issuer && ` — ${a.issuer}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 01 | Global ATS Resume</span>
        <span>Recommended: USA • Canada • United Kingdom • Ireland • 100% ATS Compliant</span>
      </div>
    </div>
  );
};
