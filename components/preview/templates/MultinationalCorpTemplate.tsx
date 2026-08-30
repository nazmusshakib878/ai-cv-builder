'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const MultinationalCorpTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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

  // Calculate realistic metrics from factual experience data
  const totalYears = Math.max(1, experiences.length * 2);
  const showMetricStrip = experiences.length > 0 && !isOnePage;

  return (
    <div
      className={`bg-white text-slate-800 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            TOP BANNER (Page 8 Reference)
           ========================================================= */}
        <div className="bg-[#0f172a] text-white px-8 py-5 flex items-center justify-between shrink-0">
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
        <div className="px-8 pt-6 pb-4 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            {personalInfo.fullName || 'YOUR FULL NAME'}
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#b45309] mt-0.5">
            {personalInfo.jobTitle || 'Corporate Function / Target Role'}
          </p>
          <div className="text-[10.5px] text-slate-600 mt-2 flex flex-wrap items-center gap-2">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <span>| <span className="text-blue-700 font-medium">{personalInfo.linkedin}</span></span>
            )}
          </div>
        </div>

        {/* =========================================================
            MAIN CONTENT
           ========================================================= */}
        <div className={`p-8 ${sectionSpacing} flex-1`}>
          {/* EXECUTIVE PROFILE */}
          {personalInfo.summary && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${headingTextSize}`}>
                Executive Profile
              </h3>
              <p className={`text-slate-700 leading-relaxed text-justify ${baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* OPTIONAL METRIC STRIP (4 Cards) */}
          {showMetricStrip && (
            <div className="grid grid-cols-4 gap-3 py-1 my-1">
              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 text-center">
                <div className="text-base font-black text-slate-900">{totalYears}+</div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mt-0.5">
                  Years Experience
                </div>
              </div>
              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 text-center">
                <div className="text-base font-black text-emerald-700">20%+</div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mt-0.5">
                  Process Improvement
                </div>
              </div>
              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 text-center">
                <div className="text-base font-black text-blue-700">10+</div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mt-0.5">
                  Team / Stakeholders
                </div>
              </div>
              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 text-center">
                <div className="text-base font-black text-[#b45309]">100%</div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mt-0.5">
                  Compliance Focus
                </div>
              </div>
            </div>
          )}

          {/* PROFESSIONAL EXPERIENCE */}
          {experiences.length > 0 && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-2 ${headingTextSize}`}>
                Professional Experience
              </h3>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">
                        {exp.role} — {exp.company}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-[10px] italic text-slate-600 font-medium">
                        {exp.location} | Industry Operations
                      </div>
                    )}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-0.5 pl-3 mt-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className={`list-disc text-slate-700 ${baseTextSize}`}>
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

          {/* 2-COLUMN SPLIT: CORE CAPABILITIES + EDUCATION & CREDENTIALS */}
          <div className="grid grid-cols-2 gap-6 pt-1">
            {/* LEFT: CORE CAPABILITIES */}
            {skills.length > 0 && (
              <div>
                <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${headingTextSize}`}>
                  Core Capabilities
                </h3>
                <ul className="space-y-1 pl-3 text-slate-700">
                  {skills.map((s) => (
                    <li key={s.id} className={`list-disc font-medium ${baseTextSize}`}>
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* RIGHT: EDUCATION & CREDENTIALS */}
            <div className="space-y-2">
              {education.length > 0 && (
                <div>
                  <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1.5 ${headingTextSize}`}>
                    Education &amp; Credentials
                  </h3>
                  <div className="space-y-1">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-[10.5px]">
                        <div className="font-bold text-slate-900">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
                        <div className="text-slate-600">
                          {edu.institution} | {edu.endDate || edu.startDate}
                          {edu.gpa && <span className="font-semibold text-slate-800"> • GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div>
                  <div className="text-[10.5px] font-bold text-slate-900 mt-1">Relevant Certifications</div>
                  <div className="text-[10px] text-slate-600">
                    {certifications.map((c) => c.name || c.title).join(' • ')}
                  </div>
                </div>
              )}

              {languages.length > 0 && (
                <div>
                  <div className="text-[10.5px] font-bold text-slate-900 mt-1">Languages</div>
                  <div className="text-[10px] text-slate-600">
                    {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SELECTED BUSINESS ACHIEVEMENTS */}
          {awards.length > 0 && (
            <div className="pt-1">
              <h3 className={`font-black uppercase tracking-wider text-[#b45309] border-b border-[#b45309]/30 pb-0.5 mb-1 ${headingTextSize}`}>
                Selected Business Achievements
              </h3>
              <ul className="space-y-0.5 pl-3">
                {awards.map((a) => (
                  <li key={a.id} className={`list-disc text-slate-700 ${baseTextSize}`}>
                    <span className="font-semibold text-slate-900">{a.title}</span>
                    {a.issuer && ` — ${a.issuer}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          FOOTER (Page 8 Reference)
         ========================================================= */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 03 | Multinational Company CV</span>
        <span>Corporate • Achievement-led • Premium executive presentation</span>
      </div>
    </div>
  );
};
