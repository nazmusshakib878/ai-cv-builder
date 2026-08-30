'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const InternationalProTemplate: React.FC<TemplateProps> = ({ data, design }) => {
  const { personalInfo, experiences = [], education = [], skills = [], projects = [], certifications = [], languages = [], awards = [] } = data;
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

  const itemSpacing =
    design.lineSpacing === 'compact' || isOnePage ? 'space-y-1' : design.lineSpacing === 'relaxed' ? 'space-y-2' : 'space-y-1.5';

  return (
    <div
      className={`bg-white text-slate-800 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            TOP HEADER BANNER (Page 7 Reference)
           ========================================================= */}
        <div className="bg-white px-8 pt-6 pb-2 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-slate-900">
                International Professional CV
              </h1>
              <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                Recommended for overseas applications where a modern, no-photo, ATS-readable CV is appropriate
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-teal-800 text-teal-100">
                Overseas Jobs
              </span>
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-slate-700 text-slate-100">
                No Photo
              </span>
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-slate-700 text-slate-100">
                ATS-Readable
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            CANDIDATE HEADER
           ========================================================= */}
        <div className="px-8 pt-5 pb-3 flex items-start justify-between border-b border-slate-300 shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              {personalInfo.fullName || 'YOUR FULL NAME'}
            </h2>
            <p className="text-sm sm:text-base font-bold text-teal-700 mt-0.5">
              {personalInfo.jobTitle || 'Professional Title | Functional Specialization'}
            </p>
          </div>

          <div className="text-right text-[10.5px] text-slate-600 space-y-0.5">
            {personalInfo.email && <div className="font-semibold text-slate-900">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            <div>
              {personalInfo.location || 'Dhaka, Bangladesh'}
              {personalInfo.linkedin && (
                <span> | <span className="text-teal-700 font-medium">{personalInfo.linkedin}</span></span>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN CONTENT (Single-Column ATS Layout)
           ========================================================= */}
        <div className={`p-8 ${sectionSpacing} flex-1`}>
          {/* PROFESSIONAL SUMMARY */}
          {personalInfo.summary && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${headingTextSize}`}>
                Professional Summary
              </h3>
              <p className={`text-slate-700 leading-relaxed text-justify ${baseTextSize}`}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* KEY COMPETENCIES (3-Column Grid) */}
          {skills.length > 0 && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${headingTextSize}`}>
                Key Competencies
              </h3>
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[10.5px] text-slate-700">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-1.5 truncate">
                    <span className="text-teal-700 font-bold">•</span>
                    <span className="truncate font-medium">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFESSIONAL EXPERIENCE */}
          {experiences.length > 0 && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 ${headingTextSize}`}>
                Professional Experience
              </h3>
              <div className={itemSpacing}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900 text-[11px]">{exp.role}</span>
                      <span className="text-[10px] font-semibold text-slate-600">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium">
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

          {/* EDUCATION & CERTIFICATIONS */}
          {(education.length > 0 || certifications.length > 0) && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${headingTextSize}`}>
                Education &amp; Certifications
              </h3>
              <div className="space-y-1">
                {education.map((edu) => (
                  <div key={edu.id} className="flex items-baseline justify-between text-[10.5px]">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree} {edu.field ? `- ${edu.field}` : ''}</span>
                      <span className="text-slate-600">, {edu.institution}</span>
                      {edu.gpa && <span className="font-semibold text-teal-800"> (GPA: {edu.gpa})</span>}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">{edu.endDate || edu.startDate}</span>
                  </div>
                ))}

                {certifications.length > 0 && (
                  <div className="text-[10px] text-slate-700 pt-0.5">
                    {certifications.map((c) => c.name || c.title).join(' • ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LANGUAGES & ADDITIONAL INFORMATION */}
          {languages.length > 0 && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 ${headingTextSize}`}>
                Languages &amp; Additional Information
              </h3>
              <p className={`text-slate-700 ${baseTextSize}`}>
                {languages.map((l) => `${l.language} - ${l.proficiency}`).join(' | ')}
                <span> | Work authorization / relocation details available upon request</span>
              </p>
            </div>
          )}

          {/* SELECTED ACHIEVEMENTS */}
          {awards.length > 0 && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 ${headingTextSize}`}>
                Selected Achievements
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

          {/* DIGITAL / TECHNICAL SKILLS */}
          {skills.length > 0 && (
            <div>
              <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 ${headingTextSize}`}>
                Digital / Technical Skills
              </h3>
              <p className={`text-slate-700 ${baseTextSize}`}>
                {skills.map((s) => s.name).join(' | ')}
              </p>
            </div>
          )}

          {/* REFERENCES */}
          <div>
            <h3 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-0.5 ${headingTextSize}`}>
              References
            </h3>
            <p className={`text-slate-600 italic ${baseTextSize}`}>Available upon request</p>
          </div>
        </div>
      </div>

      {/* =========================================================
          FOOTER (Page 7 Reference)
         ========================================================= */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 02 | International Professional CV</span>
        <span>Modern • No photo • Easy to tailor by country and vacancy</span>
      </div>
    </div>
  );
};
