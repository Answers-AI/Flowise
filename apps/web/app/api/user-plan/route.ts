import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { respond401 } from '@utils/auth/respond401';
import { getActiveUserPlan } from '@utils/plans/getActiveUserPlan';

export async function GET(req: Request) {
  const session = await getCachedSession();
  if (!session?.user?.email) return respond401();

  const activeUserPlan = await getActiveUserPlan(session.user);

  return NextResponse.json({
    activeUserPlan
  });
}
