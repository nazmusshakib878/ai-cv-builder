const assert = require('assert');

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

async function runTemplateTests() {
  console.log('=== STARTING 8 PROFESSIONAL CV TEMPLATES TEST SUITE ===\n');

  // =========================================================
  // 1. AI Smart Template Selection Tests
  // =========================================================
  console.log('--- 1. AI Smart Template Selection from User Context ---');

  const baseResume = {
    personalInfo: {
      fullName: 'Dr. Tanvir Ahmed',
      jobTitle: 'Medical Officer',
      email: 'dr.tanvir@hospital.org',
      phone: '+880 1711 000000',
      location: 'Dhaka, Bangladesh',
      summary: 'Dedicated Medical Officer with experience in clinical care and emergency triage.',
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'Dhaka Medical College Hospital',
        role: 'Resident Medical Officer',
        location: 'Dhaka, Bangladesh',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        bullets: ['Managed OPD triage of 120+ patients daily.', 'Supervised ICU patient management.'],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Dhaka Medical College',
        degree: 'MBBS',
        field: 'Medicine & Surgery',
        location: 'Dhaka, Bangladesh',
        startDate: '2015',
        endDate: '2021',
      },
    ],
    skills: [
      { id: 's1', name: 'Clinical Diagnosis', category: 'Technical' },
      { id: 's2', name: 'Emergency Medicine', category: 'Technical' },
      { id: 's3', name: 'Patient Counseling', category: 'Leadership & Strategy' },
    ],
    certifications: [
      { id: 'c1', title: 'BMDC Registered Doctor', issuer: 'BMDC', date: '2021' },
    ],
    languages: [
      { id: 'l1', language: 'Bangla', proficiency: 'Native' },
      { id: 'l2', language: 'English', proficiency: 'Professional' },
    ],
  };

  const baseDesign = {
    template: 'national-pro',
    accentColor: '#0f172a',
    fontFamily: 'jakarta',
    fontSize: 'base',
    lineSpacing: 'normal',
    sectionSpacing: 'normal',
    onePageMode: false,
  };

  // 1.1 Bangladesh Hospital Query -> national-pro
  const resBd = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Bangladesh hospital e apply korbo',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonBd = await resBd.json();
  check(jsonBd.diffPreview?.modifiedDesign?.template === 'national-pro', '1.1: Bangladesh hospital query selects national-pro template');

  // 1.2 USA Job Query -> global-ats
  const resUsa = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'USA job e apply korbo',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonUsa = await resUsa.json();
  check(jsonUsa.diffPreview?.modifiedDesign?.template === 'global-ats', '1.2: USA job query selects global-ats template');

  // 1.3 Germany Query -> german-lebenslauf
  const resGer = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Germany apply korbo',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonGer = await resGer.json();
  check(jsonGer.diffPreview?.modifiedDesign?.template === 'german-lebenslauf', '1.3: Germany query selects german-lebenslauf template');

  // 1.4 Australia Query -> australia-nz
  const resAus = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Australia apply korbo',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonAus = await resAus.json();
  check(jsonAus.diffPreview?.modifiedDesign?.template === 'australia-nz', '1.4: Australia query selects australia-nz template');

  // 1.5 International Job Query -> international-pro
  const resIntl = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'international job er jonno make koro',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonIntl = await resIntl.json();
  check(jsonIntl.diffPreview?.modifiedDesign?.template === 'international-pro', '1.5: International job query selects international-pro template');

  // 1.6 Multinational Company Query -> multinational-corp
  const resMnc = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'multinational company te apply korbo',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonMnc = await resMnc.json();
  check(jsonMnc.diffPreview?.modifiedDesign?.template === 'multinational-corp', '1.6: Multinational company query selects multinational-corp template');

  // =========================================================
  // 2. Photo Handling & Smart Fit Tests
  // =========================================================
  console.log('\n--- 2. Photo Commands & 1-Page Smart Fit ---');

  // 2.1 Photo Remove Command
  const resPhotoRem = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'photo remove koro',
      resumeData: {
        ...baseResume,
        personalInfo: { ...baseResume.personalInfo, photoUrl: 'https://example.com/photo.jpg' },
      },
      designConfig: baseDesign,
    }),
  });
  const jsonPhotoRem = await resPhotoRem.json();
  check(jsonPhotoRem.diffPreview?.modifiedData?.personalInfo?.photoUrl === undefined, '2.1: Photo remove command clears photoUrl');

  // 2.2 Photo Add Command
  const resPhotoAdd = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'photo add koro',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonPhotoAdd = await resPhotoAdd.json();
  check(Boolean(jsonPhotoAdd.diffPreview?.modifiedData?.personalInfo?.photoUrl), '2.2: Photo add command sets photoUrl');

  // 2.3 One Page Fit Command
  const resOnePage = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: '1 page koro',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonOnePage = await resOnePage.json();
  check(jsonOnePage.diffPreview?.modifiedDesign?.onePageMode === true, '2.3: "1 page koro" enables onePageMode');
  check(jsonOnePage.diffPreview?.modifiedDesign?.sectionSpacing === 'compact', '2.3: "1 page koro" compacts sectionSpacing');

  // =========================================================
  // 3. Database Persistence & Template Switching
  // =========================================================
  console.log('\n--- 3. Database Persistence & Multiple Template Switching ---');

  const guestSessionId = 'gst_tmpl_test_' + Date.now();

  // Create Garments Quality Controller CV
  const garmentsCv = {
    title: 'Garments Quality Controller CV',
    data: {
      personalInfo: {
        fullName: 'Md. Rafiqul Islam',
        jobTitle: 'Senior Quality Controller',
        email: 'rafiq.qc@apparel-bd.com',
        phone: '+880 1819 123456',
        location: 'Gazipur, Bangladesh',
        summary: 'Quality controller with 7+ years of experience in RMG, AQL 2.5 inspection, and ISO compliance.',
      },
      experiences: [
        {
          id: 'exp-qc-1',
          company: 'Apex Garments Ltd.',
          role: 'Quality Assurance Officer',
          location: 'Gazipur, Bangladesh',
          startDate: '2020',
          endDate: 'Present',
          current: true,
          bullets: ['Reduced sewing defect rate by 18% through inline inspections.', 'Supervised final AQL 2.5 audits for EU buyers.'],
        },
      ],
      education: [
        {
          id: 'edu-qc-1',
          institution: 'Bangladesh University of Textiles (BUTEX)',
          degree: 'B.Sc. in Textile Engineering',
          field: 'Apparel Manufacturing',
          location: 'Dhaka, Bangladesh',
          startDate: '2015',
          endDate: '2019',
          gpa: '3.62',
        },
      ],
      skills: [
        { id: 's-1', name: 'AQL 2.5 & 4.0 Standard', category: 'Technical' },
        { id: 's-2', name: 'Pattern & Fabric Inspection', category: 'Technical' },
        { id: 's-3', name: 'Buyer Audit Compliance', category: 'Leadership & Strategy' },
      ],
      certifications: [
        { id: 'c-1', title: 'Lean Six Sigma Green Belt', issuer: 'TUV SUD', date: '2021' },
      ],
      languages: [
        { id: 'l-1', language: 'Bangla', proficiency: 'Native' },
        { id: 'l-2', language: 'English', proficiency: 'Professional' },
      ],
    },
    design: {
      template: 'national-pro',
      accentColor: '#0f172a',
    },
  };

  const createCvRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestSessionId,
    },
    body: JSON.stringify(garmentsCv),
  });
  check(createCvRes.ok, '3.1: Garments Quality Controller CV saved in DB');
  const createCvJson = await createCvRes.json();
  const resumeId = createCvJson.resume.id;

  // Switch to Global ATS template
  const switchTmplRes = await fetch(`${BASE_URL}/api/resumes/${resumeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestSessionId,
    },
    body: JSON.stringify({
      design: { template: 'global-ats', accentColor: '#1e293b' },
    }),
  });
  check(switchTmplRes.ok, '3.2: Switched template to Global ATS');

  // Verify Data Unaltered after template switch
  const verifyCvRes = await fetch(`${BASE_URL}/api/resumes/${resumeId}`, {
    headers: { 'x-guest-session-id': guestSessionId },
  });
  const verifyCvJson = await verifyCvRes.json();
  check(verifyCvJson.resume.data.personalInfo.fullName === 'Md. Rafiqul Islam', '3.3: Candidate name preserved 100%');
  check(verifyCvJson.resume.data.experiences[0].company === 'Apex Garments Ltd.', '3.3: Experience preserved 100%');
  check(verifyCvJson.resume.design.template === 'global-ats', '3.3: Template successfully updated to global-ats');

  console.log(`\n=== TEMPLATE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTemplateTests().catch((err) => {
  console.error('Template test fatal error:', err);
  process.exit(1);
});
