-- =========================================================
-- Resumate AI — PostgreSQL & Supabase Production Schema
-- Safe, Idempotent & Re-runnable Migration Script
-- =========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_session_id TEXT,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  design JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESUME VERSIONS (Undo/Redo & Version History)
CREATE TABLE IF NOT EXISTS resume_versions (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  description TEXT NOT NULL DEFAULT 'Snapshot',
  data JSONB NOT NULL,
  design JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CHAT MESSAGES TABLE (AI Multi-Turn History per CV)
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  diff_preview JSONB,
  suggested_actions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS TABLE (Linked strictly to specific Resume)
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_session_id TEXT,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
  currency TEXT NOT NULL DEFAULT 'BDT',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'bKash',
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE & SECURITY
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_guest_session_id ON resumes(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_resume_id ON chat_messages(resume_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_payments_resume_id ON payments(resume_id);

-- =========================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =========================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- IDEMPOTENT ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- 1. Resumes Policy
DROP POLICY IF EXISTS "Users can access their own resumes" ON resumes;
CREATE POLICY "Users can access their own resumes"
ON resumes FOR ALL
USING (
  auth.uid() = user_id 
  OR (guest_session_id IS NOT NULL AND guest_session_id = current_setting('request.headers', true)::json->>'x-guest-session-id')
);

-- 2. Resume Versions Policy
DROP POLICY IF EXISTS "Users can access versions of their resumes" ON resume_versions;
CREATE POLICY "Users can access versions of their resumes"
ON resume_versions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM resumes 
    WHERE resumes.id = resume_versions.resume_id 
    AND (
      resumes.user_id = auth.uid() 
      OR (resumes.guest_session_id IS NOT NULL AND resumes.guest_session_id = current_setting('request.headers', true)::json->>'x-guest-session-id')
    )
  )
);

-- 3. Chat Messages Policy
DROP POLICY IF EXISTS "Users can access chat messages of their resumes" ON chat_messages;
CREATE POLICY "Users can access chat messages of their resumes"
ON chat_messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM resumes 
    WHERE resumes.id = chat_messages.resume_id 
    AND (
      resumes.user_id = auth.uid() 
      OR (resumes.guest_session_id IS NOT NULL AND resumes.guest_session_id = current_setting('request.headers', true)::json->>'x-guest-session-id')
    )
  )
);

-- 4. Payments Policy
DROP POLICY IF EXISTS "Users can view payments for their resumes" ON payments;
CREATE POLICY "Users can view payments for their resumes"
ON payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM resumes 
    WHERE resumes.id = payments.resume_id 
    AND (
      resumes.user_id = auth.uid() 
      OR (resumes.guest_session_id IS NOT NULL AND resumes.guest_session_id = current_setting('request.headers', true)::json->>'x-guest-session-id')
    )
  )
);
