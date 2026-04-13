const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const parseDateOnly = (value: string) => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const nightsBetween = (checkIn: Date, checkOut: Date) =>
  Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY));

export const rangesOverlap = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
) => startA < endB && startB < endA;
