import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';

export async function PATCH(
  req: Request,
  { params: { id } }: { params: { id: string } },
  res: Response
) {
  try {
    const session = await getCachedSession();
    if (!session?.user?.email) return respond401();
    if (!id) {
      throw new Error('There was an error updating your favorite');
    }

    const sidekickId = id;
    const userId = session.user.id;

    // Find the sidekick by ID
    const sidekick = await prisma.sidekick.findUnique({
      where: { id: sidekickId },
      include: {
        favoritedBy: {
          select: {
            id: true
          }
        }
      }
    });

    if (!sidekick) {
      return respond401();
    }

    // Check if the user has already favorited the sidekick
    const hasFavorited = sidekick.favoritedBy.some((user) => user.id === userId);

    let data;

    if (hasFavorited) {
      data = { favoritedSidekicks: { disconnect: { id: sidekickId } } };
    } else {
      data = { favoritedSidekicks: { connect: { id: sidekickId } } };
    }

    const sidekickUpdate = await prisma.user.update({
      where: { id: userId },
      data
    });

    if (!sidekickUpdate) {
      throw new Error('There was an error updating your favorite');
    }

    return NextResponse.json('Success');
  } catch (error) {
    return NextResponse.json(
      { error: 'There was an error updating your favorite' },
      { status: 422 }
    );
    throw error;
  }
}
