export function formatNumber(num: number): string {
  if (num < 1000) {
    return Math.floor(num).toString();
  }

  const units = ['', 'K', 'M', 'B', 'T', 'Q'];
  const magnitude = Math.floor(Math.log10(num) / 3);
  const unitIndex = Math.min(magnitude, units.length - 1);
  const scaled = num / Math.pow(1000, unitIndex);

  if (scaled >= 100) {
    return Math.floor(scaled).toString() + units[unitIndex];
  } else if (scaled >= 10) {
    return scaled.toFixed(1) + units[unitIndex];
  } else {
    return scaled.toFixed(2) + units[unitIndex];
  }
}
