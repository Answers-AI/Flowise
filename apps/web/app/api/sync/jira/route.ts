import { getAppSettings } from '@ui/getAppSettings';
import getCachedSession from '@ui/getCachedSession';
import { inngest } from '@utils/ingest/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const appSettings = await getAppSettings();
  const session = await getCachedSession();
  const user = session?.user;
  const { filters } = await request.json();

  await inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'jira/app.sync',
    user,
    data: { filters, appSettings }
  });
  return NextResponse.json({ success: 'true' });
}
