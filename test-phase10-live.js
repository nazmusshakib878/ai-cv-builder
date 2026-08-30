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

async function runPhase10Tests() {
  console.log('=== STARTING PHASE 10: PRODUCTION DEPLOYMENT & LIVE VERIFICATION ===\n');

  const baseResume = {
    personalInfo: {
      fullName: 'Tahmid Rahman',
      jobTitle: 'Software Engineering Lead',
      email: 'tahmid.rahman@techcorp.io',
      phone: '+880 1712 345678',
      location: 'Dhaka, Bangladesh',
      summary: 'Software engineering professional with 6+ years in cloud architectures and full-stack systems.',
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'Brain Station 23',
        role: 'Senior Software Engineer',
        location: 'Dhaka, Bangladesh',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bullets: [
          'Led microservices backend development for high-traffic financial app.',
          'Supported CI/CD automated deployment pipelines.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'BUET',
        degree: 'B.Sc. in Computer Science & Engineering',
        field: 'Computer Science',
        location: 'Dhaka, Bangladesh',
        startDate: '2015',
        endDate: '2019',
        gpa: '3.85 / 4.00',
      },
    ],
    skills: [
      { id: 's1', name: 'TypeScript & Next.js', category: 'Technical' },
      { id: 's2', name: 'PostgreSQL & Docker', category: 'Technical' },
    ],
  };

  const baseDesign = {
    template: 'national-pro',
    accentColor: '#0f172a',
    fontFamily: 'jakarta',
  };

  // =========================================================
  // 1. Multi-Turn AI Conversation in Bangla, Banglish & English
  // =========================================================
  console.log('--- 1. Multi-Turn AI Queries (Bangla, Banglish, English) ---');

  // 1.1 Bangla: "আমার CV টা professional করে দাও"
  const resBangla = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'আমার CV টা professional করে দাও',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonBangla = await resBangla.json();
  check(Boolean(jsonBangla.content), '1.1: AI responds naturally to Bangla request: "আমার CV টা professional করে দাও"');
  check(Boolean(jsonBangla.diffPreview?.modifiedData?.personalInfo?.summary), '1.1: AI professional summary updated');

  // 1.2 Banglish: "experience ta strong kore likho"
  const resBanglish = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'experience ta strong kore likho',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonBanglish = await resBanglish.json();
  check(Boolean(jsonBanglish.diffPreview?.modifiedData?.experiences), '1.2: AI strengthened experience bullets for: "experience ta strong kore likho"');

  // 1.3 English: "Make my CV ATS friendly"
  const resAts = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Make my CV ATS friendly',
      resumeData: baseResume,
      designConfig: baseDesign,
    }),
  });
  const jsonAts = await resAts.json();
  check(jsonAts.diffPreview?.modifiedDesign?.template === 'global-ats', '1.3: AI selected global-ats template for: "Make my CV ATS friendly"');

  // =========================================================
  // 2. Upload Endpoint Bounds & File Validation
  // =========================================================
  console.log('\n--- 2. File Upload Limits & Type Validation ---');

  // 2.1 Missing file
  const noFileRes = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: new FormData(),
  });
  check(noFileRes.status === 400, '2.1: Missing file rejected with 400 Bad Request');

  // 2.2 Text CV Upload
  const textFormData = new FormData();
  const textBlob = new Blob(
    [
      `Tahmid Rahman\nSenior Lead Engineer\ntahmid@example.com\n+880 1700 123456\nExperienced engineering leader in high-scale systems.\n\nWork Experience:\nSenior Architect at TechCorp 2021-Present\nEngineered core distributed backend.\n\nEducation:\nB.Sc. in CSE from BUET 2019`,
    ],
    { type: 'text/plain' }
  );
  textFormData.append('file', textBlob, 'resume.txt');

  const textUploadRes = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: textFormData,
  });
  check(textUploadRes.ok, '2.2: Text/Plain resume parsed successfully');
  const textUploadJson = await textUploadRes.json();
  check(Boolean(textUploadJson.resumeData?.personalInfo?.fullName), '2.2: Parsed candidate name from uploaded file');

  // =========================================================
  // 3. Legal & Static Pages Availability
  // =========================================================
  console.log('\n--- 3. Legal & Support Pages HTTP 200 Verification ---');
  const pages = ['/privacy', '/terms', '/refund', '/contact'];
  for (const pagePath of pages) {
    const pageRes = await fetch(`${BASE_URL}${pagePath}`);
    check(pageRes.ok, `3.x: ${pagePath} is accessible (HTTP 200)`);
  }

  // =========================================================
  // 4. Complete End-to-End User Flow
  // =========================================================
  console.log('\n--- 4. Complete End-to-End Guest to Paid User Cycle ---');
  const guestSession = 'gst_e2e_' + Date.now();

  // Create CV
  const createRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestSession },
    body: JSON.stringify({
      title: 'Senior Software Engineer CV',
      data: baseResume,
      design: baseDesign,
    }),
  });
  check(createRes.ok, '4.1: Guest created CV');
  const createJson = await createRes.json();
  const resumeId = createJson.resume.id;

  // Pay ৳50
  const payCreateRes = await fetch(`${BASE_URL}/api/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestSession },
    body: JSON.stringify({ resumeId }),
  });
  const payCreateJson = await payCreateRes.json();
  check(payCreateJson.amount === '50.00', '4.2: Payment initialized at 50 BDT');

  // Execute payment
  const payExecRes = await fetch(
    `${BASE_URL}/api/payment/execute?paymentID=${payCreateJson.paymentID}&status=success&resumeId=${resumeId}`,
    { headers: { 'x-guest-session-id': guestSession }, redirect: 'manual' }
  );
  check(payExecRes.ok || payExecRes.status === 307 || payExecRes.status === 302, '4.3: Payment verified and executed');

  // Download PDF
  const downloadRes = await fetch(`${BASE_URL}/api/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestSession },
    body: JSON.stringify({ resumeId }),
  });
  check(downloadRes.status === 200, '4.4: PDF generated and downloaded securely');

  // Claim CV on account registration
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestSession },
    body: JSON.stringify({
      email: `tahmid_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
      fullName: 'Tahmid Rahman',
    }),
  });
  const regJson = await regRes.json();
  const token = regJson.token;
  check(Boolean(token), '4.5: Account created');

  // Reopen CV with token
  const userCvRes = await fetch(`${BASE_URL}/api/resumes/${resumeId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const userCvJson = await userCvRes.json();
  check(userCvJson.resume.isPaid === true, '4.6: Paid status permanently retained under registered account');

  console.log(`\n=== PHASE 10 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPhase10Tests().catch((err) => {
  console.error('Phase 10 test fatal error:', err);
  process.exit(1);
});
