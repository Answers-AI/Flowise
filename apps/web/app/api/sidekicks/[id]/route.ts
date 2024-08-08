import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const session = await getCachedSession(req);
    const userId = session?.user?.id;
    if (!userId) return respond401();
    // const flags = useFlags(['settings_stream', 'recommended_prompts_expand']);

    if (!id) {
      return NextResponse.json({ error: 'Sidekick ID not provided' });
    }

    const sidekick = await prisma.sidekick.findFirst({
      where: {
        id,
        OR: [
          { createdByUser: { id: userId } },
          { isGlobal: true },
          {
            createdByUser: {
              organizations: {
                some: { users: { some: { id: userId } } }
              }
            },
            isSharedWithOrg: true
          }
        ]
      }
    });

    if (!sidekick) {
      return NextResponse.json({ error: 'Sidekick not found' });
    }

    return NextResponse.json(sidekick);
  } catch (error) {
    console.log('[GET] error', error);
    throw error;
  }
}
export async function DELETE(req: Request, { params: { id } }: { params: { id: string } }) {
  console.log('DELETE Sidekick', { id });
  const session = await getCachedSession(req);
  const userId = session?.user?.id;
  if (!userId) return respond401();
  // const flags = useFlags(['settings_stream', 'recommended_prompts_expand']);

  if (!id) {
    return NextResponse.json({ error: 'Sidekick ID not provided' });
  }
  try {
    const sidekick = await prisma.sidekick.delete({
      where: {
        id,
        //TODO: add admin delete override
        createdByUser: { id: userId }
      }
    });
    if (sidekick) {
      return NextResponse.json(sidekick);
    }
  } catch (e: any) {
    if (e.code === 'P2025') {
      console.log('The sidekick is already deleted');
      return NextResponse.json({});
    } else {
      throw e;
    }
  }
  return NextResponse.json({ message: 'Sidekick not found' });
}
