import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/utils/authServer';
import { db } from '@/utils/supabase/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    
    if (session.userId) {
      const user = await db.findUserById(session.userId);
      if (user) {
        return NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
          },
          isGuest: false,
        });
      }
    }

    return NextResponse.json({
      user: null,
      isGuest: true,
      guestSessionId: session.guestSessionId,
    });
  } catch (error: any) {
    return NextResponse.json({ user: null, isGuest: true });
  }
}
