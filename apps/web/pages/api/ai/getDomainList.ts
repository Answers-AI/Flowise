import type { NextApiRequest, NextApiResponse } from 'next';
import getCachedSession from '@ui/getCachedSession';

import cors from '@ui/cors';

import { getDomainList } from '@ui/chat/getDomainList';

type Data = {
  domains: string[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await cors(req, res);

  const session = await getCachedSession(req, res);

  const user = session?.user;

  if (!user?.email) {
    res.status(401);
    return;
  }

  const domains = await getDomainList();

  res.status(200).json({ domains: domains.map((u) => u.domain) });
};

export default handler;
