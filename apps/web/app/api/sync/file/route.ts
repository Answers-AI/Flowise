import getCachedSession from '@ui/getCachedSession';
import { inngest } from '@utils/ingest/client';
import { prisma } from '@db/client';
import { NextResponse } from 'next/server';
import { getUniqueDocumentPath } from '@utils/getUniqueDocumentPath';
import { DocumentFilter } from 'types';

export async function POST(req: Request, res: NextResponse) {
  const session = await getCachedSession();

  const user = session?.user;

  const data = await req.json();

  const { content, title, source = 'file' } = data;

  if (!user?.id) throw new Error('/api/sync/file: No user found');
  if (!user?.organizationId) throw new Error('/api/sync/file: No organizationId found');

  const url =
    data.url ??
    `https://files.theanswerai.com/files/${getUniqueDocumentPath({
      organizationId: user.organizationId,
      title
    })}`;

  const file = await prisma.document.create({
    select: {
      id: true,
      title: true,
      status: true,
      url: true
    },
    data: {
      title,
      url,
      content,
      source
    }
  });

  await inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'file/markdown.index',
    user,
    data: {
      ...data,
      url,
      source
    }
  });

  const fileFilter: DocumentFilter = {
    documentId: file.id,
    label: title,
    filter: { url }
  };

  return NextResponse.json(fileFilter);
}
