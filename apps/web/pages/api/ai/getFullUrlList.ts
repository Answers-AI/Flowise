import type { NextApiRequest, NextApiResponse } from 'next';
import getCachedSession from '@ui/getCachedSession';

import cors from '@ui/cors';
import { getFullUrlList } from '@ui/chat/getFullUrlList';

export type SourceUrl = {
  id: string;
  domain: string;
  url: string;
};

type Data = SourceUrl[];

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await cors(req, res);

  const session = await getCachedSession(req, res);

  const user = session?.user;

  if (!user?.email) {
    res.status(401);
    return;
  }

  const urls = await getFullUrlList();

  res.status(200).json(urls);
};

export default handler;
