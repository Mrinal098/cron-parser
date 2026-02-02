import CronValidator from '../src/validators/CronValidator.js';

describe('CronValidator', () => {
  describe('empty and invalid format validation', () => {
    test('should throw if cron string is empty or whitespace', () => {
      expect(() => CronValidator.validate('')).toThrow(
        'Cron string cannot be empty',
      );
      expect(() => CronValidator.validate('   ')).toThrow(
        'Cron string cannot be empty',
      );
    });

    test('should throw if cron has fewer than 6 parts', () => {
      expect(() => CronValidator.validate('*/15 0 1 * *')).toThrow(
        'Invalid cron format. Expected 5 time fields + 1 command',
      );
    });

    test('should pass for valid cron string', () => {
      expect(() =>
        CronValidator.validate('*/15 0 1,15 * 1-5 /usr/bin/find'),
      ).not.toThrow();
    });
  });

  describe('field range validation', () => {
    test('should throw for out of range values in each field', () => {
      expect(() => CronValidator.validate('70 0 1 * * /cmd')).toThrow(
        'minute value out of range (0-59)',
      );
      expect(() => CronValidator.validate('0 24 1 * * /cmd')).toThrow(
        'hour value out of range (0-23)',
      );
      expect(() => CronValidator.validate('0 0 32 * * /cmd')).toThrow(
        'dayOfMonth value out of range (1-31)',
      );
      expect(() => CronValidator.validate('0 0 0 * * /cmd')).toThrow(
        'dayOfMonth value out of range (1-31)',
      );
      expect(() => CronValidator.validate('0 0 1 13 * /cmd')).toThrow(
        'month value out of range (1-12)',
      );
      expect(() => CronValidator.validate('0 0 1 0 * /cmd')).toThrow(
        'month value out of range (1-12)',
      );
      expect(() => CronValidator.validate('0 0 1 * 7 /cmd')).toThrow(
        'dayOfWeek value out of range (0-6)',
      );
    });

    test('should pass for boundary values', () => {
      expect(() =>
        CronValidator.validate('0-59 0-23 1-31 1-12 0-6 /cmd'),
      ).not.toThrow();
    });
  });

  describe('step validation', () => {
    test('should throw for invalid step values', () => {
      expect(() => CronValidator.validate('*/0 0 1 * * /cmd')).toThrow(
        'Invalid step value in minute',
      );
      expect(() => CronValidator.validate('*/-1 0 1 * * /cmd')).toThrow(
        'Invalid step value in minute',
      );
      expect(() => CronValidator.validate('*/abc 0 1 * * /cmd')).toThrow(
        'Invalid characters in minute',
      );
    });

    test('should throw for invalid step syntax', () => {
      expect(() => CronValidator.validate('/5 0 1 * * /cmd')).toThrow(
        'Invalid step syntax in minute',
      );
      expect(() => CronValidator.validate('5/10 0 1 * * /cmd')).toThrow(
        'Invalid step base in minute',
      );
    });

    test('should pass for valid steps', () => {
      expect(() => CronValidator.validate('*/15 0 1 * * /cmd')).not.toThrow();
      expect(() => CronValidator.validate('1-10/2 0 1 * * /cmd')).not.toThrow();
    });
  });

  describe('range validation', () => {
    test('should throw for invalid ranges', () => {
      expect(() => CronValidator.validate('10-5 0 1 * * /cmd')).toThrow(
        'Invalid range order in minute',
      );
      expect(() => CronValidator.validate('0 25-30 1 * * /cmd')).toThrow(
        'hour range out of bounds (0-23)',
      );
      expect(() => CronValidator.validate('0-60 0 1 * * /cmd')).toThrow(
        'minute range out of bounds (0-59)',
      );
    });

    test('should pass for valid range', () => {
      expect(() => CronValidator.validate('1-10 0 1 * * /cmd')).not.toThrow();
    });
  });

  describe('list validation', () => {
    test('should throw for invalid list values', () => {
      expect(() => CronValidator.validate('1,5,70 0 1 * * /cmd')).toThrow(
        'minute value out of range (0-59)',
      );
      expect(() => CronValidator.validate('1,5,abc 0 1 * * /cmd')).toThrow(
        'Invalid characters in minute',
      );
    });

    test('should pass for valid list', () => {
      expect(() =>
        CronValidator.validate('1,5,10,15 0 1 * * /cmd'),
      ).not.toThrow();
    });
  });

  describe('invalid characters validation', () => {
    test('should throw for invalid characters', () => {
      expect(() => CronValidator.validate('abc 0 1 * * /cmd')).toThrow(
        'Invalid characters in minute',
      );
      expect(() => CronValidator.validate('@ 0 1 * * /cmd')).toThrow(
        'Invalid characters in minute',
      );
      expect(() => CronValidator.validate('0 #$% 1 * * /cmd')).toThrow(
        'Invalid characters in hour',
      );
    });
  });

  describe('wildcard validation', () => {
    test('should pass for wildcards', () => {
      expect(() => CronValidator.validate('* * * * * /cmd')).not.toThrow();
      expect(() =>
        CronValidator.validate('*/5 */2 */3 */1 */1 /cmd'),
      ).not.toThrow();
    });
  });

  describe('complex expressions', () => {
    test('should pass for complex mixed expression', () => {
      expect(() =>
        CronValidator.validate('0,15,30,45 1-5 */5 1-12/2 1-5 /cmd'),
      ).not.toThrow();
    });
  });
});
