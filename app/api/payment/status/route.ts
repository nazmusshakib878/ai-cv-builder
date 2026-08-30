import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from '@/utils/authServer';
import { db } from '@/utils/supabase/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('resumeId');
    const session = await getServerSession(req);

    if (resumeId) {
      const resume = await db.getResume(resumeId, session.userId, session.guestSessionId);
      if (resume && resume.is_paid) {
        return NextResponse.json({ unlocked: true });
      }
    }

    return NextResponse.json({ unlocked: false });
  } catch (error) {
    return NextResponse.json({ unlocked: false });
  }
}
