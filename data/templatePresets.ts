import { TemplateType } from '@/types/resume';

export interface TemplateMeta {
  id: TemplateType;
  name: string;
  category: 'National' | 'International' | 'ATS' | 'European' | 'Corporate';
  description: string;
  badge?: string;
  recommendedFor: string;
  thumbnailColor: string;
}

export const TEMPLATES_CONFIG: TemplateMeta[] = [
  {
    id: 'national-pro',
    name: 'National Professional',
    category: 'National',
    description: 'Full-width professional header with sidebar. Tailored for Bangladesh companies, hospitals, NGOs & local corporate employers.',
    badge: 'Bangladesh & Local',
    recommendedFor: 'Local Corporate, Hospitals, NGOs, Manufacturing, BD Enterprises',
    thumbnailColor: '#0f172a',
  },
  {
    id: 'international-pro',
    name: 'International Professional',
    category: 'International',
    description: 'Clean modern ATS-readable international layout with teal accents and structured competencies grid.',
    badge: 'Overseas & Remote',
    recommendedFor: 'International Employers, Overseas Relocation, Remote Global Roles',
    thumbnailColor: '#0f766e',
  },
  {
    id: 'global-ats',
    name: 'Global ATS',
    category: 'ATS',
    description: 'Single-column traditional layout engineered for 100% parser accuracy in North America, UK and Ireland.',
    badge: '99% ATS Pass Rate',
    recommendedFor: 'USA, Canada, UK, Ireland, High-Volume Corporate Portals',
    thumbnailColor: '#1e293b',
  },
  {
    id: 'nordic-europe',
    name: 'Western / Nordic Europe',
    category: 'European',
    description: 'Clean modern European design with 3-column competency groups and structured minimalist styling.',
    badge: 'Nordic & Western EU',
    recommendedFor: 'Netherlands, Sweden, Finland, Denmark, EU Startups',
    thumbnailColor: '#2563eb',
  },
  {
    id: 'german-lebenslauf',
    name: 'German Lebenslauf',
    category: 'European',
    description: 'Tabular reverse-chronological structure with clear date alignments and optional professional photo.',
    badge: 'DACH Region',
    recommendedFor: 'Germany, Austria, Switzerland, Engineering & Technical Roles',
    thumbnailColor: '#334155',
  },
  {
    id: 'australia-nz',
    name: 'Australia / NZ',
    category: 'International',
    description: 'Achievement-focused layout with side-by-side career profile and key strengths matrix.',
    badge: 'Australia & NZ',
    recommendedFor: 'Australia, New Zealand, Commonwealth Applications',
    thumbnailColor: '#1e3a8a',
  },
  {
    id: 'europass-style',
    name: 'Europass Style',
    category: 'European',
    description: 'Structured European layout with dedicated digital skills and language competency columns.',
    badge: 'EURES & Italy',
    recommendedFor: 'Italy, EU/EEA Cross-Border Applications, Academic Portals',
    thumbnailColor: '#0284c7',
  },
  {
    id: 'multinational-corp',
    name: 'Multinational Company',
    category: 'Corporate',
    description: 'Dark executive header with gold accents, core capabilities split and optional achievement metric cards.',
    badge: 'MNC & Executive',
    recommendedFor: 'MNCs, Regional Headquarters, Executive Leadership, Consulting',
    thumbnailColor: '#b45309',
  },
];

export const ACCENT_COLORS = [
  { name: 'Midnight Slate', hex: '#0f172a', bgClass: 'bg-[#0f172a]' },
  { name: 'Corporate Blue', hex: '#2563eb', bgClass: 'bg-[#2563eb]' },
  { name: 'Emerald Teal', hex: '#0f766e', bgClass: 'bg-[#0f766e]' },
  { name: 'Executive Gold', hex: '#b45309', bgClass: 'bg-[#b45309]' },
  { name: 'Deep Navy', hex: '#1e3a8a', bgClass: 'bg-[#1e3a8a]' },
  { name: 'Classic Charcoal', hex: '#334155', bgClass: 'bg-[#334155]' },
  { name: 'Royal Violet', hex: '#7c3aed', bgClass: 'bg-[#7c3aed]' },
  { name: 'Crimson Burgundy', hex: '#be123c', bgClass: 'bg-[#be123c]' },
];

export const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', familyClass: 'font-sans', description: 'Clean, modern standard ATS-friendly typography' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', familyClass: 'font-jakarta', description: 'Polished geometric corporate typography' },
  { id: 'merriweather', name: 'Merriweather', familyClass: 'font-serif', description: 'Editorial classic serif style' },
  { id: 'playfair', name: 'Playfair Display', familyClass: 'font-playfair', description: 'High-end luxury executive serif' },
  { id: 'mono', name: 'JetBrains / Geist Mono', familyClass: 'font-mono', description: 'Technical monospace' },
];
