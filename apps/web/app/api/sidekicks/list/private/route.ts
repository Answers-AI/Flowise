import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';

import { respond401 } from '@utils/auth/respond401';

import { normalizeSidekickList } from '@utils/normalizeSidekick';

export async function GET(req: Request) {
  try {
    const session = await getCachedSession();
    if (!session?.user?.email) return respond401();

    const user = session.user;
    const userId = user.id;

    const dbSidekicks = await prisma.sidekick.findMany({
      where: {
        createdByUser: { id: userId }
      },
      include: {
        favoritedBy: {
          where: {
            id: { in: [user.id] }
          }
        }
      }
    });

    const sidekicks = normalizeSidekickList(dbSidekicks, user);

    return NextResponse.json(sidekicks);
  } catch (error) {
    console.log('[GET] error', error);
    throw error;
  }
}
