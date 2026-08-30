import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code,
  FolderGit2,
  Award,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SectionEditor: React.FC = () => {
  const { resumeData, updateResumeData, sendMessage } = useResume();
  const [openSection, setOpenSection] = useState<string>('personal');

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? '' : section));
  };

  // Personal Info Handlers
  const handlePersonalInfoChange = (field: string, value: string) => {
    updateResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Experience Handlers
  const handleAddExperience = () => {
    const newExp = {
      id: 'exp-' + Date.now(),
      company: 'New Company Inc.',
      role: 'Software Engineer',
      location: 'Remote',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: ['Led development of key features resulting in 20% performance improvement.'],
    };
    updateResumeData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  };

  const handleRemoveExperience = (id: string) => {
    updateResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const handleExperienceChange = (id: string, field: string, value: any) => {
    updateResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const handleBulletChange = (expId: string, bulletIdx: number, value: string) => {
    updateResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => {
        if (e.id === expId) {
          const newBullets = [...e.bullets];
          newBullets[bulletIdx] = value;
          return { ...e, bullets: newBullets };
        }
        return e;
      }),
    }));
  };

  const handleAddBullet = (expId: string) => {
    updateResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => {
        if (e.id === expId) {
          return { ...e, bullets: [...e.bullets, 'Quantifiable business achievement or key milestone delivered.'] };
        }
        return e;
      }),
    }));
  };

  const handleRemoveBullet = (expId: string, bulletIdx: number) => {
    updateResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => {
        if (e.id === expId) {
          return { ...e, bullets: e.bullets.filter((_, idx) => idx !== bulletIdx) };
        }
        return e;
      }),
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 overflow-y-auto p-4 space-y-3">
      {/* 1. Personal Information Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
              <p className="text-[11px] text-slate-500">Contact details, name, and headline</p>
            </div>
          </div>
          {openSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'personal' && (
          <div className="p-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Job Title / Headline</label>
              <input
                type="text"
                value={resumeData.personalInfo.jobTitle}
                onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={resumeData.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={resumeData.personalInfo.linkedin || ''}
                onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Executive Summary Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Professional Summary</h3>
              <p className="text-[11px] text-slate-500">Executive pitch and career overview</p>
            </div>
          </div>
          {openSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'summary' && (
          <div className="p-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-700">Summary Copy</label>
              <button
                type="button"
                onClick={() => sendMessage('Improve my professional summary to be more punchy and metrics-driven.')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded transition-colors"
              >
                <Wand2 className="w-3 h-3" />
                <span>AI Enhance</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={resumeData.personalInfo.summary}
              onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-xs leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* 3. Work Experience Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Work Experience ({resumeData.experiences.length})</h3>
              <p className="text-[11px] text-slate-500">Roles, companies, accomplishments</p>
            </div>
          </div>
          {openSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'experience' && (
          <div className="p-4 border-t border-slate-100 space-y-4">
            {resumeData.experiences.map((exp, idx) => (
              <div key={exp.id} className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/70 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Position #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Role Title"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Date (e.g. Jan 2022)"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="End Date or Present"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>

                {/* Bullets List */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-medium text-slate-700 block">Achievement Bullets</label>
                  {exp.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5">
                      <textarea
                        rows={2}
                        value={b}
                        onChange={(e) => handleBulletChange(exp.id, bIdx, e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-xs"
                      />
                      <button
                        onClick={() => handleRemoveBullet(exp.id, bIdx)}
                        className="p-1 text-slate-400 hover:text-rose-600 mt-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddBullet(exp.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium pt-1"
                  >
                    <Plus className="w-3 h-3" /> Add Achievement Bullet
                  </button>
                </div>
              </div>
            ))}

            <Button size="sm" variant="secondary" onClick={handleAddExperience} icon={<Plus className="w-3.5 h-3.5" />} className="w-full">
              Add New Position
            </Button>
          </div>
        )}
      </div>

      {/* 4. Education & Skills Quick Access */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Skills & Tech Stack ({resumeData.skills.length})</h3>
              <p className="text-[11px] text-slate-500">Core competencies and platforms</p>
            </div>
          </div>
          {openSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'skills' && (
          <div className="p-4 border-t border-slate-100 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {resumeData.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200 flex items-center gap-1"
                >
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
