import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';

import { respond401 } from '@utils/auth/respond401';
import { getStripeClient } from '@utils/stripe/getStripeClient';

export async function GET(req: Request) {
  const user = await getCachedSession();
  if (!user?.user?.id) return respond401();

  const plans = await prisma.plan.findMany({
    orderBy: {
      id: 'asc'
    }
  });

  const stripe = getStripeClient();

  const prices = await stripe.prices.list();

  return NextResponse.json({
    plans: plans.map((plan) => {
      const price = prices.data.find((price) => price.metadata.planId === plan.id.toString());

      return {
        ...plan,
        priceObj: price
      };
    })
  });
}
