export type TemplateType =
  | 'national-pro'
  | 'international-pro'
  | 'global-ats'
  | 'nordic-europe'
  | 'german-lebenslauf'
  | 'australia-nz'
  | 'europass-style'
  | 'multinational-corp'
  // Legacy aliases for backward compatibility
  | 'ats-classic'
  | 'modern-pro'
  | 'minimal'
  | 'corporate'
  | 'executive'
  | 'healthcare';

export type FontFamilyType = 'inter' | 'jakarta' | 'merriweather' | 'playfair' | 'mono';
export type FontSizeType = 'sm' | 'base' | 'lg';
export type SpacingType = 'compact' | 'normal' | 'relaxed';
export type BulletStyleType = 'bullet' | 'dash' | 'square' | 'accent-dot';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Technical' | 'Leadership & Strategy' | 'Tools & Platforms' | 'Specialized';
  level?: number; // 1 to 5
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  link?: string;
  github?: string;
  bullets: string[];
  techStack: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  title?: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational';
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  awards: AwardItem[];
}

export interface DesignConfig {
  template: TemplateType;
  fontFamily: FontFamilyType;
  fontSize: FontSizeType;
  lineSpacing: SpacingType;
  sectionSpacing: SpacingType;
  accentColor: string;
  onePageMode: boolean;
  showDividers: boolean;
  bulletStyle: BulletStyleType;
  sectionOrder: string[];
}

export interface AIDiffPreview {
  type: 'summary' | 'experience' | 'skills' | 'layout' | 'ats-optimize' | 'one-page' | 'full-rewrite';
  title: string;
  description: string;
  changesSummary: string[];
  applied?: boolean;
  modifiedData?: Partial<ResumeData>;
  modifiedDesign?: Partial<DesignConfig>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  diffPreview?: AIDiffPreview;
  isStreaming?: boolean;
}

export interface ATSScoreBreakdown {
  overallScore: number;
  keywordMatchScore: number;
  formattingScore: number;
  quantifiableImpactScore: number;
  brevityScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: {
    id: string;
    type: 'critical' | 'improvement' | 'strength';
    title: string;
    description: string;
  }[];
}
