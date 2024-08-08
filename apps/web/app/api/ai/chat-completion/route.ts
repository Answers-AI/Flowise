// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { authenticateApiKey } from '@utils/auth/authenticateApiKey';
import { respond401 } from '@utils/auth/respond401';
import OpenAIClient from '@utils/openai/openai';

export async function POST(req: Request) {
  const result = await authenticateApiKey(req);

  if (!result) return respond401();

  const data = await req.json();

  if (!data) {
    return NextResponse.json(
      { error: `No body` },
      {
        status: 400
      }
    );
  }

  try {
    const openai = new OpenAIClient();

    const reponse = await openai.createChatCompletion(data);

    return NextResponse.json(reponse);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 400
      }
    );
  }
}
