'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const MultinationalCorpTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
            TOP BANNER
           ========================================================= */}
        <div className={`bg-[#0f172a] text-white px-8 ${metrics.headerPadding} flex items-center justify-between shrink-0`}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white">
              Multinational Company CV
            </h1>
            <p className="text-[10.5px] text-slate-300 font-medium mt-0.5">
              Recommended for MNCs, global corporate roles, regional offices and structured corporate hiring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-[#b45309] text-amber-100">
              MNC
            </span>
            <span className="px-3 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
              Global Corporate
            </span>
            <span className="px-3 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
              Executive Style
            </span>
          </div>
        </div>

        {/* =========================================================
            CANDIDATE HEADER
           ========================================================= */}
        <div className="px-8 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            {personalInfo.fullName || 'YOUR FULL NAME'}
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#b45309] mt-0.5">
            {personalInfo.jobTitle || 'Corporate Function / Target Role'}
          </p>
          <div className="text-[10.5px] text-slate-600 mt-1.5 flex flex-wrap items-center gap-2">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <span>| <span className="text-blue-700 font-medium">{personalInfo.linkedin}</span></span>
            )}
          </div>
        </div>

        {/* =========================================================
            MAIN CONTENT (Vertically Balanced Across A4)
           ========================================================= */}
        <div className={`${metrics.contentPadding} flex-1 flex flex-col justify-between`}>
          {/* EXECUTIVE PROFILE */}
          {personalInfo.summary && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Executive Profile
              </h3>
              <p className={`text-slate-700 leading-relaxed text-justify ${metrics.baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* CORE VALUE & LEADERSHIP COMPETENCIES */}
          {skills.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Core Competencies &amp; Expertise
              </h3>
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[10.5px] text-slate-700">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-1.5">
                    <span className="text-[#b45309] font-bold">▪</span>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFESSIONAL CAREER HISTORY */}
          {experiences.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                Professional Career History
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
                    <div className="text-[10.5px] text-[#b45309] font-semibold">
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

          {/* EDUCATION & EXECUTIVE QUALIFICATIONS */}
          {education.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Education &amp; Academic Credentials
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
                      {edu.gpa && <div className="text-[#b45309] font-bold">CGPA: {edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <div className="mb-2">
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                Professional Certifications
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
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
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

          {/* REFERENCES - Anchored at bottom */}
          <div className="pt-1">
            <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
              References
            </h3>
            <p className={`text-slate-600 italic ${metrics.baseTextSize}`}>Available upon request</p>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
           ========================================================= */}
        <div className="px-8 py-3 bg-[#f8fafc] border-t border-slate-200 text-center text-[10px] text-slate-500 shrink-0">
          Multinational Corporate Structure • Standard A4 Format • Confidential
        </div>
      </div>
    </div>
  );
};
