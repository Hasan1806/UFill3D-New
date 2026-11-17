export type StoreCurrency = 'INR';

// Catalogue values in this demo are stored in USD. Override this at build time when
// a commerce backend supplies the business-approved INR price configuration.
export const USD_TO_INR_RATE = Number(process.env.NEXT_PUBLIC_USD_TO_INR_RATE ?? '94.1159');

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(amountInUSD: number, _currency: StoreCurrency = 'INR'): string {
  return inrFormatter.format(amountInUSD * USD_TO_INR_RATE);
}
