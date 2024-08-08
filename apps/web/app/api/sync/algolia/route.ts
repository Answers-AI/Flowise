import { getAppSettings } from '@ui/getAppSettings';
import getCachedSession from '@ui/getCachedSession';
import { inngest } from '@utils/ingest/client';
import { NextResponse } from 'next/server';

interface RequestBody {
  keywords: string;
}

export async function POST(req: Request, res: NextResponse) {
  const appSettings = await getAppSettings();
  const session = await getCachedSession();
  const user = session?.user;

  const { keywords } = await req.json();

  inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'algolia/search.sync',
    user,
    data: { appSettings, keywords }
  });
  return NextResponse.json({ status: 'ok' });
}
