'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const NordicEuropeTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
    design.sectionSpacing === 'compact' || isOnePage ? 'space-y-2.5' : design.sectionSpacing === 'relaxed' ? 'space-y-4' : 'space-y-3';

  // Group skills into 3 clean Nordic competency cards
  const skillChunk1 = skills.slice(0, Math.ceil(skills.length / 3));
  const skillChunk2 = skills.slice(Math.ceil(skills.length / 3), Math.ceil((skills.length * 2) / 3));
  const skillChunk3 = skills.slice(Math.ceil((skills.length * 2) / 3));

  return (
    <div
      className={`bg-white text-slate-800 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            HEADER (Page 2 Reference)
           ========================================================= */}
        <div className="p-8 pb-4 flex items-start justify-between border-b border-slate-300 shrink-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              {personalInfo.fullName || 'ALEX MORGAN'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
              {personalInfo.jobTitle || 'Operations • Quality • Continuous Improvement'}
            </p>
          </div>

          <div className="text-right text-[10.5px] text-slate-600 space-y-0.5">
            <div className="text-[9px] uppercase font-bold text-slate-400">CONTACT</div>
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.email && <div className="font-semibold text-slate-800">{personalInfo.email}</div>}
            {personalInfo.linkedin && (
              <div className="text-blue-600 font-medium">{personalInfo.linkedin}</div>
            )}
          </div>
        </div>

        {/* =========================================================
            MAIN BODY
           ========================================================= */}
        <div className={`p-8 pt-4 ${sectionSpacing} flex-1`}>
          {/* PROFILE */}
          {personalInfo.summary && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${headingTextSize}`}>
                PROFILE
              </h2>
              <p className={`text-slate-700 leading-relaxed text-justify ${baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* 3-COLUMN BOXED COMPETENCY GROUPS */}
          {skills.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-[#f8fafc] text-center">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-900">QUALITY &amp; CORE</div>
                <div className="text-[9.5px] text-slate-600 mt-1 truncate">
                  {skillChunk1.map((s) => s.name).join(' • ') || 'Quality • Standards • Audits'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-[#f8fafc] text-center">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-900">OPERATIONS</div>
                <div className="text-[9.5px] text-slate-600 mt-1 truncate">
                  {skillChunk2.map((s) => s.name).join(' • ') || 'Planning • KPI • Execution'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-[#f8fafc] text-center">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-900">TEAM &amp; TOOLS</div>
                <div className="text-[9.5px] text-slate-600 mt-1 truncate">
                  {skillChunk3.map((s) => s.name).join(' • ') || 'Collaboration • Reporting'}
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {experiences.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 ${headingTextSize}`}>
                EXPERIENCE
              </h2>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-[11px]">
                      {exp.role} <span className="font-normal text-slate-500">| {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
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

          {/* EDUCATION & LANGUAGES */}
          {(education.length > 0 || languages.length > 0) && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${headingTextSize}`}>
                EDUCATION &amp; LANGUAGES
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <span className="font-bold text-slate-900">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</span>
                    <span className="text-slate-600"> — {edu.institution} ({edu.endDate || edu.startDate})</span>
                    {edu.gpa && <span className="font-semibold text-slate-800"> • GPA: {edu.gpa}</span>}
                  </div>
                ))}

                {languages.length > 0 && (
                  <div className="text-slate-700 pt-0.5">
                    {languages.map((l) => `${l.language} - ${l.proficiency}`).join(' • ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 ${headingTextSize}`}>
                CERTIFICATIONS
              </h2>
              <div className="text-[10.5px] text-slate-700">
                {certifications.map((c) => c.name || c.title).join(' • ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 02 | Western / Nordic Europe CV</span>
        <span>Clean modern CV • Nordic &amp; Western EU standard</span>
      </div>
    </div>
  );
};
