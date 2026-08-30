import { ResumeData, SkillItem, LanguageItem } from '@/types/resume';

export type SkillCategory = 'Technical' | 'Leadership & Strategy' | 'Tools & Platforms' | 'Specialized';
export type LanguageProficiency = 'Native' | 'Fluent' | 'Professional' | 'Conversational';

export function normalizeSkillCategory(category?: string | null): SkillCategory {
  if (!category || typeof category !== 'string') return 'Technical';
  const c = category.toLowerCase().trim();

  if (
    c === 'leadership & strategy' ||
    c.includes('lead') ||
    c.includes('strat') ||
    c.includes('manage') ||
    c.includes('soft') ||
    c.includes('core')
  ) {
    return 'Leadership & Strategy';
  }

  if (
    c === 'tools & platforms' ||
    c.includes('tool') ||
    c.includes('plat') ||
    c.includes('software') ||
    c.includes('cloud') ||
    c.includes('infra') ||
    c.includes('office')
  ) {
    return 'Tools & Platforms';
  }

  if (
    c === 'specialized' ||
    c.includes('spec') ||
    c.includes('domain') ||
    c.includes('industry') ||
    c.includes('method') ||
    c.includes('compliance')
  ) {
    return 'Specialized';
  }

  return 'Technical';
}

export function normalizeLanguageProficiency(proficiency?: string | null): LanguageProficiency {
  if (!proficiency || typeof proficiency !== 'string') return 'Professional';
  const p = proficiency.toLowerCase().trim();

  if (p === 'native' || p.includes('native') || p.includes('mother') || p.includes('bilingual') || p.includes('মাতৃভাষা')) {
    return 'Native';
  }

  if (
    p === 'fluent' ||
    p.includes('fluent') ||
    p.includes('advanced') ||
    p.includes('high') ||
    p.includes('c2') ||
    p.includes('c1') ||
    p.includes('দক্ষ')
  ) {
    return 'Fluent';
  }

  if (
    p === 'conversational' ||
    p.includes('conversat') ||
    p.includes('intermediate') ||
    p.includes('basic') ||
    p.includes('medium') ||
    p.includes('b1') ||
    p.includes('a2') ||
    p.includes('a1') ||
    p.includes('প্রাথমিক')
  ) {
    return 'Conversational';
  }

  return 'Professional';
}

/**
 * Cleanly normalizes all skill and language types in partial or full ResumeData
 */
export function normalizeResumeData(data: Partial<ResumeData>): Partial<ResumeData> {
  const result = { ...data };

  if (result.skills && Array.isArray(result.skills)) {
    result.skills = result.skills.map((s, idx) => ({
      id: s.id || `sk-${idx + 1}`,
      name: s.name || 'Professional Skill',
      category: normalizeSkillCategory(s.category),
      level: typeof s.level === 'number' ? s.level : undefined,
    }));
  }

  if (result.languages && Array.isArray(result.languages)) {
    result.languages = result.languages.map((l, idx) => ({
      id: l.id || `lang-${idx + 1}`,
      language: l.language || 'English',
      proficiency: normalizeLanguageProficiency(l.proficiency),
    }));
  }

  return result;
}
