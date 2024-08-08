import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { respond401 } from '@utils/auth/respond401';
import { subscribeToUserPlan } from '@utils/plans/subscribeToUserPlan';
import { getStripeClient } from '@utils/stripe/getStripeClient';
import * as Sentry from '@sentry/node';

export async function POST(req: Request) {
  try {
    const user = await getCachedSession();
    if (!user?.user?.id) return respond401();

    const { sessionId } = await req.json();

    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw Error('Session not found');
    if (!session.subscription) throw Error('Subscription ID not found in session');
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    if (!subscription) throw Error('Subscription not found');

    if (!subscription.metadata.planId) throw Error('Plan ID not found in subscription');

    const renewalDate = new Date(subscription.current_period_end * 1000);
    await subscribeToUserPlan({
      user: user.user,
      planId: Number(subscription.metadata.planId),
      renewalDate,
      stripeSubscriptionId: subscription.id
    });
  } catch (err: any) {
    Sentry.setTag('errorType', 'subscription');
    Sentry.captureException(err);
    return NextResponse.json({ error: err.message });
  }

  return NextResponse.json({ success: true });
}
