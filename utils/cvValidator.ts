import { ResumeData } from '@/types/resume';
import { normalizeResumeData } from '@/utils/typeNormalizers';

export interface CVValidationResult {
  isValid: boolean;
  reasons: string[];
  sanitizedData: Partial<ResumeData>;
}

/**
 * Strict CV Import Quality Validator
 * Detects incomplete extractions, contact info in summary, collapsed jobs, or missing sections.
 */
export function validateExtractedCV(rawText: string, data: Partial<ResumeData>): CVValidationResult {
  const reasons: string[] = [];
  const sanitized: Partial<ResumeData> = normalizeResumeData(JSON.parse(JSON.stringify(data || {})));
  sanitized.personalInfo = sanitized.personalInfo || {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  };

  const rawLower = rawText.toLowerCase();

  // 1. Candidate Full Name Validation
  const currentName = (sanitized.personalInfo.fullName || '').trim();
  const isDummyName =
    !currentName ||
    currentName.toLowerCase() === 'alexandre morgan' ||
    currentName.toLowerCase() === 'professional candidate' ||
    currentName.toLowerCase() === 'candidate name' ||
    currentName.toLowerCase() === 'your name';

  if (isDummyName) {
    // Attempt recovery from the top lines of rawText
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0] || '';
    const candidateName = firstLine.split('|')[0].replace(/^(?:curriculum vitae|resume|cv)\s*:?\s*/i, '').trim();
    if (candidateName && candidateName.length >= 3 && candidateName.length <= 40 && !candidateName.includes('@')) {
      sanitized.personalInfo.fullName = candidateName;
    } else {
      reasons.push('Candidate full name could not be accurately extracted.');
    }
  }

  // 2. Strict Contact Information Extraction & Isolation from Summary
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(?:\+?880\s?|0)1[3-9]\d{8}|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/g;

  // Check if rawText contains email
  const rawEmails = rawText.match(emailRegex);
  if (rawEmails && rawEmails.length > 0 && !sanitized.personalInfo.email) {
    sanitized.personalInfo.email = rawEmails[0];
  }

  // Check if rawText contains phone
  const rawPhones = rawText.match(phoneRegex);
  if (rawPhones && rawPhones.length > 0 && !sanitized.personalInfo.phone) {
    sanitized.personalInfo.phone = rawPhones[0];
  }

  // 3. Inspect Summary - NEVER ALLOW CONTACT INFO IN SUMMARY
  let currentSummary = (sanitized.personalInfo.summary || '').trim();
  if (currentSummary) {
    // If summary contains emails or phones, strip them out
    const summaryEmails = currentSummary.match(emailRegex);
    if (summaryEmails && summaryEmails.length > 0) {
      if (!sanitized.personalInfo.email) sanitized.personalInfo.email = summaryEmails[0];
      currentSummary = currentSummary.replace(emailRegex, '').replace(/\b(?:email|mail|e-mail)\s*:?/gi, '').trim();
    }

    const summaryPhones = currentSummary.match(phoneRegex);
    if (summaryPhones && summaryPhones.length > 0) {
      if (!sanitized.personalInfo.phone) sanitized.personalInfo.phone = summaryPhones[0];
      currentSummary = currentSummary.replace(phoneRegex, '').replace(/\b(?:phone|mobile|cell|contact|tel)\s*:?/gi, '').trim();
    }

    // Strip address labels if dumped in summary
    currentSummary = currentSummary
      .replace(/\b(?:Mailing Address|Address|Location)\s*[:=]?\s*[^,\n.]+(?:,[^,\n.]+)*[.]?/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    sanitized.personalInfo.summary = currentSummary;
  }

  // 4. Job Title Validation
  if (!sanitized.personalInfo.jobTitle || sanitized.personalInfo.jobTitle.toLowerCase() === 'professional specialist') {
    if (sanitized.experiences && sanitized.experiences.length > 0 && sanitized.experiences[0].role) {
      sanitized.personalInfo.jobTitle = sanitized.experiences[0].role;
    } else {
      // Find possible title in first 3 lines
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length > 1 && lines[1].length < 50 && !lines[1].includes('@') && !phoneRegex.test(lines[1])) {
        sanitized.personalInfo.jobTitle = lines[1];
      }
    }
  }

  // 5. Work Experience Validation
  const hasWorkKeywords =
    rawLower.includes('experience') ||
    rawLower.includes('employment') ||
    rawLower.includes('work history') ||
    rawLower.includes('job') ||
    rawLower.includes('designation') ||
    rawLower.includes('responsibilities');

  const dateCount = (rawText.match(/\b(?:19\d{2}|20\d{2}|present|current)\b/gi) || []).length;

  if (hasWorkKeywords && dateCount >= 2) {
    if (!sanitized.experiences || sanitized.experiences.length === 0) {
      reasons.push('Work experience was detected in source document but failed to extract.');
    }
  }

  // 6. Education Validation
  const hasEduKeywords =
    rawLower.includes('education') ||
    rawLower.includes('university') ||
    rawLower.includes('college') ||
    rawLower.includes('bachelor') ||
    rawLower.includes('b.sc') ||
    rawLower.includes('b.a') ||
    rawLower.includes('bba') ||
    rawLower.includes('mba') ||
    rawLower.includes('diploma') ||
    rawLower.includes('hsc') ||
    rawLower.includes('ssc') ||
    rawLower.includes('cgpa') ||
    rawLower.includes('gpa');

  if (hasEduKeywords && (!sanitized.education || sanitized.education.length === 0)) {
    reasons.push('Education qualifications were detected in source document but failed to extract.');
  }

  // 7. General Completeness Validation
  const hasAnySection =
    (sanitized.experiences && sanitized.experiences.length > 0) ||
    (sanitized.education && sanitized.education.length > 0) ||
    (sanitized.skills && sanitized.skills.length > 0);

  if (rawText.length > 300 && !hasAnySection) {
    reasons.push('Extracted sections are suspiciously empty compared to source document length.');
  }

  return {
    isValid: reasons.length === 0,
    reasons,
    sanitizedData: sanitized,
  };
}
