import { getAppSettings } from '@ui/getAppSettings';
import getCachedSession from '@ui/getCachedSession';
import { inngest } from '@utils/ingest/client';
import { NextResponse } from 'next/server';

export async function POST() {
  const appSettings = await getAppSettings();
  const session = await getCachedSession();
  const user = session?.user;

  await inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'confluence/app.sync',
    user,
    data: { appSettings }
  });
  return NextResponse.json({ success: 'true' });
}
