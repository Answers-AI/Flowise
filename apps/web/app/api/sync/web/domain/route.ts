import { getAppSettings } from '@ui/getAppSettings';
import getCachedSession from '@ui/getCachedSession';
import { inngest } from '@utils/ingest/client';
import { NextResponse } from 'next/server';
import { respond401 } from '@utils/auth/respond401';
import { DocumentFilter } from 'types';

export async function POST(req: Request, res: NextResponse) {
  const appSettings = await getAppSettings();

  const session = await getCachedSession();
  const user = session?.user;

  if (!user) {
    return respond401();
  }

  const { domain } = await req.json();

  if (!domain) {
    return NextResponse.json({ error: 'No domain provided' }, { status: 400 });
  }

  await inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'web/urls.sync',
    user,
    data: { appSettings, urls: [domain], byDomain: true }
  });

  const filter: DocumentFilter = {
    label: domain,
    filter: { domain }
  };

  return NextResponse.json(filter);
}
