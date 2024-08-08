import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';
import { DocumentFilter } from 'types';

export async function GET(req: Request) {
  const session = await getCachedSession();
  if (!session?.user?.email) return respond401();

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  const filteredRecords = await prisma.document.findMany({
    where: {
      source: 'web',
      ...(url && {
        url: {
          contains: url
        }
      })
    },
    select: {
      id: true,
      url: true,
      title: true,
      status: true
    },
    take: 100
  });

  const sources: DocumentFilter[] = filteredRecords.map((document) => ({
    documentId: document.id,
    label: document.url,
    filter: { url: document.url }
  }));

  return NextResponse.json({
    sources
  });
}
