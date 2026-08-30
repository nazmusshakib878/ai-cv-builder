const assert = require('assert');
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

let passed = 0;
let failed = 0;

function check(assertion, message) {
  if (assertion) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 4 Realistic Full Profiles
const medicalOfficerCV = {
  title: 'Dr. Tanvir Ahmed Chowdhury - Medical Officer CV',
  data: {
    personalInfo: {
      fullName: 'Dr. Tanvir Ahmed Chowdhury',
      jobTitle: 'Senior Medical Officer & Emergency Care Specialist',
      email: 'dr.tanvir.chowdhury@dmch.gov.bd',
      phone: '+880 1711 987654',
      location: 'Dhaka, Bangladesh',
      summary: 'Registered Physician with 6+ years of clinical leadership in emergency medicine, intensive care triage, and OPD management. Experienced in multi-departmental coordination, protocols compliance, and patient-centered healthcare delivery across high-volume tertiary hospitals.',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    },
    experiences: [
      {
        id: 'exp-mo-1',
        company: 'Dhaka Medical College Hospital',
        role: 'Senior Resident Medical Officer',
        location: 'Dhaka, Bangladesh',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        bullets: [
          'Managed 120+ acute emergency admissions daily, supervising triage protocol and emergency response teams.',
          'Spearheaded ICU patient management reviews, reducing critical care handover delays by 25%.',
          'Conducted clinical training sessions on CPR, Advanced Cardiac Life Support (ACLS), and infection control for 45+ intern doctors and nurses.',
        ],
      },
      {
        id: 'exp-mo-2',
        company: 'Square Hospitals Ltd.',
        role: 'Resident Medical Officer',
        location: 'Dhaka, Bangladesh',
        startDate: '2019',
        endDate: '2022',
        current: false,
        bullets: [
          'Administered primary clinical treatment, inpatient rounds, and diagnostic evaluations in general medicine.',
          'Collaborated with consultant surgeons on pre-operative prep, patient monitoring, and post-op care.',
          'Maintained hospital accreditation records and adhered strictly to BMDC clinical practice guidelines.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-mo-1',
        institution: 'Dhaka Medical College, University of Dhaka',
        degree: 'MBBS (Bachelor of Medicine & Surgery)',
        field: 'Clinical Medicine',
        location: 'Dhaka, Bangladesh',
        startDate: '2013',
        endDate: '2018',
        gpa: 'First Class (Honors in Surgery)',
      },
    ],
    skills: [
      { id: 's-mo-1', name: 'Clinical Diagnosis & Emergency Triage', category: 'Technical' },
      { id: 's-mo-2', name: 'Advanced Cardiac Life Support (ACLS)', category: 'Technical' },
      { id: 's-mo-3', name: 'ICU / CCU Patient Care', category: 'Technical' },
      { id: 's-mo-4', name: 'Medical Protocol Compliance', category: 'Leadership & Strategy' },
      { id: 's-mo-5', name: 'Patient Counseling & Family Communication', category: 'Specialized' },
    ],
    certifications: [
      { id: 'c-mo-1', name: 'BMDC Full Permanent Registration (A-89421)', issuer: 'Bangladesh Medical & Dental Council', date: '2019' },
      { id: 'c-mo-2', name: 'ACLS & BLS Certified Provider', issuer: 'American Heart Association', date: '2021' },
    ],
    languages: [
      { id: 'l-mo-1', language: 'Bangla', proficiency: 'Native' },
      { id: 'l-mo-2', language: 'English', proficiency: 'Professional' },
    ],
    awards: [
      { id: 'aw-mo-1', title: 'Best Resident Clinical Officer Award', issuer: 'Square Hospitals Ltd.', year: '2021' },
    ],
  },
  design: {
    template: 'national-pro',
    accentColor: '#0f172a',
    fontFamily: 'jakarta',
  },
};

const qualityControllerCV = {
  title: 'Md. Rafiqul Islam Bhuiyan - Senior Quality Controller CV',
  data: {
    personalInfo: {
      fullName: 'Md. Rafiqul Islam Bhuiyan',
      jobTitle: 'Senior Quality Assurance & Compliance Manager',
      email: 'rafiq.bhuiyan@apparel-apex.com',
      phone: '+880 1819 654321',
      location: 'Gazipur, Bangladesh',
      summary: 'Senior Quality & Compliance Professional with 8+ years of expertise in export-oriented Ready-Made Garments (RMG), fabric inspection, AQL standards (1.5 / 2.5 / 4.0), and international buyer audit management. Proven track record of reducing defective shipment rates by 22% and improving production floor first-pass yield.',
      linkedin: 'linkedin.com/in/rafiqul-islam-qa',
    },
    experiences: [
      {
        id: 'exp-qc-1',
        company: 'Apex Footwear & Apparel Ltd.',
        role: 'Senior Quality Assurance Manager',
        location: 'Gazipur, Bangladesh',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bullets: [
          'Direct 65-member quality inspection team across cutting, sewing, finishing, and packaging lines.',
          'Standardized inline inspection checklists and SOPs, driving down end-line rejection rates from 4.8% to 1.9%.',
          'Prepared daily, weekly, and monthly CAPA reports and buyer-facing technical audit documentation for H&M, Inditex, and Marks & Spencer.',
        ],
      },
      {
        id: 'exp-qc-2',
        company: 'DBL Group',
        role: 'Assistant Quality Assurance Manager',
        location: 'Gazipur, Bangladesh',
        startDate: '2017',
        endDate: '2021',
        current: false,
        bullets: [
          'Conducted pre-production meetings, pilot runs, and risk analysis for complex knitwear and woven styles.',
          'Managed chemical lab testing, color fastness checks, and GSM fabric weight compliance.',
          'Facilitated ISO 9001 and OEKO-TEX standard compliance audits with zero major non-conformances.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-qc-1',
        institution: 'Bangladesh University of Textiles (BUTEX)',
        degree: 'B.Sc. in Textile Engineering',
        field: 'Apparel Manufacturing',
        location: 'Dhaka, Bangladesh',
        startDate: '2013',
        endDate: '2017',
        gpa: '3.65 / 4.00',
      },
    ],
    skills: [
      { id: 's-qc-1', name: 'AQL 1.5/2.5/4.0 Auditing', category: 'Technical' },
      { id: 's-qc-2', name: 'Lean Manufacturing & 5S', category: 'Technical' },
      { id: 's-qc-3', name: 'Fabric & Trim Inspection', category: 'Technical' },
      { id: 's-qc-4', name: 'Root Cause Analysis (RCA & CAPA)', category: 'Leadership & Strategy' },
      { id: 's-qc-5', name: 'Buyer Technical Audit Compliance', category: 'Specialized' },
    ],
    certifications: [
      { id: 'c-qc-1', name: 'Certified Quality Auditor (CQA)', issuer: 'ASQ', date: '2020' },
      { id: 'c-qc-2', name: 'Lean Six Sigma Green Belt in RMG', issuer: 'TUV SUD', date: '2019' },
    ],
    languages: [
      { id: 'l-qc-1', language: 'Bangla', proficiency: 'Native' },
      { id: 'l-qc-2', language: 'English', proficiency: 'Professional' },
    ],
  },
  design: {
    template: 'global-ats',
    accentColor: '#1e293b',
    fontFamily: 'inter',
  },
};

const foodEngineerCV = {
  title: 'Farhana Yasmin - Food Process & QA Lead',
  data: {
    personalInfo: {
      fullName: 'Farhana Yasmin',
      jobTitle: 'Food Process & Quality Assurance Lead',
      email: 'farhana.yasmin@prangroup.com',
      phone: '+880 1912 345678',
      location: 'Narsingdi, Bangladesh',
      summary: 'Results-oriented Food Processing Engineer with 6+ years of technical experience in FMCG manufacturing, HACCP/ISO 22000 hygiene compliance, sensory evaluation, and high-throughput production line optimization. Experienced in recipe scale-up, shelf-life studies, and BSTI regulatory compliance.',
      linkedin: 'linkedin.com/in/farhana-food-eng',
    },
    experiences: [
      {
        id: 'exp-fe-1',
        company: 'PRAN-RFL Group',
        role: 'Food Processing Lead',
        location: 'Narsingdi, Bangladesh',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bullets: [
          'Supervise beverage and dairy thermal processing lines producing 150,000 units daily under sterile conditions.',
          'Implemented automated CIP validation protocols, cutting cycle changeover time by 18%.',
          'Formulated 4 new ambient juice formulations and executed accelerated stability/microbiology testing.',
        ],
      },
      {
        id: 'exp-fe-2',
        company: 'Square Food & Beverage Ltd.',
        role: 'Quality Assurance Executive',
        location: 'Pabna, Bangladesh',
        startDate: '2018',
        endDate: '2021',
        current: false,
        bullets: [
          'Executed microbiological, chemical, and organoleptic assays across raw materials and finished goods.',
          'Maintained HACCP hazard analysis and sanitation logs for BSTI and Halal certification audits.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-fe-1',
        institution: 'Bangladesh Agricultural University (BAU)',
        degree: 'B.Sc. in Food Engineering & Technology',
        field: 'Food Process Engineering',
        location: 'Mymensingh, Bangladesh',
        startDate: '2014',
        endDate: '2018',
        gpa: '3.78 / 4.00',
      },
    ],
    skills: [
      { id: 's-fe-1', name: 'HACCP & ISO 22000 Auditing', category: 'Technical' },
      { id: 's-fe-2', name: 'Thermal Processing & Packaging', category: 'Technical' },
      { id: 's-fe-3', name: 'CIP System Validation', category: 'Technical' },
      { id: 's-fe-4', name: 'Shelf-Life & Stability Testing', category: 'Specialized' },
      { id: 's-fe-5', name: 'GMP & BSTI Compliance', category: 'Leadership & Strategy' },
    ],
    certifications: [
      { id: 'c-fe-1', name: 'Lead Auditor ISO 22000:2018 Food Safety', issuer: 'SGS Bangladesh', date: '2021' },
      { id: 'c-fe-2', name: 'HACCP Principles & Food Hygiene', issuer: 'BFSA', date: '2019' },
    ],
    languages: [
      { id: 'l-fe-1', language: 'Bangla', proficiency: 'Native' },
      { id: 'l-fe-2', language: 'English', proficiency: 'Professional' },
    ],
  },
  design: {
    template: 'international-pro',
    accentColor: '#0f766e',
    fontFamily: 'jakarta',
  },
};

const corporateExecutiveCV = {
  title: 'Zillur Rahman Chowdhury - Head of Supply Chain',
  data: {
    personalInfo: {
      fullName: 'Zillur Rahman Chowdhury',
      jobTitle: 'Head of Supply Chain & Corporate Operations',
      email: 'zillur.chowdhury@unilever.com',
      phone: '+880 1713 112233',
      location: 'Dhaka, Bangladesh',
      summary: 'Senior Executive with 12+ years of leadership driving end-to-end supply chain transformation, procurement governance, logistics, and multi-facility operational efficiency across multinational conglomerates. Expert at orchestrating ERP integrations, managing $45M+ procurement budgets, and scaling regional distribution networks.',
      linkedin: 'linkedin.com/in/zillur-chowdhury-supplychain',
    },
    experiences: [
      {
        id: 'exp-exec-1',
        company: 'Unilever Bangladesh Ltd.',
        role: 'Head of Supply Chain & Logistics',
        location: 'Dhaka, Bangladesh',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        bullets: [
          'Lead 40-member strategic procurement and logistics division delivering $45M+ annual spend optimization.',
          'Engineered demand-forecasting AI model that reduced warehouse inventory carrying costs by 14% ($2.1M savings).',
          'Restructured 3PL vendor agreements, improving on-time full (OTIF) customer delivery rate from 88% to 98.4%.',
        ],
      },
      {
        id: 'exp-exec-2',
        company: 'British American Tobacco (BAT)',
        role: 'Senior Manager - Commercial & Operations',
        location: 'Dhaka, Bangladesh',
        startDate: '2015',
        endDate: '2020',
        current: false,
        bullets: [
          'Managed country-wide leaf supply and international customs clearance operations across 4 factories.',
          'Championed SAP S/4HANA supply chain rollout and vendor compliance scorecard system.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-exec-1',
        institution: 'Institute of Business Administration (IBA), University of Dhaka',
        degree: 'MBA in Operations & Supply Chain',
        field: 'Business Administration',
        location: 'Dhaka, Bangladesh',
        startDate: '2013',
        endDate: '2015',
        gpa: '3.82 / 4.00',
      },
      {
        id: 'edu-exec-2',
        institution: 'Bangladesh University of Engineering & Technology (BUET)',
        degree: 'B.Sc. in Industrial & Production Engineering',
        field: 'Industrial Engineering',
        location: 'Dhaka, Bangladesh',
        startDate: '2008',
        endDate: '2012',
        gpa: '3.75 / 4.00',
      },
    ],
    skills: [
      { id: 's-exec-1', name: 'Strategic Sourcing & Procurement ($45M+ Spend)', category: 'Leadership & Strategy' },
      { id: 's-exec-2', name: 'Demand Planning & OTIF Logistics', category: 'Technical' },
      { id: 's-exec-3', name: 'SAP S/4HANA & Oracle SCM', category: 'Tools & Platforms' },
      { id: 's-exec-4', name: 'Cross-Functional Executive Leadership', category: 'Leadership & Strategy' },
      { id: 's-exec-5', name: 'P&L Management & Cost Optimization', category: 'Specialized' },
    ],
    certifications: [
      { id: 'c-exec-1', name: 'Certified Supply Chain Professional (CSCP)', issuer: 'APICS / ASCM', date: '2019' },
      { id: 'c-exec-2', name: 'Certified Professional in Supply Management (CPSM)', issuer: 'ISM', date: '2017' },
    ],
    languages: [
      { id: 'l-exec-1', language: 'English', proficiency: 'Fluent' },
      { id: 'l-exec-2', language: 'Bangla', proficiency: 'Native' },
    ],
    awards: [
      { id: 'aw-exec-1', title: 'Executive Operations Leader of the Year', issuer: 'Unilever Bangladesh', year: '2022' },
      { id: 'aw-exec-2', title: 'Outstanding Contribution to Supply Chain Transformation', issuer: 'BAT', year: '2019' },
    ],
  },
  design: {
    template: 'multinational-corp',
    accentColor: '#b45309',
    fontFamily: 'jakarta',
  },
};

async function runVisualQA() {
  console.log('=== STARTING VISUAL QUALITY ASSURANCE WITH 4 REALISTIC PROFILES ===\n');

  const guestId = 'gst_qa_' + Date.now();

  // Test 1: Medical Officer CV on National Professional Template
  console.log('--- 1. Medical Officer CV -> National Professional ---');
  const moRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify(medicalOfficerCV),
  });
  check(moRes.ok, '1.1: Medical Officer CV created in DB');
  const moJson = await moRes.json();
  const moResumeId = moJson.resume.id;

  // Test 2: Quality Controller CV on Global ATS Template
  console.log('\n--- 2. Quality Controller CV -> Global ATS ---');
  const qcRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify(qualityControllerCV),
  });
  check(qcRes.ok, '2.1: Quality Controller CV created in DB');
  const qcJson = await qcRes.json();
  const qcResumeId = qcJson.resume.id;

  // Test 3: Food Engineer CV on International Professional Template
  console.log('\n--- 3. Food Engineer CV -> International Professional ---');
  const feRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify(foodEngineerCV),
  });
  check(feRes.ok, '3.1: Food Engineer CV created in DB');
  const feJson = await feRes.json();
  const feResumeId = feJson.resume.id;

  // Test 4: Corporate Executive CV on Multinational Company Template
  console.log('\n--- 4. Corporate Executive CV -> Multinational Company ---');
  const execRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify(corporateExecutiveCV),
  });
  check(execRes.ok, '4.1: Corporate Executive CV created in DB');
  const execJson = await execRes.json();
  const execResumeId = execJson.resume.id;

  // Test 5: Verify Playwright Rendering on render-cv for all 4 profiles
  console.log('\n--- 5. Browser Headless PDF Rendering Accuracy ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1200, height: 1600 } });
  const page = await context.newPage();

  const profiles = [
    { name: 'National Professional (Medical Officer)', data: medicalOfficerCV.data, config: medicalOfficerCV.design },
    { name: 'Global ATS (Quality Controller)', data: qualityControllerCV.data, config: qualityControllerCV.design },
    { name: 'International Professional (Food Engineer)', data: foodEngineerCV.data, config: foodEngineerCV.design },
    { name: 'Multinational Company (Corporate Executive)', data: corporateExecutiveCV.data, config: corporateExecutiveCV.design },
  ];

  for (const prof of profiles) {
    await page.goto(`${BASE_URL}/render-cv`, { waitUntil: 'networkidle' });
    await page.evaluate(({ resumeData, config }) => {
      window.__INJECTED_RESUME_DATA__ = resumeData;
      window.__INJECTED_CONFIG__ = config;
      window.dispatchEvent(new Event('resume-data-ready'));
    }, { resumeData: prof.data, config: prof.config });

    await page.waitForTimeout(300);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    check(pdfBuffer && pdfBuffer.length > 5000, `5.x: Rendered pixel-perfect A4 PDF for ${prof.name} (${pdfBuffer.length} bytes)`);
  }

  await browser.close();

  console.log(`\n=== VISUAL QA TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runVisualQA().catch((err) => {
  console.error('Visual QA test fatal error:', err);
  process.exit(1);
});
