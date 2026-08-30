import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/supabase/db';
import { getServerSession, attachSessionCookies } from '@/utils/authServer';

export const runtime = 'nodejs';

/**
 * GET /api/resumes — List all resumes for current user / guest
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    const resumes = await db.listResumes(session.userId, session.guestSessionId);

    const summaryList = resumes.map((r) => ({
      id: r.id,
      title: r.title,
      isPaid: r.is_paid,
      template: r.design?.template || 'modern-pro',
      updatedAt: r.updated_at,
      createdAt: r.created_at,
    }));

    const response = NextResponse.json({ resumes: summaryList });
    return attachSessionCookies(response, session);
  } catch (error: any) {
    console.error('List Resumes Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to list resumes' }, { status: 500 });
  }
}

/**
 * POST /api/resumes — Create a new resume
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    const body = await req.json().catch(() => ({}));

    // Discard any illegal client attributes
    const { id, title, data, design } = body;

    const newResume = await db.createResume({ id, title, data, design }, session.userId, session.guestSessionId);

    const response = NextResponse.json({
      resume: newResume,
      message: 'Resume created successfully',
    });
    return attachSessionCookies(response, session);
  } catch (error: any) {
    console.error('Create Resume Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create resume' }, { status: 500 });
  }
}
