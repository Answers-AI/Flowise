import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { respond401 } from '@utils/auth/respond401';

export async function GET(req: Request) {
  try {
    const session = await getCachedSession();
    if (!session?.user?.email) return respond401();

    const { searchParams } = new URL(req.url);
    const qPerPage = Number(searchParams.get('perPage') ?? '50');
    let perPage = qPerPage;

    if (qPerPage <= 0) {
      perPage = 50;
    } else if (qPerPage > 100) {
      perPage = 100;
    }

    let qPageNumber = Number(searchParams.get('pageNum')) ?? 1;
    let pageNum = qPageNumber;

    if (pageNum <= 0) {
      pageNum = 1;
    }

    // Calculate skip based on page number and per page count
    const skip = (pageNum - 1) * perPage;

    let orderBy = searchParams.get('orderBy') ?? 'updatedAt';

    let qOrder = searchParams.get('order') ?? 'asc';
    let order = qOrder !== 'asc' && qOrder !== 'desc' ? 'asc' : qOrder;

    const queryObj: any = {
      where: {
        source: 'web'
      },
      orderBy: {
        [orderBy]: order // Sort by createdAt field in descending order
      }
    };

    const keyword = (searchParams.get('keyword') ?? '').trim();

    if (keyword !== '') {
      queryObj.where.OR = [
        {
          url: { contains: keyword }
        },
        {
          title: { contains: keyword }
        }
      ];
    }

    const status = (searchParams.get('statusType') ?? '').trim();

    if (status !== '') {
      queryObj.where.status = status;
    }

    const documentQuery = prisma.document.findMany({ ...queryObj, take: perPage, skip });

    const countQuery = prisma.document.count(queryObj);

    const [documents, total] = await Promise.all([documentQuery, countQuery]);

    return NextResponse.json({ documents, total });
  } catch (error) {
    console.log('[GET] error', error);
    throw error;
  }
}
