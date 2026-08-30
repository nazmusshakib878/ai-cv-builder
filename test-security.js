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

async function runSecurityTests() {
  console.log('=== STARTING PHASE 8: PRODUCTION SECURITY HARDENING TEST SUITE ===\n');

  const guestA = 'gst_victim_' + Date.now();
  const guestB = 'gst_attacker_' + Date.now();

  // =========================================================
  // 1. Setup Initial Test Data: Create CV for Guest A
  // =========================================================
  console.log('--- 1. Guest A Creates a Confidential CV ---');
  const createRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      title: 'Confidential Executive Resume',
      data: {
        personalInfo: {
          fullName: 'Target Executive',
          email: 'executive@secretcorp.com',
          phone: '+1 (555) 999-8888',
        },
      },
      design: { template: 'executive', accentColor: '#1e293b' },
    }),
  });

  check(createRes.ok, '1.1: Target CV created under Guest A');
  const createJson = await createRes.json();
  const targetResumeId = createJson.resume.id;

  // =========================================================
  // 2. Cross-Guest Impersonation & Access Control
  // =========================================================
  console.log('\n--- 2. Cross-Guest Access & Impersonation Prevention ---');

  // 2.1 Attacker (Guest B) tries to read Guest A's CV
  const guestBReadRes = await fetch(`${BASE_URL}/api/resumes/${targetResumeId}`, {
    headers: { 'x-guest-session-id': guestB },
  });
  check(
    guestBReadRes.status === 404 || guestBReadRes.status === 403,
    '2.1: Attacker (Guest B) CANNOT read Guest A\'s CV (blocked with 404/403)'
  );

  // 2.2 Attacker tries to modify Guest A's CV
  const guestBEditRes = await fetch(`${BASE_URL}/api/resumes/${targetResumeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestB,
    },
    body: JSON.stringify({ title: 'Hacked by Guest B' }),
  });
  check(
    guestBEditRes.status === 403 || guestBEditRes.status === 404,
    '2.2: Attacker (Guest B) CANNOT modify Guest A\'s CV'
  );

  // 2.3 Attacker tries to delete Guest A's CV
  const guestBDelRes = await fetch(`${BASE_URL}/api/resumes/${targetResumeId}`, {
    method: 'DELETE',
    headers: { 'x-guest-session-id': guestB },
  });
  check(
    guestBDelRes.status === 403 || guestBDelRes.status === 404,
    '2.3: Attacker (Guest B) CANNOT delete Guest A\'s CV'
  );

  // =========================================================
  // 3. User A vs User B Multi-Tenant Isolation
  // =========================================================
  console.log('\n--- 3. Authenticated User Multi-Tenant Isolation ---');

  // Register User A
  const userARes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `usera_${Date.now()}@example.com`,
      password: 'Password123!',
      fullName: 'User Alpha',
    }),
  });
  const userAJson = await userARes.json();
  const tokenA = userAJson.token;

  // Create User A Resume
  const userACvRes = await fetch(`${BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({ title: 'User Alpha Private CV' }),
  });
  const userACvJson = await userACvRes.json();
  const userACvId = userACvJson.resume.id;

  // Register User B (Attacker)
  const userBRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `userb_${Date.now()}@example.com`,
      password: 'Password123!',
      fullName: 'User Beta',
    }),
  });
  const userBJson = await userBRes.json();
  const tokenB = userBJson.token;

  // User B tries to read User A's Resume
  const userBReadRes = await fetch(`${BASE_URL}/api/resumes/${userACvId}`, {
    headers: { authorization: `Bearer ${tokenB}` },
  });
  check(
    userBReadRes.status === 404 || userBReadRes.status === 403,
    '3.1: User B CANNOT read User A\'s private resume (404/403 blocked)'
  );

  // User B tries to update User A's Resume
  const userBUpdateRes = await fetch(`${BASE_URL}/api/resumes/${userACvId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${tokenB}`,
    },
    body: JSON.stringify({ title: 'Modified by User B' }),
  });
  check(
    userBUpdateRes.status === 403 || userBUpdateRes.status === 404,
    '3.2: User B CANNOT modify User A\'s resume'
  );

  // =========================================================
  // 4. Fake Resume ID & Safe Error Responses
  // =========================================================
  console.log('\n--- 4. Fake Resume ID & Safe Error Handling ---');
  const fakeRes = await fetch(`${BASE_URL}/api/resumes/res_fake_nonexistent_id_999`, {
    headers: { 'x-guest-session-id': guestA },
  });
  check(fakeRes.status === 404, '4.1: Non-existent resume ID safely returns 404');
  const fakeJson = await fakeRes.json();
  check(!JSON.stringify(fakeJson).includes('SELECT') && !JSON.stringify(fakeJson).includes('stack'), '4.2: No SQL or internal stack traces exposed to client');

  // =========================================================
  // 5. Payment Security & Tampering Prevention
  // =========================================================
  console.log('\n--- 5. Payment Security & Tampering Prevention ---');

  // 5.1 Client attempts to set is_paid: true via PUT /api/resumes/:id
  const tamperPutRes = await fetch(`${BASE_URL}/api/resumes/${targetResumeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      is_paid: true,
      isPaid: true,
      title: 'Hacked Paid CV',
    }),
  });
  check(tamperPutRes.ok, '5.1: PUT request handled');

  // Verify server-side is_paid was NOT modified by the client payload
  const verifyPaidStatus = await fetch(`${BASE_URL}/api/payment/status?resumeId=${targetResumeId}`, {
    headers: { 'x-guest-session-id': guestA },
  });
  const verifyPaidJson = await verifyPaidStatus.json();
  check(verifyPaidJson.unlocked === false, '5.2: Client CANNOT mark CV as paid via API tampering (is_paid remains false)');

  // 5.3 Attempt direct PDF download on unpaid CV
  const directDownloadRes = await fetch(`${BASE_URL}/api/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({ resumeId: targetResumeId }),
  });
  check(
    directDownloadRes.status === 402 || directDownloadRes.status === 403,
    '5.3: Direct PDF download on unpaid CV is BLOCKED with 402 Payment Required'
  );

  // =========================================================
  // 6. Guest Session Migration & Old Session Invalidation
  // =========================================================
  console.log('\n--- 6. Guest Migration & Old Session Revocation ---');

  // Guest A registers an account -> targetResumeId is claimed by user
  const guestRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestA,
    },
    body: JSON.stringify({
      email: `target_exec_${Date.now()}@example.com`,
      password: 'SecurePassword123!',
      fullName: 'Target Executive',
    }),
  });
  const guestRegJson = await guestRegRes.json();
  const targetUserToken = guestRegJson.token;
  check(Boolean(targetUserToken), '6.1: Guest A successfully registered and claimed CV');

  // Old Guest session (guestA) can NO LONGER access the migrated CV
  const oldGuestAccessRes = await fetch(`${BASE_URL}/api/resumes/${targetResumeId}`, {
    headers: { 'x-guest-session-id': guestA },
  });
  check(
    oldGuestAccessRes.status === 404 || oldGuestAccessRes.status === 403,
    '6.2: Old guest session CANNOT access the CV after migration to registered account'
  );

  // Authenticated user CAN access the CV
  const userAccessRes = await fetch(`${BASE_URL}/api/resumes/${targetResumeId}`, {
    headers: { authorization: `Bearer ${targetUserToken}` },
  });
  check(userAccessRes.ok, '6.3: Registered user can securely access their claimed CV');

  // =========================================================
  // 7. Input Validation & Abuse Protection
  // =========================================================
  console.log('\n--- 7. Input Validation & Abuse Protection ---');

  // 7.1 Oversized prompt protection (>4000 chars)
  const oversizedPrompt = 'a'.repeat(5000);
  const oversizedChatRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: oversizedPrompt }),
  });
  check(oversizedChatRes.status === 400, '7.1: Oversized chat prompt (>4000 chars) rejected with 400 Bad Request');

  // 7.2 Invalid email format in registration
  const invalidEmailRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: '123' }),
  });
  check(invalidEmailRes.status === 400, '7.2: Invalid email rejected with 400 Bad Request');

  // 7.3 Short password rejected
  const shortPassRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `valid_${Date.now()}@example.com`, password: '123' }),
  });
  check(shortPassRes.status === 400, '7.3: Short password (<6 chars) rejected with 400 Bad Request');

  console.log(`\n=== PHASE 8 SECURITY TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error('Security test runner fatal error:', err);
  process.exit(1);
});
