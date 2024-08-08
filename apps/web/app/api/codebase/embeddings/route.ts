// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { inngest } from '@utils/ingest/client';
import { authenticateApiKey } from '@utils/auth/authenticateApiKey';
import { respond401 } from '@utils/auth/respond401';

export async function POST(req: Request) {
  const result = await authenticateApiKey(req);

  if (!result) return respond401();

  const data = await req.json();

  // loop through these and return an error if any are missing
  const keys = ['repo', 'text', 'filePath'];

  for (const key of keys) {
    if (!data?.[key]) {
      return NextResponse.json(
        { error: `No ${key} in body` },
        {
          status: 400
        }
      );
    }
  }

  await inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'codebase/repo.sync',
    user: result.type === 'user' ? result.user : undefined,
    organization: result.type === 'organization' ? result.organization : undefined,
    data
  });

  return NextResponse.json({ status: 'ok' });
}
