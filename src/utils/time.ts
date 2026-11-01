export interface FormattedTime {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string; // 2 digits (centiseconds)
  millisecondsFull: string; // 3 digits
  displayTime: string; // "00:00.00" or "00:00:00.00"
  hasHours: boolean;
}

export function formatMilliseconds(ms: number): FormattedTime {
  const safeMs = Math.max(0, Math.floor(ms));
  
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milli = safeMs % 1000;
  const centiseconds = Math.floor(milli / 10);

  const pad = (n: number, width: number = 2) => n.toString().padStart(width, '0');

  const hStr = pad(hours);
  const mStr = pad(minutes);
  const sStr = pad(seconds);
  const csStr = pad(centiseconds);
  const msStr = pad(milli, 3);

  const hasHours = hours > 0;
  const displayTime = hasHours 
    ? `${hStr}:${mStr}:${sStr}.${csStr}` 
    : `${mStr}:${sStr}.${csStr}`;

  return {
    hours: hStr,
    minutes: mStr,
    seconds: sStr,
    milliseconds: csStr,
    millisecondsFull: msStr,
    displayTime,
    hasHours,
  };
}

export function formatDurationHuman(ms: number): string {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((safeMs % 1000) / 10);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}.${centiseconds.toString().padStart(2, '0')}s`);

  return parts.join(' ');
}

export function formatDelta(deltaMs: number): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (Math.abs(deltaMs) < 20) {
    return { text: '±0.00s', isPositive: false, isNeutral: true };
  }
  const isPositive = deltaMs > 0; // slower if positive
  const sign = isPositive ? '+' : '-';
  const absMs = Math.abs(deltaMs);
  const sec = (absMs / 1000).toFixed(2);
  return {
    text: `${sign}${sec}s`,
    isPositive,
    isNeutral: false,
  };
}
