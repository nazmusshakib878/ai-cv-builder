'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const AustraliaNZTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
            BODY
           ========================================================= */}
        <div className={`p-8 pt-4 ${sectionSpacing} flex-1`}>
          {/* 2-COLUMN SPLIT: CAREER PROFILE (60%) + KEY STRENGTHS (40%) */}
          <div className="grid grid-cols-[60%_40%] gap-6 pb-2 border-b border-slate-200">
            {/* Left: Career Profile */}
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] mb-1.5 ${headingTextSize}`}>
                CAREER PROFILE
              </h2>
              <p className={`text-slate-700 leading-relaxed text-justify ${baseTextSize}`}>
                {personalInfo.summary || 'Experienced professional with a practical approach to teamwork, compliance and continuous improvement.'}
              </p>
            </div>

            {/* Right: Key Strengths */}
            {skills.length > 0 && (
              <div className="border-l border-slate-200 pl-4">
                <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] mb-1.5 ${headingTextSize}`}>
                  KEY STRENGTHS
                </h2>
                <ul className="space-y-1 text-slate-700">
                  {skills.slice(0, 6).map((s) => (
                    <li key={s.id} className={`list-disc ml-3 font-medium ${baseTextSize}`}>
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
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-2 ${headingTextSize}`}>
                EMPLOYMENT HISTORY
              </h2>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900 text-[11px]">{exp.role}</span>
                      <span className="text-[10px] font-semibold text-slate-600">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-600 font-medium">
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
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

          {/* QUALIFICATIONS & TRAINING */}
          {(education.length > 0 || certifications.length > 0) && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-1.5 ${headingTextSize}`}>
                QUALIFICATIONS &amp; TRAINING
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <span className="font-bold text-slate-900">{edu.degree} {edu.field ? `- ${edu.field}` : ''}</span>
                    <span className="text-slate-600"> — {edu.institution}, {edu.endDate || edu.startDate}</span>
                    {edu.gpa && <span className="font-semibold text-slate-800"> (GPA: {edu.gpa})</span>}
                  </div>
                ))}

                {certifications.length > 0 && (
                  <div className="text-slate-700">
                    {certifications.map((c) => c.name || c.title).join(' • ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-1 ${headingTextSize}`}>
                LANGUAGES
              </h2>
              <p className={`text-slate-700 ${baseTextSize}`}>
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
              </p>
            </div>
          )}

          {/* REFEREES */}
          <div>
            <h2 className={`font-black uppercase tracking-wider text-[#1e3a8a] border-b border-slate-300 pb-0.5 mb-1 ${headingTextSize}`}>
              REFEREES
            </h2>
            <p className={`text-slate-600 italic ${baseTextSize}`}>
              Available on request (or include referee details when the job advertisement asks for them).
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 04 | Australia / New Zealand Resume</span>
        <span>Simple, readable and achievement-focused • No image</span>
      </div>
    </div>
  );
};
