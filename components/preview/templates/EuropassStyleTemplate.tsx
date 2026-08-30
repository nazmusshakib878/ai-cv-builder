'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const EuropassStyleTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
        <div className="bg-[#0284c7] text-white px-8 py-3.5 flex items-center justify-between shrink-0">
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
            2-COLUMN BODY (Left Sidebar 30% + Right Main 70%)
           ========================================================= */}
        <div className="flex-1 flex min-h-0">
          {/* LEFT SIDEBAR (~30%) */}
          <div className="w-[30%] bg-[#f0f9ff]/70 border-r border-sky-100 p-5 sm:p-6 space-y-4 text-slate-700 shrink-0">
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

            {/* DIGITAL SKILLS */}
            {skills.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#0284c7] border-b border-sky-200 pb-0.5">
                  DIGITAL SKILLS
                </h2>
                <ul className="text-[10px] space-y-1 text-slate-700">
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

          {/* RIGHT MAIN CONTENT (~70%) */}
          <div className={`flex-1 p-6 sm:p-7 ${sectionSpacing}`}>
            {/* Header: Name & Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                {personalInfo.fullName || 'ALEX MORGAN'}
              </h2>
              <p className="text-sm font-bold text-[#0284c7] mt-0.5">
                {personalInfo.jobTitle || 'Operations & Quality Professional'}
              </p>
            </div>

            {/* ABOUT ME */}
            {personalInfo.summary && (
              <div>
                <h3 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-slate-200 pb-0.5 mb-1.5 ${headingTextSize}`}>
                  ABOUT ME
                </h3>
                <p className={`text-slate-700 leading-relaxed text-justify ${baseTextSize}`}>
                  {personalInfo.summary}
                </p>
              </div>
            )}

            {/* WORK EXPERIENCE */}
            {experiences.length > 0 && (
              <div>
                <h3 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-slate-200 pb-0.5 mb-2 ${headingTextSize}`}>
                  WORK EXPERIENCE
                </h3>
                <div className="space-y-2.5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="text-[10px] font-semibold text-slate-500">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </div>
                      <div className="font-bold text-slate-900 text-[11px]">
                        {exp.role} <span className="font-normal text-slate-600">| {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-0.5 pl-3 mt-1">
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

            {/* EDUCATION & TRAINING */}
            {education.length > 0 && (
              <div>
                <h3 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-slate-200 pb-0.5 mb-1.5 ${headingTextSize}`}>
                  EDUCATION &amp; TRAINING
                </h3>
                <div className="space-y-1.5 text-[10.5px]">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="font-semibold text-slate-500 text-[10px]">
                        {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate || 'Present'}
                      </div>
                      <div className="font-bold text-slate-900">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                      </div>
                      <div className="text-slate-600">
                        {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                        {edu.gpa && <span className="font-semibold text-slate-800"> • GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADDITIONAL INFORMATION */}
            {certifications.length > 0 && (
              <div>
                <h3 className={`font-black uppercase tracking-wider text-[#0284c7] border-b border-slate-200 pb-0.5 mb-1 ${headingTextSize}`}>
                  ADDITIONAL INFORMATION
                </h3>
                <p className={`text-slate-700 ${baseTextSize}`}>
                  {certifications.map((c) => c.name || c.title).join(' • ')} • Work authorisation / relocation details when relevant
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 05 | Europass / Italy &amp; EURES Style</span>
        <span>European structured layout • Cross-border application format</span>
      </div>
    </div>
  );
};
