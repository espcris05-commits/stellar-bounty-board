import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { xlmToUsd, resetXlmToUsdCache, filterBounties, getUniqueTokenSymbols } from "./utils";
import type { FilterState } from "./constants";
import type { Bounty } from "./types";

describe("xlmToUsd", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    resetXlmToUsdCache();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches the XLM/USD rate and formats the amount", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ stellar: { usd: 0.124 } }),
    });

    await expect(xlmToUsd(100)).resolves.toBe("$12.40");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd",
      { signal: expect.any(AbortSignal) }
    );
  });

  it("caches the fetched rate for subsequent conversions", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ stellar: { usd: 0.2 } }),
    });

    await expect(xlmToUsd(10)).resolves.toBe("$2.00");
    await expect(xlmToUsd(25)).resolves.toBe("$5.00");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back gracefully when the rate fetch fails", async () => {
    fetchMock.mockRejectedValue(new Error("network unavailable"));

    await expect(xlmToUsd(100)).resolves.toBe("USD unavailable");
  });
});

function mockBounty(overrides: Partial<Bounty>): Bounty {
  return {
    id: "BNT-0001",
    repo: "acme/widget",
    issueNumber: 1,
    title: "Fix the widget",
    summary: "A task",
    maintainer: "GMAINTAINER",
    tokenSymbol: "XLM",
    amount: 100,
    labels: [],
    status: "open",
    createdAt: 1,
    deadlineAt: 2,
    ...overrides,
  } as Bounty;
}

const baseFilters: FilterState = {
  searchQuery: "",
  statusFilter: "all",
  minReward: "",
  maxReward: "",
  repoFilter: "",
  tokenFilter: "",
  sortOption: "newest",
  sortDirection: "desc",
};

const tokenBounties: Bounty[] = [
  mockBounty({ id: "1", tokenSymbol: "XLM", status: "open" }),
  mockBounty({ id: "2", tokenSymbol: "USDC", status: "open" }),
  mockBounty({ id: "3", tokenSymbol: "XLM", status: "released" }),
  mockBounty({ id: "4", tokenSymbol: "usdc", status: "reserved" }), // lowercase
];

describe("getUniqueTokenSymbols (#293)", () => {
  it("returns distinct, uppercased, sorted token symbols", () => {
    expect(getUniqueTokenSymbols(tokenBounties)).toEqual(["USDC", "XLM"]);
  });

  it("returns an empty array for no bounties", () => {
    expect(getUniqueTokenSymbols([])).toEqual([]);
  });
});

describe("filterBounties — token filter (#293)", () => {
  it("filters to a single token (case-insensitive)", () => {
    const result = filterBounties(tokenBounties, { ...baseFilters, tokenFilter: "USDC" });
    expect(result.map((b) => b.id).sort()).toEqual(["2", "4"]);
  });

  it("combines token and status filters with AND logic", () => {
    const result = filterBounties(tokenBounties, {
      ...baseFilters,
      tokenFilter: "XLM",
      statusFilter: "open",
    });
    expect(result.map((b) => b.id)).toEqual(["1"]);
  });

  it("returns all bounties when the token filter is empty ('All Tokens')", () => {
    expect(filterBounties(tokenBounties, baseFilters)).toHaveLength(4);
  });

  it('returns no bounties for a token that does not exist', () => {
    const result = filterBounties(tokenBounties, { ...baseFilters, tokenFilter: 'ETH' });
    expect(result).toEqual([]);
  });

  it('handles undefined tokenSymbol gracefully', () => {
    const bounties = [
      mockBounty({ id: '1', tokenSymbol: undefined }),
      mockBounty({ id: '2', tokenSymbol: 'XLM' }),
    ];
    const result = filterBounties(bounties, { ...baseFilters, tokenFilter: 'XLM' });
    expect(result.map((b) => b.id)).toEqual(['2']);
  });

  it('trims whitespace from token filter', () => {
    const result = filterBounties(tokenBounties, { ...baseFilters, tokenFilter: '  xlm  ' });
    expect(result.map((b) => b.id).sort()).toEqual(['1', '3']);
  });

  it('handles expired bounties in token filter', () => {
    const bounties = [
      ...tokenBounties,
      mockBounty({ id: '5', tokenSymbol: 'XLM', status: 'expired' }),
    ];
    const result = filterBounties(bounties, { ...baseFilters, tokenFilter: 'XLM' });
    expect(result).toHaveLength(3);
  });
});

import { getUniqueRepos, getRepoMetrics } from './utils';

describe('getUniqueRepos', () => {
  it('returns sorted unique repos from bounties', () => {
    const bounties = [
      mockBounty({ repo: 'z-repo' }),
      mockBounty({ repo: 'a-repo' }),
      mockBounty({ repo: 'z-repo' }),
    ];
    expect(getUniqueRepos(bounties)).toEqual(['a-repo', 'z-repo']);
  });

  it('returns an empty array for no bounties', () => {
    expect(getUniqueRepos([])).toEqual([]);
  });
});

describe('getRepoMetrics', () => {
  const bounties = [
    mockBounty({ id: '1', repo: 'acme/widget', status: 'open', amount: 100 }),
    mockBounty({ id: '2', repo: 'acme/widget', status: 'released', amount: 200 }),
    mockBounty({ id: '3', repo: 'acme/widget', status: 'reserved', amount: 50 }),
    mockBounty({ id: '4', repo: 'other/repo', status: 'open', amount: 75 }),
  ];

  it('computes correct metrics for a repo', () => {
    const m = getRepoMetrics(bounties, 'acme/widget');
    expect(m.totalBounties).toBe(3);
    expect(m.openBounties).toBe(1);
    expect(m.reservedBounties).toBe(1);
    expect(m.submittedBounties).toBe(0);
    expect(m.releasedBounties).toBe(1);
    expect(m.refundedBounties).toBe(0);
    expect(m.expiredBounties).toBe(0);
    expect(m.totalFunded).toBe(350);
    expect(m.totalPaidOut).toBe(200);
  });

  it('returns zeros for a repo with no bounties', () => {
    const m = getRepoMetrics(bounties, 'nonexistent');
    expect(m.totalBounties).toBe(0);
    expect(m.totalFunded).toBe(0);
    expect(m.totalPaidOut).toBe(0);
  });
});

describe('filterBounties — status filter', () => {
  const bounties = [
    mockBounty({ id: '1', status: 'open' }),
    mockBounty({ id: '2', status: 'reserved' }),
    mockBounty({ id: '3', status: 'submitted' }),
    mockBounty({ id: '4', status: 'released' }),
    mockBounty({ id: '5', status: 'refunded' }),
    mockBounty({ id: '6', status: 'expired' }),
  ];

  it('filters by each status', () => {
    expect(filterBounties(bounties, { ...baseFilters, statusFilter: 'open' })).toHaveLength(1);
    expect(filterBounties(bounties, { ...baseFilters, statusFilter: 'released' })).toHaveLength(1);
    expect(filterBounties(bounties, { ...baseFilters, statusFilter: 'expired' })).toHaveLength(1);
  });

  it('returns all when status is "all"', () => {
    expect(filterBounties(bounties, { ...baseFilters, statusFilter: 'all' })).toHaveLength(6);
  });
});
