'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const GermanLebenslaufTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
            HEADER
           ========================================================= */}
        <div className={`p-8 pb-4 flex items-start justify-between border-b border-slate-300 shrink-0`}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              {personalInfo.fullName || 'ALEX MORGAN'}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-600 tracking-wider uppercase mt-0.5">
              {personalInfo.jobTitle || 'QUALITY & OPERATIONS PROFESSIONAL'}
            </p>
            <div className="text-[10.5px] text-slate-600 mt-2 flex flex-wrap items-center gap-2">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && <span>| {personalInfo.phone}</span>}
              {personalInfo.email && <span>| {personalInfo.email}</span>}
              {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
            </div>
          </div>

          {/* Optional Professional Photo Box */}
          {hasPhoto ? (
            <div className="w-20 h-24 rounded border border-slate-300 overflow-hidden shadow-xs shrink-0 bg-slate-100 ml-4">
              <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-24 rounded border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[10px] uppercase font-bold shrink-0 ml-4 bg-slate-50">
              <span>PHOTO</span>
              <span className="text-[8px] font-normal text-slate-400">optional</span>
            </div>
          )}
        </div>

        {/* =========================================================
            TABULAR REVERSE-CHRONOLOGICAL BODY (Smart Vertical Balancing)
           ========================================================= */}
        <div className={`${metrics.contentPadding} pt-4 flex-1 flex flex-col ${metrics.distributeFlex} ${metrics.sectionSpacing}`}>
          {/* PROFILE / SUMMARY */}
          {personalInfo.summary && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                PROFIL / PROFILE
              </h2>
              <p className={`text-slate-700 leading-relaxed text-justify ${metrics.baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* BERUFSERFAHRUNG / PROFESSIONAL EXPERIENCE */}
          {experiences.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                BERUFSERFAHRUNG / PROFESSIONAL EXPERIENCE
              </h2>
              <div className={metrics.itemSpacing}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-4 items-start">
                    {/* Left: Date column */}
                    <div className="text-[10.5px] font-semibold text-slate-600">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>

                    {/* Right: Role & Description */}
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-[11px]">
                        {exp.role}, <span className="font-semibold text-slate-700">{exp.company}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 italic">
                        {exp.location || 'Dhaka, Bangladesh'}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUSBILDUNG / EDUCATION */}
          {education.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                AUSBILDUNG / EDUCATION
              </h2>
              <div className={metrics.itemSpacing}>
                {education.map((edu) => (
                  <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-4 items-start text-[11px]">
                    <div className="text-[10.5px] font-semibold text-slate-600">
                      {edu.startDate ? `${edu.startDate} – ${edu.endDate || 'Present'}` : edu.endDate}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {edu.institution} {edu.location && `| ${edu.location}`}
                        {edu.gpa && <span className="font-semibold text-slate-800"> (Note: {edu.gpa})</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUALIFIKATIONEN / SKILLS */}
          {skills.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                KENNTNISSE &amp; FÄHIGKEITEN / SKILLS
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10.5px] text-slate-700">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPRACHEN / LANGUAGES */}
          {languages.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                SPRACHEN / LANGUAGES
              </h2>
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

          {/* REFERENZEN / REFERENCES */}
          <div>
            <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
              REFERENZEN / REFERENCES
            </h2>
            <p className={`text-slate-600 italic ${metrics.baseTextSize}`}>Auf Anfrage / Available upon request</p>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
           ========================================================= */}
        <div className="px-8 py-3 bg-[#f8fafc] border-t border-slate-200 text-center text-[10px] text-slate-500 shrink-0">
          Lebenslauf Standard Format • DIN A4 • DACH-Region Compatible
        </div>
      </div>
    </div>
  );
};
