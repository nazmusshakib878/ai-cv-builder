'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const NationalProTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
    design.fontSize === 'sm' || isOnePage ? 'text-[10.5px] leading-[1.38]' : design.fontSize === 'lg' ? 'text-[12px] leading-[1.48]' : 'text-[11px] leading-[1.42]';

  const headingTextSize =
    design.fontSize === 'sm' || isOnePage ? 'text-[11.5px]' : design.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]';

  const sectionSpacing =
    design.sectionSpacing === 'compact' || isOnePage ? 'space-y-2.5' : design.sectionSpacing === 'relaxed' ? 'space-y-4' : 'space-y-3';

  const itemSpacing =
    design.lineSpacing === 'compact' || isOnePage ? 'space-y-1.5' : design.lineSpacing === 'relaxed' ? 'space-y-2.5' : 'space-y-2';

  const hasPhoto = Boolean(personalInfo.photoUrl);

  return (
    <div
      className={`bg-white text-slate-800 ${fontClass} flex flex-col justify-between`}
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            TOP HEADER BANNER (Page 6 Reference)
           ========================================================= */}
        <div className="bg-[#0f172a] text-white px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white">
              National Professional CV
            </h1>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              Recommended for Bangladesh-based companies, hospitals, NGOs and local corporate employers
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="px-3 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#1e293b] text-blue-300 border border-slate-700">
                Bangladesh
              </span>
              <span className="px-3 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#1e293b] text-slate-300 border border-slate-700">
                Local Corporate
              </span>
              <span className="px-3 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#1e293b] text-slate-300 border border-slate-700">
                NGO
              </span>
              <span className="px-3 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#1e293b] text-slate-300 border border-slate-700">
                Hospital
              </span>
            </div>
          </div>

          {/* Optional Photo Box */}
          {hasPhoto ? (
            <div className="w-20 h-24 rounded border-2 border-white/80 overflow-hidden shadow-sm shrink-0 bg-slate-800 ml-4">
              <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-24 rounded border border-dashed border-slate-500 flex flex-col items-center justify-center text-slate-400 text-[10px] uppercase font-bold shrink-0 ml-4 bg-slate-800/40">
              <span>Photo</span>
              <span className="text-[8px] font-normal text-slate-500">Optional</span>
            </div>
          )}
        </div>

        {/* =========================================================
            BODY: 2-COLUMN LAYOUT (Sidebar 32% + Main Content 68%)
           ========================================================= */}
        <div className="flex-1 flex min-h-0">
          {/* LEFT SIDEBAR (~32%) */}
          <div className="w-[32%] bg-[#f8fafc] border-r border-slate-200/80 p-5 sm:p-6 space-y-5 text-slate-700 shrink-0">
            {/* CONTACT */}
            <div className="space-y-2">
              <h2 className="text-[11.5px] font-black uppercase tracking-wider text-[#0f172a] border-b border-slate-300 pb-1">
                Contact
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {personalInfo.phone && (
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Phone</div>
                    <div className="font-semibold text-slate-800">{personalInfo.phone}</div>
                  </div>
                )}
                {personalInfo.email && (
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Email</div>
                    <div className="font-semibold text-slate-800 break-all">{personalInfo.email}</div>
                  </div>
                )}
                {personalInfo.location && (
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Location</div>
                    <div className="font-semibold text-slate-800">{personalInfo.location}</div>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">LinkedIn</div>
                    <div className="font-semibold text-blue-600 break-all">{personalInfo.linkedin}</div>
                  </div>
                )}
              </div>
            </div>

            {/* CORE SKILLS */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-[11.5px] font-black uppercase tracking-wider text-[#0f172a] border-b border-slate-300 pb-1">
                  Core Skills
                </h2>
                <ul className="space-y-1 text-[10.5px] text-slate-700">
                  {skills.map((s) => (
                    <li key={s.id} className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-[11.5px] font-black uppercase tracking-wider text-[#0f172a] border-b border-slate-300 pb-1">
                  Languages
                </h2>
                <div className="space-y-1 text-[10.5px]">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span className="font-semibold text-slate-800">{l.language}</span>
                      <span className="text-slate-500">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT MAIN CONTENT (~68%) */}
          <div className="flex-1 p-6 sm:p-7 space-y-4">
            {/* Header: Full Name & Job Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f172a]">
                {personalInfo.fullName || 'YOUR FULL NAME'}
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#0c8ee9] mt-0.5">
                {personalInfo.jobTitle || 'Professional Job Title'}
              </p>
            </div>

            <div className={sectionSpacing}>
              {/* CAREER SUMMARY */}
              {personalInfo.summary && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${headingTextSize}`}>
                    Career Summary
                  </h2>
                  <p className={`text-slate-700 leading-relaxed text-justify ${baseTextSize}`}>
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* PROFESSIONAL EXPERIENCE */}
              {experiences.length > 0 && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-2 ${headingTextSize}`}>
                    Professional Experience
                  </h2>
                  <div className={itemSpacing}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-900 text-[11.5px]">{exp.role}</span>
                          <span className="text-[10px] font-semibold text-slate-600">
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <div className="text-[10.5px] italic text-slate-600 font-medium">
                          {exp.company}{exp.location ? ` - ${exp.location}` : ''}
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

              {/* EDUCATION */}
              {education.length > 0 && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${headingTextSize}`}>
                    Education
                  </h2>
                  <div className={itemSpacing}>
                    {education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-900 text-[11px]">
                            {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600">
                            {edu.endDate || edu.startDate}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-600">
                          {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                          {edu.gpa && <span className="font-semibold text-slate-800"> • GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTIFICATIONS & TRAINING */}
              {certifications.length > 0 && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${headingTextSize}`}>
                    Certifications &amp; Training
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

              {/* SELECTED ACHIEVEMENTS */}
              {awards.length > 0 && (
                <div>
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${headingTextSize}`}>
                    Selected Achievements
                  </h2>
                  <ul className="space-y-1 pl-3">
                    {awards.map((a) => (
                      <li key={a.id} className={`list-disc text-slate-700 ${baseTextSize}`}>
                        <span className="font-semibold text-slate-900">{a.title}</span>
                        {a.issuer && ` — ${a.issuer}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* REFERENCES */}
              <div>
                <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1 ${headingTextSize}`}>
                  References
                </h2>
                <p className={`text-slate-600 italic ${baseTextSize}`}>Available upon request</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FOOTER (Page 6 Reference)
         ========================================================= */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 01 | National Professional CV</span>
        <span>Clean corporate format • Photo optional for local applications</span>
      </div>
    </div>
  );
};
