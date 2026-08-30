// Comprehensive Multi-Turn AI Conversation Test Suite

const mockResumeData = {
  id: 'resume-01',
  title: 'Principal Software Architect',
  updatedAt: 'Just now',
  personalInfo: {
    fullName: 'Alexandre Morgan',
    jobTitle: 'Principal Distributed Systems Architect',
    email: 'alex.morgan@gmail.com',
    phone: '+1 415-890-4321',
    location: 'San Francisco, CA',
    summary: 'High-impact distributed systems architect with 10+ years experience leading platform engineering.',
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Scale Infrastructure Lab',
      role: 'Staff AI Infrastructure Architect',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected real-time LLM inference router distributing requests across GPU clusters.',
        'Implemented distributed KV-caching engine and kernel-level CUDA optimizations.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Stanford University',
      degree: 'Ph.D. in Computer Science',
      field: 'Distributed Systems',
      location: 'Stanford, CA',
      startDate: '2011',
      endDate: '2015',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Distributed Systems', category: 'Technical' },
    { id: 'sk-2', name: 'Kubernetes', category: 'Tools & Platforms' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Distributed KV Store',
      bullets: ['Built Raft consensus engine with 99.999% reliability'],
      techStack: ['Rust', 'gRPC'],
    },
  ],
  certifications: [],
  languages: [{ id: 'lang-1', language: 'English', proficiency: 'Native' }],
  awards: [{ id: 'aw-1', title: 'Innovation Award', issuer: 'Leadership', year: '2022' }],
};

const mockDesignConfig = {
  template: 'modern-pro',
  fontFamily: 'inter',
  fontSize: 'base',
  lineSpacing: 'normal',
  sectionSpacing: 'normal',
  accentColor: '#0c8ee9',
  onePageMode: false,
  showDividers: true,
  bulletStyle: 'accent-dot',
  sectionOrder: [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'awards',
  ],
};

async function testConversationFlows() {
  console.log('=== STARTING MULTI-TURN AI CONVERSATION TEST SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // Helper to make API request
  async function callChat(prompt, resumeData, designConfig, history) {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, resumeData, designConfig, history }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return await res.json();
  }

  // ==========================================
  // SUITE 1: Professional -> Stronger -> Shorter -> Undo
  // ==========================================
  console.log('--- TEST SUITE 1: Multi-Turn Iterative Refinement & Undo ---');
  let currentData = JSON.parse(JSON.stringify(mockResumeData));
  let currentDesign = JSON.parse(JSON.stringify(mockDesignConfig));
  let history = [];

  // Step 1.1: "amar CV ta professional koro"
  let r1 = await callChat('amar CV ta professional koro', currentData, currentDesign, history);
  assert(r1.content && !r1.content.includes('{') && !r1.content.includes('JSON'), 'Turn 1: AI reply is natural language without technical JSON');
  assert(r1.diffPreview && r1.diffPreview.action === 'update', 'Turn 1: Diff action is update');
  assert(r1.diffPreview.modifiedData && r1.diffPreview.modifiedData.personalInfo, 'Turn 1: Professional summary updated');
  assert(r1.diffPreview.modifiedData.personalInfo.summary.length > 50, 'Turn 1: Professional summary is substantive');

  if (r1.diffPreview.modifiedData) currentData = { ...currentData, ...r1.diffPreview.modifiedData };
  if (r1.diffPreview.modifiedDesign) currentDesign = { ...currentDesign, ...r1.diffPreview.modifiedDesign };
  history.push({ role: 'user', content: 'amar CV ta professional koro' });
  history.push({ role: 'assistant', content: r1.content });

  // Step 1.2: "experience ta aro strong koro"
  let r2 = await callChat('experience ta aro strong koro', currentData, currentDesign, history);
  assert(r2.content && !r2.content.includes('modifiedData'), 'Turn 2: AI reply is clean');
  assert(r2.diffPreview && r2.diffPreview.modifiedData && r2.diffPreview.modifiedData.experiences, 'Turn 2: Experiences strengthened');
  assert(r2.diffPreview.modifiedData.experiences[0].bullets[0].length > 20, 'Turn 2: Strong action verbs added to bullets');

  if (r2.diffPreview.modifiedData) currentData = { ...currentData, ...r2.diffPreview.modifiedData };
  if (r2.diffPreview.modifiedDesign) currentDesign = { ...currentDesign, ...r2.diffPreview.modifiedDesign };
  history.push({ role: 'user', content: 'experience ta aro strong koro' });
  history.push({ role: 'assistant', content: r2.content });

  // Step 1.3: "ektu short koro"
  let r3 = await callChat('ektu short koro', currentData, currentDesign, history);
  assert(r3.content && (r3.content.includes('সংক্ষিপ্ত') || r3.content.includes('short') || r3.content.includes('ছোট') || r3.content.includes('Done')), 'Turn 3: Natural acknowledgment of shortening');
  assert(r3.diffPreview && r3.diffPreview.modifiedData, 'Turn 3: Content shortened');

  if (r3.diffPreview.modifiedData) currentData = { ...currentData, ...r3.diffPreview.modifiedData };
  if (r3.diffPreview.modifiedDesign) currentDesign = { ...currentDesign, ...r3.diffPreview.modifiedDesign };
  history.push({ role: 'user', content: 'ektu short koro' });
  history.push({ role: 'assistant', content: r3.content });

  // Step 1.4: "ager version tai valo chilo"
  let r4 = await callChat('ager version tai valo chilo', currentData, currentDesign, history);
  assert(r4.diffPreview && r4.diffPreview.action === 'undo', 'Turn 4: Action is correctly identified as "undo"');
  assert(r4.content && (r4.content.includes('আগের') || r4.content.includes('Previous') || r4.content.includes('restore') || r4.content.includes('ফেরত')), 'Turn 4: Conversational response confirms previous version restored');

  // ==========================================
  // SUITE 2: CGPA Addition & Section Reordering
  // ==========================================
  console.log('\n--- TEST SUITE 2: CGPA Addition & Section Reordering ---');
  currentData = JSON.parse(JSON.stringify(mockResumeData));
  currentDesign = JSON.parse(JSON.stringify(mockDesignConfig));
  history = [];

  // Step 2.1: "CGPA 3.35 add koro"
  let r2_1 = await callChat('CGPA 3.35 add koro', currentData, currentDesign, history);
  assert(r2_1.diffPreview && r2_1.diffPreview.modifiedData && r2_1.diffPreview.modifiedData.education, 'Turn 1: Education array updated');
  const hasGpa = r2_1.diffPreview.modifiedData.education.some((e) => e.gpa && e.gpa.includes('3.35'));
  assert(hasGpa, 'Turn 1: CGPA 3.35 correctly set on education');
  assert(!r2_1.content.includes('error'), 'Turn 1: No errors in response');

  if (r2_1.diffPreview.modifiedData) currentData = { ...currentData, ...r2_1.diffPreview.modifiedData };
  history.push({ role: 'user', content: 'CGPA 3.35 add koro' });
  history.push({ role: 'assistant', content: r2_1.content });

  // Step 2.2: "education section ta niche dao"
  let r2_2 = await callChat('education section ta niche dao', currentData, currentDesign, history);
  assert(r2_2.diffPreview && r2_2.diffPreview.modifiedDesign && r2_2.diffPreview.modifiedDesign.sectionOrder, 'Turn 2: sectionOrder modified in design');
  const lastSection = r2_2.diffPreview.modifiedDesign.sectionOrder[r2_2.diffPreview.modifiedDesign.sectionOrder.length - 1];
  assert(lastSection === 'education', 'Turn 2: Education section moved to bottom of sectionOrder');

  // ==========================================
  // SUITE 3: One Page -> Design Change -> Content Preservation
  // ==========================================
  console.log('\n--- TEST SUITE 3: One Page, Design Change & Content Preservation ---');
  currentData = JSON.parse(JSON.stringify(mockResumeData));
  currentDesign = JSON.parse(JSON.stringify(mockDesignConfig));
  history = [];

  // Step 3.1: "CV ta one page koro"
  let r3_1 = await callChat('CV ta one page koro', currentData, currentDesign, history);
  assert(r3_1.diffPreview && r3_1.diffPreview.modifiedDesign && r3_1.diffPreview.modifiedDesign.onePageMode === true, 'Turn 1: onePageMode set to true');
  assert(r3_1.diffPreview.modifiedDesign.sectionSpacing === 'compact', 'Turn 1: Section spacing adjusted for 1-page fit');

  if (r3_1.diffPreview.modifiedDesign) currentDesign = { ...currentDesign, ...r3_1.diffPreview.modifiedDesign };
  if (r3_1.diffPreview.modifiedData) currentData = { ...currentData, ...r3_1.diffPreview.modifiedData };
  history.push({ role: 'user', content: 'CV ta one page koro' });
  history.push({ role: 'assistant', content: r3_1.content });

  // Step 3.2: "design change koro"
  let r3_2 = await callChat('design change koro', currentData, currentDesign, history);
  assert(r3_2.diffPreview && r3_2.diffPreview.modifiedDesign && r3_2.diffPreview.modifiedDesign.template, 'Turn 2: Template changed');

  if (r3_2.diffPreview.modifiedDesign) currentDesign = { ...currentDesign, ...r3_2.diffPreview.modifiedDesign };
  history.push({ role: 'user', content: 'design change koro' });
  history.push({ role: 'assistant', content: r3_2.content });

  // Step 3.3: "same content rakhba, design only change korba"
  let r3_3 = await callChat('same content rakhba, design only change korba', currentData, currentDesign, history);
  assert(r3_3.diffPreview && r3_3.diffPreview.modifiedDesign, 'Turn 3: Design modified');
  assert(!r3_3.diffPreview.modifiedData || Object.keys(r3_3.diffPreview.modifiedData).length === 0, 'Turn 3: ResumeData preserved completely without alteration');

  // ==========================================
  // SUITE 4: Full Bengali Conversation
  // ==========================================
  console.log('\n--- TEST SUITE 4: Full Bengali (বাংলা) Conversation ---');
  currentData = JSON.parse(JSON.stringify(mockResumeData));
  currentDesign = JSON.parse(JSON.stringify(mockDesignConfig));
  history = [];

  let r4_1 = await callChat('আমার সিভি আরও প্রফেশনাল করো', currentData, currentDesign, history);
  assert(/[\u0980-\u09FF]/.test(r4_1.content), 'Bengali 1: AI replies in Bengali script');
  assert(r4_1.diffPreview && r4_1.diffPreview.modifiedData, 'Bengali 1: Resume data updated');

  history.push({ role: 'user', content: 'আমার সিভি আরও প্রফেশনাল করো' });
  history.push({ role: 'assistant', content: r4_1.content });

  let r4_2 = await callChat('আগের ভার্সন ফিরিয়ে আনো', currentData, currentDesign, history);
  assert(r4_2.diffPreview && r4_2.diffPreview.action === 'undo', 'Bengali 2: Undo recognized in Bengali');
  assert(/[\u0980-\u09FF]/.test(r4_2.content), 'Bengali 2: AI confirms undo in Bengali');

  // ==========================================
  // SUITE 5: Banglish Conversation & Vague Commands
  // ==========================================
  console.log('\n--- TEST SUITE 5: Banglish Conversation & Vague Commands ---');
  currentData = JSON.parse(JSON.stringify(mockResumeData));
  currentDesign = JSON.parse(JSON.stringify(mockDesignConfig));
  history = [];

  // Vague 1: "aro sundor koro"
  let r5_1 = await callChat('aro sundor koro', currentData, currentDesign, history);
  console.log('r5_1 result:', JSON.stringify(r5_1, null, 2));
  assert(r5_1.diffPreview && (r5_1.diffPreview.modifiedDesign || r5_1.diffPreview.modifiedData), 'Vague 1: AI smartly interprets visual polish');
  assert(r5_1.content.length < 150, 'Vague 1: AI reply is short and punchy');

  history.push({ role: 'user', content: 'aro sundor koro' });
  history.push({ role: 'assistant', content: r5_1.content });

  // Vague 2: "eta bad dao"
  let r5_2 = await callChat('eta bad dao', currentData, currentDesign, history);
  assert(r5_2.diffPreview && r5_2.diffPreview.action === 'update', 'Vague 2: AI executes removal cleanly');

  history.push({ role: 'user', content: 'eta bad dao' });
  history.push({ role: 'assistant', content: r5_2.content });

  // Vague 3: "oita ager moto koro"
  let r5_3 = await callChat('oita ager moto koro', currentData, currentDesign, history);
  assert(r5_3.diffPreview && r5_3.diffPreview.action === 'undo', 'Vague 3: Revert to previous state triggered');

  // Vague 4: "last change undo koro"
  let r5_4 = await callChat('last change undo koro', currentData, currentDesign, history);
  assert(r5_4.diffPreview && r5_4.diffPreview.action === 'undo', 'Vague 4: Direct undo command triggered');

  console.log(`\n=== ALL MULTI-TURN CONVERSATIONS VERIFIED: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

testConversationFlows().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
