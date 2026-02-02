import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import CronParser from '../src/CronParser.js';

describe('CronParser', () => {
  let parser: CronParser;

  beforeEach(() => {
    parser = new CronParser();
  });

  describe('parse', () => {
    test('should parse full cron expression correctly', () => {
      const result = parser.parse('*/15 0 1,15 * 1-5 /usr/bin/find');

      expect(result.minute).toEqual([0, 15, 30, 45]);
      expect(result.hour).toEqual([0]);
      expect(result.dayOfMonth).toEqual([1, 15]);
      expect(result.month?.length).toBe(12);
      expect(result.dayOfWeek).toEqual([1, 2, 3, 4, 5]);
      expect(result.command).toBe('/usr/bin/find');
    });

    test('should parse wildcard for all fields', () => {
      const result = parser.parse('* * * * * /bin/sh');

      expect(result.minute?.length).toBe(60);
      expect(result.hour?.length).toBe(24);
      expect(result.dayOfMonth?.length).toBe(31);
      expect(result.month?.length).toBe(12);
      expect(result.dayOfWeek?.length).toBe(7);
      expect(result.command).toBe('/bin/sh');
    });

    test('should parse single values', () => {
      const result = parser.parse('5 10 15 6 3 /cmd');

      expect(result.minute).toEqual([5]);
      expect(result.hour).toEqual([10]);
      expect(result.dayOfMonth).toEqual([15]);
      expect(result.month).toEqual([6]);
      expect(result.dayOfWeek).toEqual([3]);
      expect(result.command).toBe('/cmd');
    });

    test('should parse ranges', () => {
      const result = parser.parse('1-5 10-12 1-3 1-6 0-2 /cmd');

      expect(result.minute).toEqual([1, 2, 3, 4, 5]);
      expect(result.hour).toEqual([10, 11, 12]);
      expect(result.dayOfMonth).toEqual([1, 2, 3]);
      expect(result.month).toEqual([1, 2, 3, 4, 5, 6]);
      expect(result.dayOfWeek).toEqual([0, 1, 2]);
    });

    test('should parse lists with multiple values', () => {
      const result = parser.parse(
        '0,15,30,45 1,12,23 5,10,15,20 2,4,6,8,10,12 1,3,5 /cmd',
      );

      expect(result.minute).toEqual([0, 15, 30, 45]);
      expect(result.hour).toEqual([1, 12, 23]);
      expect(result.dayOfMonth).toEqual([5, 10, 15, 20]);
      expect(result.month).toEqual([2, 4, 6, 8, 10, 12]);
      expect(result.dayOfWeek).toEqual([1, 3, 5]);
    });

    test('should parse range with step', () => {
      const result = parser.parse('0-30/10 0-12/3 1-20/5 1-12/2 0-6/2 /cmd');

      expect(result.minute).toEqual([0, 10, 20, 30]);
      expect(result.hour).toEqual([0, 3, 6, 9, 12]);
      expect(result.dayOfMonth).toEqual([1, 6, 11, 16]);
      expect(result.month).toEqual([1, 3, 5, 7, 9, 11]);
      expect(result.dayOfWeek).toEqual([0, 2, 4, 6]);
    });

    test('should parse complex mixed expressions', () => {
      const result = parser.parse(
        '0,15,30,45 1-5 1,15,30 1-6/2 1-5 /usr/bin/backup',
      );

      expect(result.minute).toEqual([0, 15, 30, 45]);
      expect(result.hour).toEqual([1, 2, 3, 4, 5]);
      expect(result.dayOfMonth).toEqual([1, 15, 30]);
      expect(result.month).toEqual([1, 3, 5]);
      expect(result.dayOfWeek).toEqual([1, 2, 3, 4, 5]);
      expect(result.command).toBe('/usr/bin/backup');
    });

    test('should throw for invalid cron string', () => {
      expect(() => parser.parse('')).toThrow('Cron string cannot be empty');
    });
  });

  describe('formatAndPrint', () => {
    test('should print formatted output with all fields', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

      parser.formatAndPrint({
        minute: [0, 15, 30, 45],
        hour: [0],
        dayOfMonth: [1, 15],
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        dayOfWeek: [1, 2, 3, 4, 5],
        command: '/usr/bin/find',
      });

      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0]?.[0];
      expect(output).toContain('minute        0 15 30 45');
      expect(output).toContain('hour          0');
      expect(output).toContain('day of month  1 15');
      expect(output).toContain('month         1 2 3 4 5 6 7 8 9 10 11 12');
      expect(output).toContain('day of week   1 2 3 4 5');
      expect(output).toContain('command       /usr/bin/find');

      spy.mockRestore();
    });
  });
});
