import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';

export async function GET(req: Request) {
  const session = await getCachedSession();
  const userId = session?.user?.id;
  if (!userId) return respond401();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const source = searchParams.get('source');
  const filter = searchParams.get('filter');

  if (!source) {
    return NextResponse.json({ error: 'A source was not provided' }, { status: 422 });
  }

  if (!id && !filter) {
    return NextResponse.json(
      { error: 'A document ID, or value was not provided' },
      { status: 422 }
    );
  }

  const filterObj = JSON.parse(filter || '{}');

  let out: { error?: string; status?: string; count: number } = {
    error: 'No status found',
    count: 0
  };

  if (id) {
    const document = await prisma.document.findFirst({
      where: {
        id,
        source
        // not needed since we are only selecting the status
        // permissions: { some: { organization: { users: { some: { id: userId } } } } }
      },
      select: {
        status: true
      }
    });
    if (document) {
      out = {
        status: document.status,
        count: 1
      };
    }
  } else if (source === 'web' && filterObj.domain) {
    const [totalCount, syncedCount] = await Promise.all([
      await prisma.document.count({
        where: {
          domain: filterObj.domain,
          source,
          status: {
            not: 'error'
          }
        }
      }),
      await prisma.document.count({
        where: {
          source,
          domain: filterObj.domain,
          status: 'synced'
        }
      })
    ]);
    out = {
      count: syncedCount,
      status: syncedCount > 1 && syncedCount === totalCount ? 'synced' : 'pending'
    };
  } else if (source === 'codebase' && filterObj.repo) {
    const [totalCount, syncedCount] = await Promise.all([
      await prisma.document.count({
        where: {
          title: filterObj.repo,
          source,
          status: {
            not: 'error'
          }
        }
      }),
      await prisma.document.count({
        where: {
          title: filterObj.repo,
          source,
          status: 'synced'
        }
      })
    ]);
    out = {
      count: syncedCount,
      status: syncedCount > 1 && syncedCount === totalCount ? 'synced' : 'pending'
    };
  }

  return NextResponse.json(out);
}
