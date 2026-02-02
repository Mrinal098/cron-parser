import FieldParser from '../src/FieldParser.js';

describe('FieldParser', () => {
  describe('wildcard parsing', () => {
    test("should expand wildcard '*' for all field types", () => {
      expect(new FieldParser(0, 59).parse('*')).toHaveLength(60); // minutes
      expect(new FieldParser(0, 23).parse('*')).toHaveLength(24); // hours
      expect(new FieldParser(1, 31).parse('*')).toHaveLength(31); // days
      expect(new FieldParser(1, 12).parse('*')).toHaveLength(12); // months
      expect(new FieldParser(0, 6).parse('*')).toHaveLength(7); // day of week
    });
  });

  describe('step values parsing', () => {
    test('should expand step values', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('*/15')).toEqual([0, 15, 30, 45]);
      expect(parser.parse('*/5')).toEqual([
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
      ]);
    });
  });

  describe('range parsing', () => {
    test('should expand ranges', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('1-5')).toEqual([1, 2, 3, 4, 5]);
      expect(parser.parse('0-10')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(parser.parse('5-5')).toEqual([5]);
    });
  });

  describe('list parsing', () => {
    test('should expand lists', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('1,3,5')).toEqual([1, 3, 5]);
      expect(parser.parse('0,15,30,45')).toEqual([0, 15, 30, 45]);
    });

    test('should handle duplicates and sort uniquely', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('5,3,1,3')).toEqual([1, 3, 5]);
    });

    test('should expand single value', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('42')).toEqual([42]);
    });
  });

  describe('range with step parsing', () => {
    test('should expand range with step', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('1-10/3')).toEqual([1, 4, 7, 10]);
      expect(parser.parse('0-20/5')).toEqual([0, 5, 10, 15, 20]);
    });

    test('should expand range with step for different fields', () => {
      expect(new FieldParser(1, 12).parse('1-12/2')).toEqual([
        1, 3, 5, 7, 9, 11,
      ]); // months
      expect(new FieldParser(0, 6).parse('0-6/2')).toEqual([0, 2, 4, 6]); // day of week
    });
  });

  describe('mixed expressions parsing', () => {
    test('should expand mixed list with ranges', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('1-5,10,15-20')).toEqual([
        1, 2, 3, 4, 5, 10, 15, 16, 17, 18, 19, 20,
      ]);
    });

    test('should expand mixed list with steps', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('*/10,25')).toEqual([0, 10, 20, 25, 30, 40, 50]);
    });

    test('should handle complex mix', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('0,5-10,15,20-30/5,45')).toEqual([
        0, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 45,
      ]);
    });
  });

  describe('boundary conditions', () => {
    test('should handle min and max boundaries', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('0')).toEqual([0]);
      expect(parser.parse('59')).toEqual([59]);
    });

    test('should filter out values outside range', () => {
      expect(new FieldParser(5, 59).parse('0-10')).not.toContain(0);
      expect(new FieldParser(0, 50).parse('45-60')).not.toContain(51);
    });

    test('should handle step larger than range', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('*/100')).toEqual([0]);
    });
  });

  describe('edge cases', () => {
    test('should handle overlapping ranges', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('1-10,5-15')).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);
    });

    test('should handle malformed expressions gracefully', () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse('/5')).toEqual([]);
      expect(parser.parse('*/')).toEqual([]);
      expect(parser.parse('1-2-3')).toEqual([]);
      expect(parser.parse('1-2-3/5')).toEqual([]);
    });
  });
});
