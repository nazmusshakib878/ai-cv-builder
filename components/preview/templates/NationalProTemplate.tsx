'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const NationalProTemplate: React.FC<TemplateProps> = ({ data, design }) => {
  const {
    personalInfo = { fullName: '', jobTitle: '', email: '', phone: '', location: '', summary: '' },
    experiences = [],
    education = [],
    skills = [],
    projects = [],
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
            TOP HEADER BANNER
           ========================================================= */}
        <div className={`bg-[#0f172a] text-white ${metrics.headerPadding} flex items-center justify-between shrink-0`}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white">
              National Professional CV
            </h1>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              Recommended for Bangladesh-based companies, hospitals, NGOs and local corporate employers
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-[#1e293b] text-blue-300 border border-slate-700">
                Bangladesh
              </span>
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-[#1e293b] text-slate-300 border border-slate-700">
                Local Corporate
              </span>
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-[#1e293b] text-slate-300 border border-slate-700">
                NGO
              </span>
              <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-[#1e293b] text-slate-300 border border-slate-700">
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
          <div className="w-[32%] bg-[#f8fafc] border-r border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between text-slate-700 shrink-0">
            <div className={metrics.sidebarSpacing}>
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

              {/* CORE SKILLS - Balanced Grid Layout */}
              {skills.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-[11.5px] font-black uppercase tracking-wider text-[#0f172a] border-b border-slate-300 pb-1">
                    Core Skills
                  </h2>
                  <div
                    className={
                      skills.length > 8
                        ? 'grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-700'
                        : 'space-y-1.5 text-[10.5px] text-slate-700'
                    }
                  >
                    {skills.map((s) => (
                      <div key={s.id} className="flex items-start gap-1 truncate" title={s.name}>
                        <span className="text-blue-600 font-bold text-[9px]">•</span>
                        <span className="truncate">{s.name}</span>
                      </div>
                    ))}
                  </div>
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
          </div>

          {/* RIGHT MAIN CONTENT (~68%) - Vertically Balanced Across A4 Canvas */}
          <div className={`flex-1 ${metrics.contentPadding} flex flex-col justify-between text-slate-800`}>
            {/* Header: Full Name & Job Title */}
            <div className="border-b border-slate-200 pb-3 mb-2 shrink-0">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f172a]">
                {personalInfo.fullName || 'YOUR FULL NAME'}
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#0c8ee9] mt-0.5">
                {personalInfo.jobTitle || 'Professional Job Title'}
              </p>
            </div>

            {/* SECTIONS CONTAINER: Stretched naturally from top to bottom */}
            <div className="flex-1 flex flex-col justify-between py-1">
              {/* CAREER SUMMARY */}
              {personalInfo.summary && (
                <div className="mb-2">
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                    Career Summary
                  </h2>
                  <p className={`text-slate-700 leading-relaxed text-justify ${metrics.baseTextSize}`}>
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* PROFESSIONAL EXPERIENCE */}
              {experiences.length > 0 && (
                <div className="mb-2">
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                    Professional Experience
                  </h2>
                  <div className={metrics.itemSpacing}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-900 text-[11.5px]">{exp.role}</span>
                          <span className="text-[10px] font-semibold text-slate-600">
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <div className="text-[10.5px] italic text-slate-600 font-medium">
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

              {/* EDUCATION */}
              {education.length > 0 && (
                <div className="mb-2">
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                    Education
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
                          {edu.gpa && <div className="text-blue-700 font-bold">CGPA: {edu.gpa}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTIFICATIONS & TRAINING */}
              {certifications.length > 0 && (
                <div className="mb-2">
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
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
                <div className="mb-2">
                  <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                    Selected Achievements
                  </h2>
                  <ul className="space-y-1 pl-3">
                    {awards.map((a) => (
                      <li key={a.id} className={`list-disc text-slate-700 ${metrics.baseTextSize}`}>
                        <span className="font-semibold text-slate-900">{a.title}</span>
                        {a.issuer && ` — ${a.issuer}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* REFERENCES - Anchored at the bottom */}
              <div className="pt-1">
                <h2 className={`font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-slate-800 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
                  References
                </h2>
                <p className={`text-slate-600 italic ${metrics.baseTextSize}`}>Available upon request</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FOOTER
         ========================================================= */}
      <div className="border-t border-slate-200/80 px-8 py-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0 bg-white">
        <span>DESIGN 01 | National Professional CV</span>
        <span>Clean corporate format • Photo optional for local applications</span>
      </div>
    </div>
  );
};
