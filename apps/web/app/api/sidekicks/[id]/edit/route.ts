import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';

import { normalizeSidekickForUpdate } from '@utils/normalizeSidekick';
import { Sidekick } from 'db/generated/prisma-client';

export async function PATCH(req: Request) {
  try {
    const session = await getCachedSession();
    if (!session?.user?.email) return respond401();

    const regex = /\/api\/sidekicks\/(\w+)\/edit/;
    const match = req.url.match(regex);
    const id = match ? match[1] : null;

    if (!id) {
      return NextResponse.json({ error: 'Invalid ID param' });
    }

    const data: Sidekick = await req.json();
    const normalizedSidekick: any = normalizeSidekickForUpdate(data);

    // Pulls all of the columns for the User model so they
    // can be set to undefined, which will keep them from being updated
    // @ts-ignore-next-line
    const dbFields = prisma._runtimeDataModel.models.Sidekick.fields.map(
      (field: any) => field.name
    );

    const newData: Record<string, any> = {};

    for (const key of dbFields) {
      newData[key] = normalizedSidekick[key] === null ? undefined : normalizedSidekick[key];
    }

    const sidekick = await prisma.sidekick.update({
      where: {
        id
      },
      data: {
        ...newData,
        userId: undefined,
        createdByUser: { connect: { id: session?.user?.id } }
      }
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
