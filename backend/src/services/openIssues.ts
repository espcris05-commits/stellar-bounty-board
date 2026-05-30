export interface OpenIssue {
  id: string;
  title: string;
  labels: string[];
  summary: string;
  impact: "starter" | "core" | "advanced";
}

interface CacheEntry {
  data: OpenIssue[];
  timestamp: number;
  stale: boolean;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: CacheEntry | null = null;
let rateLimitHits = 0;

const defaultIssues: OpenIssue[] = [
  { id: "SBB-101", title: "Add Freighter wallet signing for maintainer-only release and refund actions", labels: ["enhancement", "help wanted", "wallet"], summary: "Replace prompt-based demo actions with wallet-authenticated Soroban transactions so release and refund flows match real maintainer permissions.", impact: "core" },
  { id: "SBB-102", title: "Sync bounty submissions from GitHub pull request webhooks", labels: ["integration", "github", "help wanted"], summary: "Accept GitHub webhook events, connect PRs to bounty records, and auto-transition reserved bounties into submitted state.", impact: "advanced" },
  { id: "SBB-103", title: "Replace JSON persistence with Postgres and add an audit log table", labels: ["backend", "database", "help wanted"], summary: "Migrate from file storage to Postgres and preserve a complete history of status transitions for bounty payouts and refunds.", impact: "core" },
  { id: "SBB-104", title: "Add a contributor profile page with claim history and earnings", labels: ["frontend", "good first issue"], summary: "Show reserved, submitted, and released bounties per contributor with lifetime payout totals and filterable status chips.", impact: "starter" },
];

async function fetchFromGitHub(): Promise<{ data: OpenIssue[]; rateLimited: boolean }> {
  const token = process.env.GITHUB_TOKEN;
  const url = "https://api.github.com/repos/ritik4ever/stellar-bounty-board/issues?state=open&labels=Stellar+Wave&per_page=50";
  try {
    const headers: Record<string, string> = { "Accept": "application/vnd.github.v3+json", "User-Agent": "stellar-bounty-board" };
    if (token) headers["Authorization"] = "token " + token;
    const res = await fetch(url, { headers });
    const remaining = parseInt(res.headers.get("X-RateLimit-Remaining") || "1", 10);
    if (res.status === 403 || remaining === 0) { rateLimitHits++; return { data: [], rateLimited: true }; }
    if (!res.ok) return { data: [], rateLimited: false };
    const issues: any[] = await res.json();
    const mapped: OpenIssue[] = issues.map((i: any) => ({ id: "GH-" + i.number, title: i.title, labels: i.labels?.map((l: any) => l.name) || [], summary: (i.body || "").slice(0, 200), impact: i.labels?.some((l: any) => l.name === "good first issue") ? "starter" : "core" }));
    return { data: mapped, rateLimited: false };
  } catch { return { data: [], rateLimited: false }; }
}

export async function listOpenIssues(): Promise<OpenIssue[]> {
  const now = Date.now();
  if (cache && !cache.stale && (now - cache.timestamp) < CACHE_TTL_MS) return cache.data;
  const { data, rateLimited } = await fetchFromGitHub();
  if (rateLimited && cache) { console.warn("[openIssues] Rate limited. Serving stale cache."); cache.stale = true; return cache.data; }
  const issues = data.length > 0 ? data : defaultIssues;
  cache = { data: issues, timestamp: now, stale: false };
  return issues;
}

export function getCacheStatus(): { cached: boolean; age: number; stale: boolean; rateLimitHits: number } {
  const now = Date.now();
  return { cached: !!cache, age: cache ? now - cache.timestamp : 0, stale: cache?.stale || false, rateLimitHits };
}
