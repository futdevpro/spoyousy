export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function parseDuration(duration: string): number {
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes * 60 + seconds) * 1000;
}

export function getTimeDifference(time1: number, time2: number): number {
  return Math.abs(time1 - time2);
}

export function isWithinTolerance(time1: number, time2: number, tolerance: number = 2000): boolean {
  return getTimeDifference(time1, time2) <= tolerance;
} 