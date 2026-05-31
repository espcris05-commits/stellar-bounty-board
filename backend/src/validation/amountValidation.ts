import { z } from "zod";

const MAX_SAFE_AMOUNT = 1000000000; // 1B XLM
const MIN_AMOUNT = 0.0000001; // 0.0000001 XLM (minimum precision)

export const amountSchema = z.string()
  .transform(val => parseFloat(val))
  .pipe(z.number()
    .min(MIN_AMOUNT, `Amount must be at least ${MIN_AMOUNT}`)
    .max(MAX_SAFE_AMOUNT, `Amount must not exceed ${MAX_SAFE_AMOUNT}`)
  );

export function validateBountyAmount(amount: number): string | null {
  if (isNaN(amount) || amount <= 0) return "Amount must be positive";
  if (amount > MAX_SAFE_AMOUNT) return `Amount exceeds maximum (${MAX_SAFE_AMOUNT})`;
  return null;
}
