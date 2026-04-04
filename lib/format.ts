export function safeNumber(value: any) {
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

export function formatPrice(value: any) {
  return safeNumber(value).toFixed(4);
}

export function formatInteger(value: any) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(safeNumber(value));
}
