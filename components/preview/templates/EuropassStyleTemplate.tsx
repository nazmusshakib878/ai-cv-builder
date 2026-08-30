'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const EuropassStyleTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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

  const hasPhoto = Boolean(personalInfo.photoUrl);

  return (
    <div
      className={`bg-white text-slate-800 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            TOP BANNER (Page 5 Reference)
           ========================================================= */}
        <div className={`bg-[#0284c7] text-white px-8 ${metrics.headerPadding} flex items-center justify-between shrink-0`}>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-wider uppercase text-white">
              Europass / Italy &amp; EURES
            </h1>
            <p className="text-[10px] text-sky-100 font-medium">
              Recommended for Italy • EURES cross-border applications • EU/EEA jobs that request Europass format
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-sky-900/60 text-white border border-sky-400/40">
            European Style
          </span>
        </div>

        {/* =========================================================
            2-COLUMN BODY (Left Sidebar 30% + Right Main 70%) with Smart Vertical Balancing
           ========================================================= */}
        <div className="flex-1 flex min-h-0">
          {/* LEFT SIDEBAR (~30%) */}
          <div className={`w-[30%] bg-[#f0f9ff]/70 border-r border-sky-100 p-5 sm:p-6 flex flex-col ${metrics.distributeFlex} text-slate-700 shrink-0`}>
            <div className={metrics.sidebarSpacing}>
              {hasPhoto && (
                <div className="w-20 h-24 rounded border-2 border-sky-300 overflow-hidden shadow-xs shrink-0 bg-slate-100 mx-auto">
                  <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                </div>
              )}

              {/* PERSONAL */}
              <div className="space-y-1.5">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5">
                  PERSONAL
                </h2>
                <div className="text-[10px] space-y-1">
                  {personalInfo.location && <div>{personalInfo.location}</div>}
                  {personalInfo.phone && <div>{personalInfo.phone}</div>}
                  {personalInfo.email && <div className="font-semibold text-slate-900 break-all">{personalInfo.email}</div>}
                  {personalInfo.linkedin && (
                    <div className="text-[#0284c7] font-medium break-all">{personalInfo.linkedin}</div>
                  )}
                </div>
              </div>

              {/* LANGUAGES */}
              {languages.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-[11px] font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5">
                    LANGUAGES
                  </h2>
                  <div className="text-[10px] space-y-1">
                    {languages.map((l) => (
                      <div key={l.id}>
                        <div className="font-bold text-slate-900">{l.language}</div>
                        <div className="text-slate-500 text-[9.5px]">{l.proficiency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DIGITAL & JOB SKILLS */}
              {skills.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-[11px] font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5">
                    DIGITAL SKILLS
                  </h2>
                  <ul className="text-[10px] space-y-0.5 text-slate-700">
                    {skills.map((s) => (
                      <li key={s.id} className="flex items-start gap-1">
                        <span className="text-[#0284c7] font-bold">•</span>
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT MAIN CONTENT (~70%) */}
          <div className={`flex-1 ${metrics.contentPadding} flex flex-col ${metrics.distributeFlex} text-slate-800`}>
            {/* Header: Full Name & Target Role */}
            <div className="border-b border-sky-100 pb-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f172a]">
                {personalInfo.fullName || 'YOUR FULL NAME'}
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#0284c7] mt-0.5">
                {personalInfo.jobTitle || 'TARGET ROLE / PROFESSION'}
              </p>
            </div>

            <div className={`flex-1 flex flex-col ${metrics.distributeFlex} ${metrics.sectionSpacing}`}>
              {/* WORK EXPERIENCE */}
              {experiences.length > 0 && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                    WORK EXPERIENCE
                  </h2>
                  <div className={metrics.itemSpacing}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-0.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-900 text-[11.5px]">{exp.role}</span>
                          <span className="text-[10px] font-semibold text-slate-600">
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-sky-800 font-medium">
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

              {/* EDUCATION AND TRAINING */}
              {education.length > 0 && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                    EDUCATION AND TRAINING
                  </h2>
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
                          {edu.gpa && <div className="text-[#0284c7] font-bold">EQF / CGPA: {edu.gpa}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTIFICATIONS */}
              {certifications.length > 0 && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                    CERTIFICATIONS &amp; DIPLOMAS
                  </h2>
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

              {/* REFERENCES */}
              <div>
                <h2 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
                  REFERENCES
                </h2>
                <p className={`text-slate-600 italic ${metrics.baseTextSize}`}>Available upon request</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
           ========================================================= */}
        <div className="border-t border-slate-200 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
          <span>Europass Curriculum Vitae • Standard European Union Model</span>
          <span>EURES Compliant</span>
        </div>
      </div>
    </div>
  );
};
