import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/supabase/db';
import { getServerSession, attachSessionCookies } from '@/utils/authServer';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/resumes/[id] — Fetch single resume with complete data, design, versions & chat history
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const session = await getServerSession(req);

    const resume = await db.getResume(id, session.userId, session.guestSessionId);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found or you do not have permission to access it.' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      resume: {
        id: resume.id,
        title: resume.title,
        data: resume.data,
        design: resume.design,
        isPaid: resume.is_paid,
        versionHistory: resume.version_history || [],
        chatMessages: resume.chat_messages || [],
        updatedAt: resume.updated_at,
        createdAt: resume.created_at,
      },
    });
    return attachSessionCookies(response, session);
  } catch (error: any) {
    console.error('Get Resume Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch resume' }, { status: 500 });
  }
}

/**
 * PUT /api/resumes/[id] — Auto-save resume changes quietly
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const session = await getServerSession(req);
    const body = await req.json();

    // Security: strip dangerous fields from client payload
    const sanitizedBody = {
      title: body.title,
      data: body.data,
      design: body.design,
      version_history: body.version_history,
      chat_messages: body.chat_messages,
    };

    const updated = await db.updateResume(id, sanitizedBody, session.userId, session.guestSessionId);

    if (!updated) {
      return NextResponse.json(
        { error: 'Unauthorized to update this resume or resume not found.' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      status: 'saved',
      updatedAt: updated.updated_at,
    });
    return attachSessionCookies(response, session);
  } catch (error: any) {
    console.error('Update Resume Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update resume' }, { status: 500 });
  }
}

/**
 * DELETE /api/resumes/[id] — Delete resume
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const session = await getServerSession(req);

    const success = await db.deleteResume(id, session.userId, session.guestSessionId);

    if (!success) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this resume or resume not found.' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true, message: 'Resume deleted successfully' });
    return attachSessionCookies(response, session);
  } catch (error: any) {
    console.error('Delete Resume Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete resume' }, { status: 500 });
  }
}
