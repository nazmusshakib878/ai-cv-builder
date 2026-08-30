'use client';

import React from 'react';
import { ResumeData, DesignConfig } from '@/types/resume';
import { computeSmartVerticalSpacing } from '@/utils/verticalSpacing';

interface TemplateProps {
  data: ResumeData;
  design: DesignConfig;
}

export const NordicEuropeTemplate: React.FC<TemplateProps> = ({ data, design }) => {
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
        <div className={`p-8 pb-4 flex items-start justify-between border-b border-slate-300 shrink-0`}>
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
            MAIN BODY (with Smart Vertical Balancing)
           ========================================================= */}
        <div className={`${metrics.contentPadding} pt-4 flex-1 flex flex-col ${metrics.distributeFlex} ${metrics.sectionSpacing}`}>
          {/* PROFILE */}
          {personalInfo.summary && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                PROFILE
              </h2>
              <p className={`text-slate-700 leading-relaxed text-justify ${metrics.baseTextSize}`}>
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
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-900">MANAGEMENT &amp; TOOLS</div>
                <div className="text-[9.5px] text-slate-600 mt-1 truncate">
                  {skillChunk3.map((s) => s.name).join(' • ') || 'Leadership • Continuous Improvement'}
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {experiences.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 ${metrics.headingTextSize}`}>
                EXPERIENCE
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
                    <div className="text-[10.5px] text-slate-600 font-medium">
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
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                EDUCATION
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

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                COURSES &amp; CERTIFICATES
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

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div>
              <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 ${metrics.headingTextSize}`}>
                LANGUAGES
              </h2>
              <p className={`text-slate-800 font-medium ${metrics.baseTextSize}`}>
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
              </p>
            </div>
          )}

          {/* REFERENCES */}
          <div>
            <h2 className={`font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 ${metrics.headingTextSize}`}>
              REFERENCES
            </h2>
            <p className={`text-slate-600 italic ${metrics.baseTextSize}`}>Available upon request</p>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
           ========================================================= */}
        <div className="px-8 py-3 bg-[#f8fafc] border-t border-slate-200 text-center text-[10px] text-slate-500 shrink-0">
          Nordic Europe Standard • Scandinavian Layout Model • Transparent Format
        </div>
      </div>
    </div>
  );
};
