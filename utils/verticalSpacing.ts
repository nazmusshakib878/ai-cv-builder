import { ResumeData, DesignConfig } from '@/types/resume';

export interface VerticalSpacingMetrics {
  baseTextSize: string;
  headingTextSize: string;
  sectionSpacing: string;
  itemSpacing: string;
  bulletSpacing: string;
  headerPadding: string;
  contentPadding: string;
  sidebarSpacing: string;
  distributeFlex: string;
  isCompactRequired: boolean;
}

/**
 * Smart Vertical Spacing & Layout Balancer for A4 One-Page and Multi-Page CVs
 * Dynamically computes optimal font sizing, leading, and margin distribution
 * to eliminate excessive empty whitespace at the bottom of the A4 document.
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
  const certCount = certifications.length;

  // Main column content density score (excluding sidebar-isolated skills)
  const mainContentScore =
    summaryLines * 1.5 +
    expCount * 4.0 +
    bulletCount * 2.0 +
    eduCount * 3.0 +
    certCount * 2.0;

  const isOnePage = design.onePageMode;

  // Case 1: Extra Long / Overflowing CV (more than 40 main points)
  if (mainContentScore > 40 && isOnePage) {
    return {
      baseTextSize: 'text-[10px] leading-[1.38]',
      headingTextSize: 'text-[11px]',
      sectionSpacing: 'space-y-2',
      itemSpacing: 'space-y-1',
      bulletSpacing: 'space-y-0.5',
      headerPadding: 'px-8 py-3.5',
      contentPadding: 'p-6 sm:p-7',
      sidebarSpacing: 'space-y-3',
      distributeFlex: 'justify-start',
      isCompactRequired: true,
    };
  }

  // Case 2: Short / Standard CV (score <= 26) -> Rich, generous spacing to fill A4 naturally
  if (mainContentScore <= 26) {
    return {
      baseTextSize:
        design.fontSize === 'sm'
          ? 'text-[10.5px] leading-[1.5]'
          : design.fontSize === 'lg'
          ? 'text-[12px] leading-[1.65]'
          : 'text-[11px] leading-[1.6]',
      headingTextSize:
        design.fontSize === 'sm' ? 'text-[12px]' : design.fontSize === 'lg' ? 'text-[14px]' : 'text-[13px]',
      sectionSpacing: 'space-y-5 sm:space-y-6',
      itemSpacing: 'space-y-3 sm:space-y-4',
      bulletSpacing: 'space-y-1.5',
      headerPadding: 'px-8 py-5 sm:py-6',
      contentPadding: 'p-7 sm:p-8',
      sidebarSpacing: 'space-y-5 sm:space-y-6',
      distributeFlex: 'justify-between',
      isCompactRequired: false,
    };
  }

  // Case 3: Balanced Standard CV (score between 27 and 40)
  return {
    baseTextSize:
      design.fontSize === 'sm'
        ? 'text-[10px] leading-[1.45]'
        : design.fontSize === 'lg'
        ? 'text-[12px] leading-[1.58]'
        : 'text-[10.5px] leading-[1.52]',
    headingTextSize:
      design.fontSize === 'sm' ? 'text-[11.5px]' : design.fontSize === 'lg' ? 'text-[13px]' : 'text-[12px]',
    sectionSpacing: 'space-y-4 sm:space-y-5',
    itemSpacing: 'space-y-2.5 sm:space-y-3',
    bulletSpacing: 'space-y-1',
    headerPadding: 'px-8 py-4.5',
    contentPadding: 'p-6 sm:p-8',
    sidebarSpacing: 'space-y-4 sm:space-y-5',
    distributeFlex: 'justify-between',
    isCompactRequired: false,
  };
}
