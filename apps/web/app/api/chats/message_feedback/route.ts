// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';

export async function POST(req: Request, res: any) {
  const session = await getCachedSession();
  if (!session?.user?.email) return respond401();
  const { messageId, rating, content = '', tags } = await req.json();
  const { user } = session;

  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      chat: {
        users: { some: { email: user?.email } }
      }
    }
  });

  if (message) {
    const feedback = await prisma.messageFeedback.upsert({
      where: {
        userId_messageId: {
          messageId: messageId,
          userId: user.id
        }
      },
      create: {
        messageId,
        userId: user.id,
        content,
        rating,
        tags
      },
      update: {
        ...{ content, rating, tags }
      }
    });
    return NextResponse.json(feedback);
  }
  return NextResponse.json({});
}
