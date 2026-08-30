import { ResumeData, DesignConfig } from '@/types/resume';

export interface VerticalSpacingMetrics {
  baseTextSize: string;
  headingTextSize: string;
  sectionSpacing: string;
  itemSpacing: string;
  bulletSpacing: string;
  headerPadding: string;
  contentPadding: string;
  distributeFlex: string;
  sidebarSpacing: string;
  isCompactRequired: boolean;
}

/**
 * Smart Vertical Spacing & Layout Balancer for A4 One-Page and Multi-Page CVs
 * Dynamically computes optimal font sizing, leading, and margin distribution
 * to prevent excessive empty whitespace at the bottom of the A4 document.
 */
export function computeSmartVerticalSpacing(
  data: ResumeData,
  design: DesignConfig
): VerticalSpacingMetrics {
  const {
    personalInfo,
    experiences = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = data;

  let bulletCount = 0;
  experiences.forEach((exp) => {
    bulletCount += (exp.bullets || []).length;
  });
  projects.forEach((proj) => {
    bulletCount += (proj.bullets || []).length;
  });

  const summaryLength = (personalInfo?.summary || '').length;
  const summaryLines = Math.ceil(summaryLength / 80);

  const expCount = experiences.length;
  const eduCount = education.length;
  const skillCount = skills.length;
  const certCount = certifications.length;
  const langCount = languages.length;

  const contentScore =
    summaryLines * 1.3 +
    expCount * 3.5 +
    bulletCount * 1.8 +
    eduCount * 2.5 +
    (skillCount > 0 ? Math.ceil(skillCount / 3) * 1.0 : 0) +
    certCount * 1.5 +
    langCount * 1.0;

  const isOnePage = design.onePageMode;

  // Case 1: Very dense CV (more than 34 points and user wants 1-page fit)
  if (contentScore > 34 && isOnePage) {
    return {
      baseTextSize: 'text-[10px] leading-[1.38]',
      headingTextSize: 'text-[11px]',
      sectionSpacing: 'space-y-2',
      itemSpacing: 'space-y-1.5',
      bulletSpacing: 'space-y-0.5',
      headerPadding: 'px-8 py-3.5',
      contentPadding: 'p-6 sm:p-7',
      distributeFlex: 'justify-start',
      sidebarSpacing: 'space-y-3.5',
      isCompactRequired: true,
    };
  }

  // Case 2: Short / Standard CV (score <= 24) -> Smart expansion to fill A4 naturally without empty bottom gap
  if (contentScore <= 24) {
    return {
      baseTextSize:
        design.fontSize === 'sm'
          ? 'text-[10.5px] leading-[1.48]'
          : design.fontSize === 'lg'
          ? 'text-[12px] leading-[1.62]'
          : 'text-[11px] leading-[1.58]',
      headingTextSize:
        design.fontSize === 'sm' ? 'text-[12px]' : design.fontSize === 'lg' ? 'text-[14px]' : 'text-[13px]',
      sectionSpacing: 'space-y-5 sm:space-y-6',
      itemSpacing: 'space-y-3.5',
      bulletSpacing: 'space-y-1.5',
      headerPadding: 'px-8 py-6',
      contentPadding: 'p-8 sm:p-9',
      distributeFlex: 'justify-between',
      sidebarSpacing: 'space-y-6',
      isCompactRequired: false,
    };
  }

  // Case 3: Balanced Standard CV (score between 25 and 34)
  return {
    baseTextSize:
      design.fontSize === 'sm'
        ? 'text-[10px] leading-[1.42]'
        : design.fontSize === 'lg'
        ? 'text-[12px] leading-[1.54]'
        : 'text-[10.5px] leading-[1.48]',
    headingTextSize:
      design.fontSize === 'sm' ? 'text-[11.5px]' : design.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]',
    sectionSpacing: isOnePage ? 'space-y-3.5 sm:space-y-4' : 'space-y-4 sm:space-y-5',
    itemSpacing: isOnePage ? 'space-y-2.5' : 'space-y-3',
    bulletSpacing: 'space-y-1',
    headerPadding: 'px-8 py-5',
    contentPadding: 'p-7 sm:p-8',
    distributeFlex: isOnePage ? 'justify-between' : 'justify-start',
    sidebarSpacing: isOnePage ? 'space-y-4.5' : 'space-y-5',
    isCompactRequired: false,
  };
}
