import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, attachSessionCookies } from '@/utils/authServer';
import { db } from '@/utils/supabase/db';
import { bkash } from '@/utils/bkash';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    const body = await req.json().catch(() => ({}));
    const { resumeId } = body;

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Missing resumeId for payment initialization' },
        { status: 400 }
      );
    }

    // 1. Verify Resume Ownership & Existence
    const resume = await db.getResume(resumeId, session.userId, session.guestSessionId);
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found or unauthorized' },
        { status: 404 }
      );
    }

    // 2. Prevent Double Payment (Idempotency)
    if (resume.is_paid) {
      const response = NextResponse.json({
        alreadyPaid: true,
        unlocked: true,
        message: 'This CV is already unlocked and paid for.',
      });
      return attachSessionCookies(response, session);
    }

    // 3. Construct Callback URL
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const callbackUrl = `${protocol}://${host}/api/payment/execute`;

    // 4. Initialize bKash Payment (Fixed 50 BDT)
    const paymentResult = await bkash.createPayment(resumeId, callbackUrl);

    const response = NextResponse.json({
      success: true,
      bkashURL: paymentResult.bkashURL,
      paymentID: paymentResult.paymentID,
      amount: '50.00',
      currency: 'BDT',
    });

    return attachSessionCookies(response, session);
  } catch (error: any) {
    console.error('Payment Create Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize bKash checkout' },
      { status: 500 }
    );
  }
}
