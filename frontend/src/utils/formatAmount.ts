export function formatTokenAmount(amount: number, decimals = 7, symbol = "***"): string {
  const value = amount / Math.pow(10, decimals);
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ${symbol}`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K ${symbol}`;
  if (value >= 1) return `${value.toFixed(2)} ${symbol}`;
  if (value >= 0.001) return `${value.toFixed(5)} ${symbol}`;
  return `${value.toFixed(decimals)} ${symbol}`;
}
