// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';

export async function GET(req: Request) {
  const session = await getCachedSession();
  if (!session?.user?.email) return NextResponse.redirect('/auth');
  const records = await prisma.message.findMany({
    where: {
      userId: session?.user?.id
    }
  });
  return NextResponse.json(records);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const session = await getCachedSession();
  if (!session?.user?.email) return NextResponse.redirect('/auth');
  if (id) {
    const userRecord = await prisma.message.findFirst({
      where: {
        id,
        userId: session?.user?.id
      }
    });

    if (!userRecord) return NextResponse.redirect('/auth');
    await prisma.message.delete({
      where: {
        id
      }
    });
    return NextResponse.json({ id });
  }
}

export async function PATCH(req: Request) {
  try {
    // TODO: Validate which fields are allowed to be updated
    const user = await getCachedSession();
    if (!user?.user?.email) return NextResponse.redirect('/auth');
    const { id, likes, dislikes } = await req.json();

    if (id) {
      await prisma.message.update({
        where: {
          id
        },
        data: { likes, dislikes }
      });

      return NextResponse.json({ id });
    }
  } catch (error) {
    console.log('[PATCH] error', error);
    throw error;
  }
}
