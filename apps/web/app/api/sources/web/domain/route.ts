import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';

import { respond401 } from '@utils/auth/respond401';
import { DocumentFilter } from 'types';
import { getUrlDomain } from '@utils/getUrlDomain';

export async function GET(req: Request) {
  const session = await getCachedSession();
  if (!session?.user?.email) return respond401();

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  const domain = getUrlDomain(url || '');

  const MINIMUM_DOMAIN_LENGTH = 9;

  const sources: (DocumentFilter & { count: number })[] = [];

  if (domain && domain.length > MINIMUM_DOMAIN_LENGTH) {
    const groupedByRecords = await prisma.document.groupBy({
      by: ['domain', 'status'],
      _count: {
        domain: true
      },
      where: {
        source: 'web',
        domain: {
          contains: domain
        }
      }
    });

    const groupedData = groupedByRecords.reduce<Record<string, { syncedCount: number }>>(
      (acc, group) => {
        const { domain, status, _count } = group;
        if (!domain) return acc;

        if (!acc[domain]) {
          acc[domain] = { syncedCount: 0 };
        }

        acc[domain].syncedCount += status === 'synced' ? _count.domain : 0;

        return acc;
      },
      {}
    );

    sources.push(
      ...Object.entries(groupedData).map(([domainKey, { syncedCount }]) => ({
        label: domainKey,
        filter: { domain: domainKey },
        count: syncedCount
      }))
    );
  }

  return NextResponse.json({ sources });
}
