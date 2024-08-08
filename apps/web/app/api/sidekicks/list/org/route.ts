import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';

import { normalizeSidekickList } from '@utils/normalizeSidekick';
import { respond401 } from '@utils/auth/respond401';

export async function GET(req: Request) {
  try {
    const session = await getCachedSession();
    if (!session?.user?.email) return respond401();

    const user = session.user;
    const userId = user.id;

    const dbSidekicks = await prisma.sidekick.findMany({
      where: {
        OR: [
          {
            createdByUser: {
              organizations: {
                // User attached to the sidekick is in the same organization as the current user
                some: { users: { some: { id: userId } } }
              }
            },
            isSharedWithOrg: true
          }
        ]
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
