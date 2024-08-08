import { getAppSettings } from '@ui/getAppSettings';
import getCachedSession from '@ui/getCachedSession';
import { inngest } from '@utils/ingest/client';
import { NextResponse } from 'next/server';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';
import { DocumentFilter } from 'types';

export async function POST(req: Request, res: NextResponse) {
  const appSettings = await getAppSettings();

  const session = await getCachedSession();
  const user = session?.user;

  if (!user) {
    return respond401();
  }

  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'No url provided' }, { status: 400 });
  }

  const web = await prisma.document.upsert({
    select: {
      id: true,
      url: true
    },
    where: { url },
    create: { url, source: 'web' },
    update: { url, source: 'web' }
  });

  await inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'web/urls.sync',
    user,
    data: { appSettings, urls: [url], byDomain: false }
  });

  const webDocumentFilter: DocumentFilter | undefined = {
    documentId: web.id,
    label: web.url,
    filter: { url: web.url }
  };

  return NextResponse.json(webDocumentFilter);
}
