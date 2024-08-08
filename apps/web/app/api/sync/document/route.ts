import getCachedSession from '@ui/getCachedSession';
import { inngest } from '@utils/ingest/client';
import { NextResponse } from 'next/server';
import { prisma } from '@db/client';
import { DocumentFilter } from 'types';

const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_S3_REGION = process.env.AWS_S3_REGION;

export async function POST(req: Request, res: NextResponse) {
  if (!AWS_S3_REGION || !AWS_S3_BUCKET) {
    return NextResponse.json({
      status: 'error',
      message: 'You must use valid keys to perform this action.'
    });
  }

  const session = await getCachedSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({
      status: 'error',
      message: 'You must be logged in to perform this action.'
    });
  }

  const { documentName: iDocumentName, url } = await req.json();

  if (!iDocumentName) {
    return NextResponse.json({
      status: 'error',
      message: 'No documentName found in request headers.'
    });
  }

  const documentName = decodeURI(iDocumentName);

  const document = await prisma.document.upsert({
    where: {
      url
    },
    update: {
      title: documentName,
      url,
      source: 'document'
    },
    create: {
      title: documentName,
      url,
      source: 'document'
    },
    select: {
      id: true,
      title: true,
      status: true,
      url: true
    }
  });

  await inngest.send({
    v: '1',
    ts: new Date().valueOf(),
    name: 'documents/aws.index',
    user,
    data: {
      documentName,
      url,
      documentId: document.id
    }
  });

  const documentFilter: DocumentFilter = {
    documentId: document.id,
    label: documentName,
    filter: { url }
  };

  return NextResponse.json(documentFilter);
}
