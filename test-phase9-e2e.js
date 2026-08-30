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

async function runPhase9Tests() {
  console.log('=== STARTING PHASE 9: REAL PAYMENT & PRODUCTION LAUNCH TEST SUITE ===\n');

  const guestId = 'gst_prod_test_' + Date.now();

  // =========================================================
  // 1. Guest Creates & Edits a Real CV
  // =========================================================
  console.log('--- 1. Guest Creates and AI-Polishes CV ---');
  const initialCv = {
    title: 'Executive Operations CV',
    data: {
      personalInfo: {
        fullName: 'Mahmudul Hasan',
        jobTitle: 'Operations Lead',
        email: 'mahmud.hasan@enterprise.com',
        phone: '+880 1711 556677',
        location: 'Dhaka, Bangladesh',
        summary: 'Experienced Operations Lead with 5+ years in logistics and process optimization.',
      },
      experiences: [
        {
          id: 'exp-1',
          company: 'Transcom Group',
          role: 'Operations Supervisor',
          location: 'Dhaka, Bangladesh',
          startDate: '2021',
          endDate: 'Present',
          current: true,
          bullets: ['Supervised 25 warehouse associates.', 'Reduced delivery turnaround by 15%.'],
        },
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Dhaka',
          degree: 'BBA',
          field: 'Management',
          location: 'Dhaka, Bangladesh',
          startDate: '2016',
          endDate: '2020',
          gpa: '3.70',
        },
      ],
      skills: [
        { id: 's1', name: 'Supply Chain Operations', category: 'Technical' },
        { id: 's2', name: 'Fleet Management', category: 'Technical' },
      ],
    },
    design: {
      template: 'national-pro',
      accentColor: '#0f172a',
    },
  };

  const createRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify(initialCv),
  });
  check(createRes.ok, '1.1: Resume created via POST /api/resumes');
  const createJson = await createRes.json();
  const resumeId = createJson.resume.id;

  // AI Edits CV (Make it professional)
  const chatRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'amar CV ta professional koro',
      resumeData: initialCv.data,
      designConfig: initialCv.design,
    }),
  });
  const chatJson = await chatRes.json();
  check(Boolean(chatJson.diffPreview?.modifiedData?.personalInfo?.summary), '1.2: AI refined summary professionally');

  // Auto-save changes
  const saveRes = await fetch(`${BASE_URL}/api/resumes/${resumeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify({
      data: {
        ...initialCv.data,
        personalInfo: { ...initialCv.data.personalInfo, summary: chatJson.diffPreview.modifiedData.personalInfo.summary },
      },
    }),
  });
  check(saveRes.ok, '1.3: Auto-saved AI changes quietly');

  // =========================================================
  // 2. Unpaid Download Prevention Gate
  // =========================================================
  console.log('\n--- 2. Unpaid Download Prevention Gate ---');
  const unpaidDownloadRes = await fetch(`${BASE_URL}/api/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify({ resumeId }),
  });
  check(unpaidDownloadRes.status === 402, '2.1: Direct download on unpaid CV is strictly blocked with 402 Payment Required');

  // =========================================================
  // 3. Payment Creation & bKash Intent
  // =========================================================
  console.log('\n--- 3. Payment Creation & Fixed Price Enforcement ---');
  const payCreateRes = await fetch(`${BASE_URL}/api/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify({ resumeId }),
  });
  check(payCreateRes.ok, '3.1: Payment created successfully');
  const payCreateJson = await payCreateRes.json();
  check(payCreateJson.amount === '50.00' && payCreateJson.currency === 'BDT', '3.2: Price enforced server-side as 50.00 BDT');
  check(Boolean(payCreateJson.bkashURL), '3.3: bKash checkout URL issued');

  // =========================================================
  // 4. bKash Execution & Verification
  // =========================================================
  console.log('\n--- 4. bKash Execution & Server Verification ---');
  const payExecRes = await fetch(
    `${BASE_URL}/api/payment/execute?paymentID=${payCreateJson.paymentID}&status=success&resumeId=${resumeId}`,
    {
      headers: { 'x-guest-session-id': guestId },
      redirect: 'manual',
    }
  );
  check(
    payExecRes.status === 307 || payExecRes.status === 302 || payExecRes.status === 200,
    '4.1: Payment execution handled callback'
  );

  // Status check confirms unlocked
  const statusRes = await fetch(`${BASE_URL}/api/payment/status?resumeId=${resumeId}`, {
    headers: { 'x-guest-session-id': guestId },
  });
  const statusJson = await statusRes.json();
  check(statusJson.unlocked === true, '4.2: CV status is permanently verified as unlocked/paid');

  // =========================================================
  // 5. Authorized PDF Download
  // =========================================================
  console.log('\n--- 5. Authorized PDF Download ---');
  const paidDownloadRes = await fetch(`${BASE_URL}/api/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify({ resumeId }),
  });
  check(paidDownloadRes.status === 200, '5.1: Paid CV download succeeds with 200 OK');
  check(
    paidDownloadRes.headers.get('content-type') === 'application/pdf',
    '5.2: PDF file stream delivered in response'
  );

  // =========================================================
  // 6. Idempotency & Duplicate Safety
  // =========================================================
  console.log('\n--- 6. Idempotency & Duplicate Payment Safety ---');
  // Attempting to pay for already-paid CV returns alreadyPaid: true
  const duplicatePayRes = await fetch(`${BASE_URL}/api/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify({ resumeId }),
  });
  const duplicatePayJson = await duplicatePayRes.json();
  check(duplicatePayJson.alreadyPaid === true, '6.1: Already paid CV skips double billing (alreadyPaid: true)');

  // Duplicate callback does not crash or corrupt state
  const duplicateCallbackRes = await fetch(
    `${BASE_URL}/api/payment/execute?paymentID=${payCreateJson.paymentID}&status=success&resumeId=${resumeId}`,
    {
      headers: { 'x-guest-session-id': guestId },
      redirect: 'manual',
    }
  );
  check(
    duplicateCallbackRes.status === 307 || duplicateCallbackRes.status === 302,
    '6.2: Duplicate payment callback safely handled without errors'
  );

  // =========================================================
  // 7. Migration & Permanent Unlock Retention
  // =========================================================
  console.log('\n--- 7. User Registration Claims Paid CV ---');
  const userEmail = `paid_user_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-guest-session-id': guestId },
    body: JSON.stringify({
      email: userEmail,
      password: 'StrongPassword123!',
      fullName: 'Mahmudul Hasan',
    }),
  });
  const regJson = await regRes.json();
  const userToken = regJson.token;
  check(Boolean(userToken), '7.1: User registered successfully');

  // Authenticated user gets paid resume with is_paid = true
  const userCvRes = await fetch(`${BASE_URL}/api/resumes/${resumeId}`, {
    headers: { authorization: `Bearer ${userToken}` },
  });
  const userCvJson = await userCvRes.json();
  check(userCvJson.resume.isPaid === true, '7.2: Claimed CV retains permanent paid status under registered user account');

  console.log(`\n=== PHASE 9 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPhase9Tests().catch((err) => {
  console.error('Phase 9 test fatal error:', err);
  process.exit(1);
});
