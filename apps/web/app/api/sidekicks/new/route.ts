import { NextResponse } from 'next/server';
import { prisma } from '@db/client';

import { respond401 } from '@utils/auth/respond401';

import getCachedSession from '@ui/getCachedSession';
import { Sidekick } from 'db/generated/prisma-client';

export async function POST(req: Request) {
  const session = await getCachedSession(req);
  if (!session?.user) return respond401();

  const userId = session.user.id;

  const data: {
    chatflow: Pick<Sidekick, 'chatflow'>;
    chatflowDomain: string;
    chatflowApiKey: string;
  } = await req.json();
  console.log('New sidekick data', data.chatflow.name, userId, session.user.organizationId);
  try {
    if (!data.chatflow) throw new Error('No chatflow provided');
    const sidekickData = {
      ...data,
      chatflow: {
        ...data.chatflow,
        answersConfig: JSON.parse(data.chatflow.answersConfig)
      },
      chatflowDomain: session?.user?.chatflowDomain ?? data.chatflowDomain,
      id: data.chatflow.id,
      label: data?.chatflow?.name,
      isSharedWithOrg: true,
      aiModel: 'flowise',
      tags: ['flowise'],
      organization: {
        connect: { id: session.user?.organizationId! }
      }
    };
    const sidekick = await prisma.sidekick.upsert({
      where: {
        id: data.chatflow.id
      },
      create: {
        ...(sidekickData as any),
        createdByUser: { connect: { id: userId } }
      },
      update: { ...(sidekickData as any) }
    });
    return NextResponse.json(sidekick);
  } catch (error: any) {
    console.log('[POST] error', error);
    return NextResponse.json(
      { error: 'There was an error creating your sidekick.', code: error.message },
      { status: 422 }
    );
  }
}
