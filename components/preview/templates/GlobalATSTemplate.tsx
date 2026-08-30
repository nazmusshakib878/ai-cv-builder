'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const GlobalATSTemplate: React.FC<TemplateProps> = ({ data, design }) => {
  const {
    personalInfo = { fullName: '', jobTitle: '', email: '', phone: '', location: '', summary: '' },
    experiences = [],
    education = [],
    skills = [],
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
      className={`bg-white text-slate-900 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            HEADER (Page 1 Reference)
           ========================================================= */}
        <div className={`p-8 pb-3 text-center border-b border-slate-300 shrink-0`}>
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
            MAIN 100% SINGLE-COLUMN ATS CONTENT (Vertically Balanced Across A4)
           ========================================================= */}
        <div className={`${metrics.contentPadding} pt-3 flex-1 flex flex-col justify-between`}>
          {/* PROFESSIONAL SUMMARY */}
          {personalInfo.summary && (
            <div className="mb-2">
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                PROFESSIONAL SUMMARY
              </h2>
              <p className={`text-slate-800 leading-relaxed text-justify ${metrics.baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* CORE SKILLS */}
          {skills.length > 0 && (
            <div className="mb-2">
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                CORE SKILLS
              </h2>
              <p className={`text-slate-800 font-medium ${metrics.baseTextSize}`}>
                {skills.map((s) => s.name).join(' • ')}
              </p>
            </div>
          )}

          {/* PROFESSIONAL EXPERIENCE */}
          {experiences.length > 0 && (
            <div className="mb-2">
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className={metrics.itemSpacing}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">
                      {exp.role} | {exp.company} | {exp.location || 'Dhaka, Bangladesh'}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-600">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className={`pl-4 space-y-0.5 text-slate-800 ${metrics.baseTextSize}`}>
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

          {/* EDUCATION */}
          {education.length > 0 && (
            <div className="mb-2">
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                EDUCATION
              </h2>
              <div className={metrics.itemSpacing}>
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <div className="font-bold text-slate-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div className="text-[10px] text-slate-700">
                      {edu.institution}, {edu.location || 'Bangladesh'} ({edu.endDate || edu.startDate})
                      {edu.gpa && <span className="font-bold"> — CGPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <div className="mb-2">
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                CERTIFICATIONS &amp; LICENSES
              </h2>
              <div className="space-y-1 text-[10.5px] text-slate-800">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-bold">{c.name || c.title}</span>
                    {c.issuer && <span> — {c.issuer}</span>}
                    {c.date && <span> ({c.date})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div className="mb-2">
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                LANGUAGES
              </h2>
              <p className={`text-slate-800 font-medium ${metrics.baseTextSize}`}>
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
              </p>
            </div>
          )}

          {/* REFERENCES - Anchored at bottom */}
          <div className="pt-1">
            <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
              REFERENCES
            </h2>
            <p className={`text-slate-700 italic ${metrics.baseTextSize}`}>Available upon request</p>
          </div>
        </div>
      </div>
    </div>
  );
};
