import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import cors from '@ui/cors';
import { fetchContext } from '@utils/pinecone/fetchContext';

type Data = {
  pineconeData?: any;
  context?: any;
  error?: any;
};

const initializeOpenAI = () => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  return new OpenAIApi(configuration);
};

export const openai = initializeOpenAI();

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await cors(req, res);

  const context = await fetchContext(req.body);
  res.status(200).json(context);
};

export default handler;
