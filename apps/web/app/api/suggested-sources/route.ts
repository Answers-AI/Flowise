import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import OpenAIClient from '@utils/openai/openai';
import { parse } from 'url';
import { pineconeQuery } from '@utils/pinecone/pineconeQuery';
import { respond401 } from '@utils/auth/respond401';
import {
  QueryResponse,
  ScoredVector
} from '@pinecone-database/pinecone/dist/pinecone-generated-ts';

const openai = new OpenAIClient();
const SCORE_THRESHOLD = 0.8;

export async function GET(req: Request) {
  const session = await getCachedSession();
  const userId = session?.user?.id;
  if (!userId || !session.user?.organizationId) return respond401();

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const query = (searchParams.get('query') ?? '').trim();

  // Require at least 10 characters
  if (query.length < 10) {
    return NextResponse.json({ error: 'Provide a longer query' }, { status: 422 });
  }

  let pineconeDomains: any = {};

  const queryEmbedding = await openai.createEmbedding({
    input: query?.toLowerCase(),
    model: 'text-embedding-ada-002'
  });

  const promiseArray = [];

  promiseArray.push(getWebSuggestions(queryEmbedding, pineconeDomains));
  promiseArray.push(
    pineconeQuery(queryEmbedding, {
      namespace: `org-${session.user?.organizationId}`,
      topK: 200
    })
  );

  const [webSuggestions, otherSources] = await Promise.all(promiseArray);

  const suggestions: any = {
    web: webSuggestions
  };

  const matches = (otherSources as QueryResponse)?.matches ?? [];
  const filteredMatches: Record<string, any[]> = {};

  if (matches?.length) {
    matches.forEach((match) => {
      if (match.score! > SCORE_THRESHOLD && (match?.metadata as any)?.source) {
        const source: string = (match?.metadata as any)?.source;
        filteredMatches[source] = (filteredMatches[source] || []).concat(match?.metadata);
      }
    });
  }

  return NextResponse.json(suggestions);
}

interface DomainInfo {
  domain: string;
  pageCount: number;
}

async function getWebSuggestions(queryEmbedding: number[], pineconeDomains: any) {
  const { matches } = await pineconeQuery(queryEmbedding, {
    // TODO: Figure how to filter by namespace without having to re-index per user
    // namespace: `org-${user?.organizationId}`,
    filter: {
      source: 'web'
    },
    topK: 100
  });
  const url = new Set();
  for (const match of matches ?? []) {
    if (match.score! > SCORE_THRESHOLD) {
      const domain = (match?.metadata as any)?.domain;
      if (domain) pineconeDomains[domain] = Math.max(match.score!, pineconeDomains[domain] || 0);
      url.add((match?.metadata as any)?.url);
    }
  }
  const domain = Object.keys(pineconeDomains)
    .map((domain) => ({
      domain,
      score: pineconeDomains[domain]
    }))

    ?.filter((a) => a.score > SCORE_THRESHOLD)
    ?.sort((a, b) => b.score - a.score)

    ?.map((domain) => domain.domain);
  // @ts-expect-error
  return { domain, url: [...url] };
}

function countPagesByDomain(urls: string[]): DomainInfo[] {
  const domainMap: Map<string, number> = new Map();

  for (const url of urls) {
    const parsedUrl = parse(url);
    if (parsedUrl && parsedUrl.hostname) {
      const domain = parsedUrl.hostname;
      const count = domainMap.get(domain) || 0;
      domainMap.set(domain, count + 1);
    }
  }

  const domainInfoList: DomainInfo[] = [];
  domainMap.forEach((pageCount, domain) => {
    domainInfoList.push({ domain, pageCount });
  });

  return domainInfoList;
}
