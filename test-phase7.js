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

async function runPhase7Tests() {
  console.log('=== STARTING PHASE 7: PERSISTENT CV SAVING & SESSIONS TEST SUITE ===\n');

  const guestA = 'guest_alice_' + Date.now();
  const guestB = 'guest_bob_' + Date.now();

  // =========================================================
  // TEST SUITE 1: Guest CV Creation, Auto-Save & Restoration
  // =========================================================
  console.log('--- TEST SUITE 1: Guest CV Creation, Auto-Save & Restoration ---');
  
  // 1.1 Create CV for Guest A
  const createRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      title: 'Marketing Specialist CV',
      data: {
        id: 'res_marketing',
        title: 'Marketing Specialist CV',
        updatedAt: 'Just now',
        personalInfo: {
          fullName: 'Alice Walker',
          jobTitle: 'Digital Marketing Strategist',
          email: 'alice@example.com',
          phone: '+1 555-0199',
          location: 'New York, NY',
          summary: 'Experienced marketing strategist driving growth.',
        },
        experiences: [
          {
            id: 'exp-1',
            company: 'Acme Growth Co',
            role: 'Lead Strategist',
            location: 'NY',
            startDate: '2022',
            endDate: 'Present',
            current: true,
            bullets: ['Scaled revenue by 45% through targeted omnichannel campaigns.'],
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'NYU Stern',
            degree: 'B.S. in Marketing',
            field: 'Business',
            location: 'NY',
            startDate: '2018',
            endDate: '2022',
            gpa: '3.9',
          },
        ],
        skills: [{ id: 'sk-1', name: 'SEO & Growth Marketing', category: 'Technical' }],
        projects: [],
        certifications: [],
        languages: [{ id: 'l-1', language: 'English', proficiency: 'Native' }],
        awards: [],
      },
      design: {
        template: 'modern-pro',
        accentColor: '#2563eb',
        fontFamily: 'jakarta',
        fontSize: 'md',
        sectionSpacing: 'comfortable',
        lineSpacing: 'normal',
        onePageMode: false,
        showDividers: true,
        bulletStyle: 'disc',
        sectionOrder: ['summary', 'experience', 'education', 'skills'],
      },
    }),
  });

  check(createRes.ok, '1.1: Resume created successfully via POST /api/resumes');
  const createJson = await createRes.json();
  const resumeAId = createJson.resume.id;
  check(Boolean(resumeAId), '1.1: Resume returned valid ID');

  // 1.2 Auto-Save with Chat Messages & Version History
  const autoSaveRes = await fetch(`${BASE_URL}/api/resumes/${resumeAId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      title: 'Marketing Lead CV (Updated)',
      chat_messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'amar CV ta professional koro',
          timestamp: 'Just now',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Done — আপনার CV-র Summary এবং প্রেজেন্টেশন আরও Professional করা হয়েছে।',
          timestamp: 'Just now',
          suggestedActions: ['Experience ta aro strong koro', 'CV ta one page koro'],
        },
      ],
      version_history: [
        {
          id: 'v-1',
          description: 'Added Marketing Experience',
          data: createJson.resume.data,
          design: createJson.resume.design,
        },
      ],
    }),
  });

  check(autoSaveRes.ok, '1.2: Auto-save PUT /api/resumes/:id succeeded');
  const autoSaveJson = await autoSaveRes.json();
  check(autoSaveJson.status === 'saved', '1.2: Status is "saved"');

  // 1.3 Fetch back after simulated reload
  const getRes = await fetch(`${BASE_URL}/api/resumes/${resumeAId}`, {
    headers: { 'x-guest-session-id': guestA },
  });
  check(getRes.ok, '1.3: GET /api/resumes/:id retrieved resume after reload');
  const getJson = await getRes.json();
  const fetchedResume = getJson.resume;

  check(fetchedResume.title === 'Marketing Lead CV (Updated)', '1.3: Updated title persisted');
  check(fetchedResume.data.personalInfo.fullName === 'Alice Walker', '1.3: Personal Info persisted');
  check(fetchedResume.design.template === 'modern-pro', '1.3: Design template persisted');
  check(fetchedResume.chatMessages && fetchedResume.chatMessages.length === 2, '1.3: Chat history persisted (2 messages)');
  check(fetchedResume.chatMessages[0].content === 'amar CV ta professional koro', '1.3: User chat message restored');
  check(fetchedResume.versionHistory && fetchedResume.versionHistory.length > 0, '1.3: Version history persisted');

  // =========================================================
  // TEST SUITE 2: Multiple CVs ("My CVs") Management
  // =========================================================
  console.log('\n--- TEST SUITE 2: Multiple CVs ("My CVs") Management ---');

  // 2.1 Create 2nd CV for Guest A: "Quality Controller CV"
  const create2Res = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      title: 'Quality Controller CV',
      design: { template: 'corporate', accentColor: '#1e293b' },
    }),
  });
  const resume2Json = await create2Res.json();
  const resume2Id = resume2Json.resume.id;
  check(Boolean(resume2Id), '2.1: Created second CV "Quality Controller CV"');

  // 2.2 Create 3rd CV for Guest A: "Medical Officer CV"
  const create3Res = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      title: 'Medical Officer CV',
      design: { template: 'healthcare', accentColor: '#059669' },
    }),
  });
  const resume3Json = await create3Res.json();
  const resume3Id = resume3Json.resume.id;
  check(Boolean(resume3Id), '2.2: Created third CV "Medical Officer CV"');

  // 2.3 List all CVs for Guest A
  const listRes = await fetch(`${BASE_URL}/api/resumes`, {
    headers: { 'x-guest-session-id': guestA },
  });
  const listJson = await listRes.json();
  check(listJson.resumes && listJson.resumes.length === 3, '2.3: "My CVs" lists all 3 resumes');

  // 2.4 Verify each CV preserves its distinct template
  const titles = listJson.resumes.map((r) => r.title);
  check(titles.includes('Marketing Lead CV (Updated)'), '2.4: Marketing CV in list');
  check(titles.includes('Quality Controller CV'), '2.4: Quality Controller CV in list');
  check(titles.includes('Medical Officer CV'), '2.4: Medical Officer CV in list');

  // 2.5 Delete 3rd CV
  const delRes = await fetch(`${BASE_URL}/api/resumes/${resume3Id}`, {
    method: 'DELETE',
    headers: { 'x-guest-session-id': guestA },
  });
  check(delRes.ok, '2.5: Successfully deleted 3rd CV');

  const listAfterDel = await fetch(`${BASE_URL}/api/resumes`, {
    headers: { 'x-guest-session-id': guestA },
  });
  const listAfterDelJson = await listAfterDel.json();
  check(listAfterDelJson.resumes.length === 2, '2.5: Resumes count updated to 2');

  // =========================================================
  // TEST SUITE 3: Security & Multi-Tenant Isolation
  // =========================================================
  console.log('\n--- TEST SUITE 3: Security & Multi-Tenant Isolation ---');

  // 3.1 Guest B tries to access Guest A's resume
  const unauthGetRes = await fetch(`${BASE_URL}/api/resumes/${resumeAId}`, {
    headers: { 'x-guest-session-id': guestB },
  });
  check(unauthGetRes.status === 404 || unauthGetRes.status === 403, '3.1: Guest B CANNOT view Guest A\'s resume (403/404 blocked)');

  // 3.2 Guest B tries to modify Guest A's resume
  const unauthPutRes = await fetch(`${BASE_URL}/api/resumes/${resumeAId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestB,
    },
    body: JSON.stringify({ title: 'Hacked Title' }),
  });
  check(unauthPutRes.status === 403 || unauthPutRes.status === 404, '3.2: Guest B CANNOT modify Guest A\'s resume (Forbidden)');

  // 3.3 Guest B list shows 0 resumes (isolated)
  const listGuestB = await fetch(`${BASE_URL}/api/resumes`, {
    headers: { 'x-guest-session-id': guestB },
  });
  const listGuestBJson = await listGuestB.json();
  check(listGuestBJson.resumes.length === 0, '3.3: Guest B sees empty isolated resume list');

  // =========================================================
  // TEST SUITE 4: User Registration & Guest CV Migration
  // =========================================================
  console.log('\n--- TEST SUITE 4: User Registration & Guest CV Migration ---');

  const userEmail = `alice_${Date.now()}@example.com`;
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      email: userEmail,
      password: 'SecurePassword123!',
      fullName: 'Alice Walker',
    }),
  });

  check(registerRes.ok, '4.1: User registered successfully');
  const registerJson = await registerRes.json();
  const authToken = registerJson.token;
  check(Boolean(authToken), '4.1: JWT Auth token issued');

  // 4.2 Check that user now owns the CVs previously created as guest
  const userListRes = await fetch(`${BASE_URL}/api/resumes`, {
    headers: { authorization: `Bearer ${authToken}` },
  });
  const userListJson = await userListRes.json();
  check(userListJson.resumes.length === 2, '4.2: User automatically inherited all guest CVs upon registration');

  // 4.3 Verify user can access resume using token without guest ID
  const userGetRes = await fetch(`${BASE_URL}/api/resumes/${resumeAId}`, {
    headers: { authorization: `Bearer ${authToken}` },
  });
  check(userGetRes.ok, '4.3: Authenticated user can fetch their claimed resume');

  // =========================================================
  // TEST SUITE 5: Payment Unlock Persistence per Resume
  // =========================================================
  console.log('\n--- TEST SUITE 5: Payment Unlock Persistence per Resume ---');

  // 5.1 Check initial status -> unlocked = false
  const payStatus1 = await fetch(`${BASE_URL}/api/payment/status?resumeId=${resumeAId}`, {
    headers: { authorization: `Bearer ${authToken}` },
  });
  const payStatus1Json = await payStatus1.json();
  check(payStatus1Json.unlocked === false, '5.1: Resume starts as unpaid / locked');

  // 5.2 Simulate Payment Execution for this specific resume
  const payExec = await fetch(`${BASE_URL}/api/payment/execute?paymentID=TRX-TEST-123&status=success&resumeId=${resumeAId}`, {
    headers: { authorization: `Bearer ${authToken}` },
    redirect: 'manual',
  });
  check(payExec.status === 307 || payExec.status === 302, '5.2: Payment execute processed redirect');

  // 5.3 Verify status is now unlocked for this resume
  const payStatus2 = await fetch(`${BASE_URL}/api/payment/status?resumeId=${resumeAId}`, {
    headers: { authorization: `Bearer ${authToken}` },
  });
  const payStatus2Json = await payStatus2.json();
  check(payStatus2Json.unlocked === true, '5.3: Resume is now permanently unlocked as PAID');

  // 5.4 Verify second resume is still free/unlocked = false (isolated per CV)
  const payStatusResume2 = await fetch(`${BASE_URL}/api/payment/status?resumeId=${resume2Id}`, {
    headers: { authorization: `Bearer ${authToken}` },
  });
  const payStatusResume2Json = await payStatusResume2.json();
  check(payStatusResume2Json.unlocked === false, '5.4: Payment unlock is strictly tied per CV (other CV is still free)');

  console.log(`\n=== PHASE 7 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPhase7Tests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
