import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';

export async function GET(req: Request) {
  const user = await getCachedSession();
  if (!user?.user?.email) return NextResponse.redirect('/auth');

  const records = await prisma.prompt.findMany({
    where: {
      users: {
        some: {
          email: user?.user?.email
        }
      }
    }
  });

  return NextResponse.json(records);
}

export async function DELETE(req: Request) {
  const user = await getCachedSession();
  if (!user?.user?.email) return NextResponse.redirect('/auth');

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const userRecord = await prisma.prompt.findFirst({
      where: {
        id,
        users: { some: { email: user?.user?.email } }
      }
    });

    if (!userRecord) return NextResponse.redirect('/auth');
    await prisma.prompt.delete({
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
      await prisma.prompt.update({
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
