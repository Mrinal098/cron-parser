export const FieldRanges: Record<string, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 6 },
};

export const FieldNames = [
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
  'command',
];

export const FieldDisplayNames: Record<string, string> = {
  minute: 'minute',
  hour: 'hour',
  dayOfMonth: 'day of month',
  month: 'month',
  dayOfWeek: 'day of week',
  command: 'command',
};
