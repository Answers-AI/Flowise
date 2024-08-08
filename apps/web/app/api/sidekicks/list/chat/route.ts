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

    const usersInOrg = await prisma.user.findMany({
      where: {
        organizationId: user?.organizationId
      }
    });

    const dbSidekicks = await prisma.sidekick.findMany({
      where: {
        OR: [
          {
            favoritedBy: {
              some: {
                id: userId
              }
            }
          },
          {
            isSharedWithOrg: true,
            userId: { in: usersInOrg.map((u) => u.id) }
          },
          {
            isSystem: true
          }
        ]
      }
    });
    const sidekicks = normalizeSidekickList(dbSidekicks as any[], user);

    return NextResponse.json(sidekicks);
  } catch (error) {
    console.log('[GET] error', error);
    throw error;
  }
}
