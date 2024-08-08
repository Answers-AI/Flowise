import { getAppSettings } from '@ui/getAppSettings';
import getCachedSession from '@ui/getCachedSession';
// import { syncFromAirtable } from '@utils/ingest/airtable';
import { NextResponse } from 'next/server';

export async function POST() {
  const appSettings = await getAppSettings();
  const session = await getCachedSession();
  const user = session?.user;

  //   await syncFromAirtable(appSettings, user);
  return NextResponse.json({ success: 'true' });
}
