import getCachedSession from '@ui/getCachedSession';
import { NextResponse, NextRequest } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getUniqueDocumentPath } from '@utils/getUniqueDocumentPath';

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_S3_REGION = process.env.AWS_S3_REGION;

export async function POST(req: Request, res: NextResponse) {
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET || !AWS_S3_REGION) {
    return NextResponse.json({
      status: 'error',
      message: 'You must use valid keys to perform this action.'
    });
  }

  const session = await getCachedSession();
  const user = session?.user;
  if (!user || !user.organizationId) {
    return NextResponse.json({
      status: 'error',
      message: 'You must be logged in to perform this action.'
    });
  }

  const { documentName } = await req.json();

  if (!documentName) {
    return NextResponse.json({
      status: 'error',
      message: 'You must pass a valid documentname to perform this action.'
    });
  }

  const url = getUniqueDocumentPath({
    organizationId: user.organizationId,
    title: documentName
  });

  const s3Client = new S3Client({
    region: AWS_S3_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  });

  const signedUrlCommand = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: url,
    ContentType: 'multipart/form-data'
  });

  const signedUrl = await getSignedUrl(s3Client, signedUrlCommand, { expiresIn: 3600 });

  return NextResponse.json({ status: 'ok', signedUrl, url });
}
