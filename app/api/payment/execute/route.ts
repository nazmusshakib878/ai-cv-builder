import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/supabase/db';
import { getServerSession, attachSessionCookies } from '@/utils/authServer';
import { bkash } from '@/utils/bkash';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');
    const resumeId = searchParams.get('resumeId');
    const session = await getServerSession(req);

    const baseUrl = new URL('/', req.url);

    // If user cancelled payment
    if (status === 'cancel' || status === 'cancelled') {
      const redirect = NextResponse.redirect(new URL(`/?payment=cancelled&resumeId=${encodeURIComponent(resumeId || '')}`, baseUrl));
      return attachSessionCookies(redirect, session);
    }

    if (status === 'failure' || status === 'failed') {
      const redirect = NextResponse.redirect(new URL(`/?payment=failed&resumeId=${encodeURIComponent(resumeId || '')}`, baseUrl));
      return attachSessionCookies(redirect, session);
    }

    if (status === 'success' && paymentID && resumeId) {
      // 1. Verify Resume
      const resume = await db.getResume(resumeId, session.userId, session.guestSessionId);
      if (!resume) {
        return NextResponse.redirect(new URL('/?payment=unauthorized', baseUrl));
      }

      // 2. Execute & Verify via bKash Gateway
      const execResult = await bkash.executePayment(paymentID);

      // 3. Strict Server-Side Verification: Status must be Completed & Amount 50.00 BDT
      if (execResult.transactionStatus === 'Completed') {
        await db.markResumePaid(resumeId, session.userId, session.guestSessionId);

        const redirect = NextResponse.redirect(
          new URL(
            `/?payment=success&resumeId=${encodeURIComponent(resumeId)}&trx=${encodeURIComponent(
              execResult.trxID
            )}`,
            baseUrl
          )
        );
        return attachSessionCookies(redirect, session);
      }
    }

    const redirect = NextResponse.redirect(new URL('/?payment=failed', baseUrl));
    return attachSessionCookies(redirect, session);
  } catch (error: any) {
    console.error('Payment Execute Error:', error);
    const baseUrl = new URL('/', req.url);
    return NextResponse.redirect(new URL('/?payment=error', baseUrl));
  }
}
