'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const GermanLebenslaufTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
            HEADER (Page 3 Reference)
           ========================================================= */}
        <div className="p-8 pb-4 flex items-start justify-between border-b border-slate-300 shrink-0">
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
            TABULAR REVERSE-CHRONOLOGICAL BODY
           ========================================================= */}
        <div className={`p-8 pt-4 ${sectionSpacing} flex-1`}>
          {/* PROFILE / SUMMARY */}
          {personalInfo.summary && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5 ${headingTextSize}`}>
                PROFIL / PROFILE
              </h2>
              <p className={`text-slate-700 leading-relaxed text-justify ${baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* BERUFSERFAHRUNG / PROFESSIONAL EXPERIENCE */}
          {experiences.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-2 ${headingTextSize}`}>
                BERUFSERFAHRUNG / PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-[110px_1fr] gap-4 items-start">
                    {/* Left: Date column */}
                    <div className="text-[10.5px] font-semibold text-slate-600 whitespace-nowrap pt-0.5">
                      {exp.startDate} – {exp.current ? 'heute' : exp.endDate}
                    </div>

                    {/* Right: Job & Details */}
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-[11px]">{exp.role}</div>
                      <div className="text-[10.5px] text-slate-600 italic">
                        {exp.company}{exp.location ? `, ${exp.location}` : ''}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUSBILDUNG / EDUCATION */}
          {education.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5 ${headingTextSize}`}>
                AUSBILDUNG / EDUCATION
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="grid grid-cols-[110px_1fr] gap-4 items-start">
                    {/* Left: Date */}
                    <div className="text-[10.5px] font-semibold text-slate-600 pt-0.5">
                      {edu.startDate} – {edu.endDate || 'Abschluss'}
                    </div>

                    {/* Right: Degree & Institution */}
                    <div className="text-[10.5px]">
                      <div className="font-bold text-slate-900">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                      </div>
                      <div className="text-slate-600">
                        {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                        {edu.gpa && <span className="font-semibold text-slate-800"> (Note/GPA: {edu.gpa})</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KENNTNISSE / SKILLS & SPRACHEN */}
          <div className="space-y-2">
            <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5 ${headingTextSize}`}>
              KENNTNISSE / SKILLS
            </h2>

            {skills.length > 0 && (
              <div>
                <div className="text-[10.5px] font-bold text-slate-900">Fachkompetenzen / Technical Skills</div>
                <div className="text-[10px] text-slate-700 mt-0.5">
                  {skills.map((s) => s.name).join(' • ')}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div className="pt-1">
                <div className="text-[10.5px] font-bold text-slate-900">Sprachen / Languages</div>
                <div className="text-[10px] text-slate-700 mt-0.5">
                  {languages.map((l) => `${l.language} - ${l.proficiency}`).join(' • ')}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="pt-1">
                <div className="text-[10.5px] font-bold text-slate-900">Zertifikate / Certifications</div>
                <div className="text-[10px] text-slate-700 mt-0.5">
                  {certifications.map((c) => c.name || c.title).join(' • ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 03 | German-Speaking Lebenslauf</span>
        <span>Tabular, reverse chronological and concise • DACH Standard</span>
      </div>
    </div>
  );
};
