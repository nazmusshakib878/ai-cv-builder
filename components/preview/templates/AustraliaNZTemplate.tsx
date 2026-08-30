'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const AustraliaNZTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
      className={`bg-white text-slate-800 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            HEADER (Page 4 Reference)
           ========================================================= */}
        <div className="p-8 pb-4 border-b border-slate-300 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1e3a8a]">
            {personalInfo.fullName || 'ALEX MORGAN'}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
            {personalInfo.jobTitle || 'Operations & Quality Professional'}
          </p>
          <div className="text-[10.5px] text-slate-600 mt-2 flex flex-wrap items-center gap-2">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <span>| {personalInfo.email}</span>}
            {personalInfo.linkedin && <span>| <span className="text-[#1e3a8a] font-medium">{personalInfo.linkedin}</span></span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
          </div>
        </div>

        {/* =========================================================
            BODY (with Smart Vertical Balancing)
           ========================================================= */}
        <div className={`${metrics.contentPadding} pt-4 flex-1 flex flex-col ${metrics.distributeFlex} ${metrics.sectionSpacing}`}>
          {/* 2-COLUMN SPLIT: CAREER PROFILE (60%) + KEY STRENGTHS (40%) */}
          <div className="grid grid-cols-[60%_40%] gap-6 pb-2 border-b border-slate-200">
            {/* Left: Career Profile */}
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] mb-1.5 ${metrics.headingTextSize}`}>
                CAREER PROFILE
              </h2>
              <p className={`text-slate-700 leading-relaxed text-justify ${metrics.baseTextSize}`}>
                {personalInfo.summary || 'Experienced professional with a practical approach to teamwork, compliance and continuous improvement.'}
              </p>
            </div>

            {/* Right: Key Strengths */}
            {skills.length > 0 && (
              <div className="border-l border-slate-200 pl-4">
                <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] mb-1.5 ${metrics.headingTextSize}`}>
                  KEY STRENGTHS
                </h2>
                <ul className="space-y-1 text-slate-700">
                  {skills.slice(0, 6).map((s) => (
                    <li key={s.id} className={`list-disc ml-3 font-medium ${metrics.baseTextSize}`}>
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* EMPLOYMENT HISTORY */}
          {experiences.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                EMPLOYMENT HISTORY
              </h2>
              <div className={metrics.itemSpacing}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">
                      {exp.role} — {exp.company}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-600">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate} | {exp.location || 'Dhaka, Bangladesh'}
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

          {/* EDUCATION & TRAINING */}
          {education.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                EDUCATION &amp; TRAINING
              </h2>
              <div className={metrics.itemSpacing}>
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <div className="font-bold text-slate-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      {edu.institution}, {edu.location || 'Bangladesh'} ({edu.endDate || edu.startDate})
                      {edu.gpa && <span className="font-bold text-[#1e3a8a]"> — CGPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                CERTIFICATIONS &amp; LICENSES
              </h2>
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-bold text-slate-900">{c.name || c.title}</span>
                    {c.issuer && <span> — {c.issuer}</span>}
                    {c.date && <span> ({c.date})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                LANGUAGES
              </h2>
              <p className={`text-slate-800 font-medium ${metrics.baseTextSize}`}>
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
              </p>
            </div>
          )}

          {/* REFEREES */}
          <div>
            <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
              REFEREES
            </h2>
            <p className={`text-slate-700 italic ${metrics.baseTextSize}`}>Available upon request</p>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
           ========================================================= */}
        <div className="px-8 py-3 bg-[#f8fafc] border-t border-slate-200 text-center text-[10px] text-slate-500 shrink-0">
          Australia &amp; New Zealand Format • A4 Standard • Competency-Based Structure
        </div>
      </div>
    </div>
  );
};
