import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';

import { prisma } from '@db/client';

import { DocumentFilter } from 'types';
import { respond401 } from '@utils/auth/respond401';

export async function GET(req: Request, res: Response) {
  const session = await getCachedSession();
  if (!session?.user?.email) return respond401();

  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');

  const groupedByRecords = await prisma.document.groupBy({
    by: ['title'],
    where: {
      source: 'codebase',
      ...(repo && {
        title: {
          contains: repo
        }
      }),
      permissions: { some: { organization: { users: { some: { id: session?.user?.id } } } } }
    }
  });

  const sources: DocumentFilter[] = groupedByRecords
    .filter(({ title }) => !!title)
    .map(
      ({ title }) =>
        ({
          label: title,
          filter: { repo: title }
        } as DocumentFilter)
    );

  return NextResponse.json({ sources });
}
