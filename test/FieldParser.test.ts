import FieldParser from "../src/FieldParser.js";

describe("FieldParser", () => {
  describe("wildcard parsing", () => {
    test("should expand wildcard '*' for minutes (0-59)", () => {
      const parser = new FieldParser(0, 59);
      const result = parser.parse("*");
      expect(result[0]).toBe(0);
      expect(result[result.length - 1]).toBe(59);
      expect(result.length).toBe(60);
    });

    test("should expand wildcard '*' for hours (0-23)", () => {
      const parser = new FieldParser(0, 23);
      const result = parser.parse("*");
      expect(result[0]).toBe(0);
      expect(result[result.length - 1]).toBe(23);
      expect(result.length).toBe(24);
    });

    test("should expand wildcard '*' for days (1-31)", () => {
      const parser = new FieldParser(1, 31);
      const result = parser.parse("*");
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(31);
      expect(result.length).toBe(31);
    });

    test("should expand wildcard '*' for months (1-12)", () => {
      const parser = new FieldParser(1, 12);
      const result = parser.parse("*");
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(12);
      expect(result.length).toBe(12);
    });

    test("should expand wildcard '*' for day of week (0-6)", () => {
      const parser = new FieldParser(0, 6);
      const result = parser.parse("*");
      expect(result[0]).toBe(0);
      expect(result[result.length - 1]).toBe(6);
      expect(result.length).toBe(7);
    });
  });

  describe("step values parsing", () => {
    test("should expand step values '*/15' for minutes", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("*/15")).toEqual([0, 15, 30, 45]);
    });

    test("should expand step values '*/5' for minutes", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("*/5")).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    });

    test("should expand step values '*/10' for hours", () => {
      const parser = new FieldParser(0, 23);
      expect(parser.parse("*/10")).toEqual([0, 10, 20]);
    });

    test("should expand step values '*/1' (every value)", () => {
      const parser = new FieldParser(0, 5);
      expect(parser.parse("*/1")).toEqual([0, 1, 2, 3, 4, 5]);
    });

    test("should expand step values '*/2' for days", () => {
      const parser = new FieldParser(1, 31);
      const result = parser.parse("*/2");
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(3);
      expect(result[2]).toBe(5);
      expect(result.length).toBe(16);
    });
  });

  describe("range parsing", () => {
    test("should expand range '1-5'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("1-5")).toEqual([1, 2, 3, 4, 5]);
    });

    test("should expand range '0-10'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("0-10")).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test("should expand range '20-23' for hours", () => {
      const parser = new FieldParser(0, 23);
      expect(parser.parse("20-23")).toEqual([20, 21, 22, 23]);
    });

    test("should expand range '1-12' for months", () => {
      const parser = new FieldParser(1, 12);
      const result = parser.parse("1-12");
      expect(result.length).toBe(12);
      expect(result[0]).toBe(1);
      expect(result[11]).toBe(12);
    });

    test("should expand single value range '5-5'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("5-5")).toEqual([5]);
    });
  });

  describe("list parsing", () => {
    test("should expand list '1,3,5'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("1,3,5")).toEqual([1, 3, 5]);
    });

    test("should expand list '0,15,30,45'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("0,15,30,45")).toEqual([0, 15, 30, 45]);
    });

    test("should expand list with duplicates and sort uniquely '5,3,1,3'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("5,3,1,3")).toEqual([1, 3, 5]);
    });

    test("should expand list with single value '42'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("42")).toEqual([42]);
    });

    test("should expand list '1,2,3,4,5,6,7,8,9,10'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("1,2,3,4,5,6,7,8,9,10")).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe("range with step parsing", () => {
    test("should expand range with step '1-10/3'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("1-10/3")).toEqual([1, 4, 7, 10]);
    });

    test("should expand range with step '0-20/5'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("0-20/5")).toEqual([0, 5, 10, 15, 20]);
    });

    test("should expand range with step '10-30/10'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("10-30/10")).toEqual([10, 20, 30]);
    });

    test("should expand range with step '1-12/2' for months", () => {
      const parser = new FieldParser(1, 12);
      expect(parser.parse("1-12/2")).toEqual([1, 3, 5, 7, 9, 11]);
    });

    test("should expand range with step '0-6/2' for day of week", () => {
      const parser = new FieldParser(0, 6);
      expect(parser.parse("0-6/2")).toEqual([0, 2, 4, 6]);
    });

    test("should expand range with step '1-31/7' for days", () => {
      const parser = new FieldParser(1, 31);
      expect(parser.parse("1-31/7")).toEqual([1, 8, 15, 22, 29]);
    });
  });

  describe("mixed expressions parsing", () => {
    test("should expand mixed list with ranges '1-5,10,15-20'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("1-5,10,15-20")).toEqual([1, 2, 3, 4, 5, 10, 15, 16, 17, 18, 19, 20]);
    });

    test("should expand mixed list with steps '*/10,25'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("*/10,25")).toEqual([0, 10, 20, 25, 30, 40, 50]);
    });

    test("should expand mixed list with range and step '1-10/2,15,20-25'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("1-10/2,15,20-25")).toEqual([1, 3, 5, 7, 9, 15, 20, 21, 22, 23, 24, 25]);
    });

    test("should handle complex mix '0,5-10,15,20-30/5,45'", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("0,5-10,15,20-30/5,45")).toEqual([0, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 45]);
    });
  });

  describe("boundary conditions", () => {
    test("should handle value at min boundary", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("0")).toEqual([0]);
    });

    test("should handle value at max boundary", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("59")).toEqual([59]);
    });

    test("should filter out values below min", () => {
      const parser = new FieldParser(5, 59);
      const result = parser.parse("0-10");
      expect(result[0]).toBe(5);
      expect(result).not.toContain(0);
      expect(result).not.toContain(4);
    });

    test("should filter out values above max", () => {
      const parser = new FieldParser(0, 50);
      const result = parser.parse("45-60");
      expect(result[result.length - 1]).toBe(50);
      expect(result).not.toContain(51);
    });

    test("should handle step that doesn't align with max", () => {
      const parser = new FieldParser(0, 59);
      const result = parser.parse("*/17");
      expect(result).toEqual([0, 17, 34, 51]);
    });
  });

  describe("edge cases", () => {
    test("should return sorted unique values", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("10,5,15,5,10")).toEqual([5, 10, 15]);
    });

    test("should handle overlapping ranges", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("1-10,5-15")).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    test("should handle step larger than range", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("*/100")).toEqual([0]);
    });

    test("should handle range with step of 1", () => {
      const parser = new FieldParser(0, 10);
      expect(parser.parse("0-10/1")).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test("should handle single value in different positions", () => {
      const parser = new FieldParser(1, 31);
      expect(parser.parse("1")).toEqual([1]);
      expect(parser.parse("15")).toEqual([15]);
      expect(parser.parse("31")).toEqual([31]);
    });
  });

  describe("specific field ranges", () => {
    test("should handle minute field (0-59) with various inputs", () => {
      const parser = new FieldParser(0, 59);
      expect(parser.parse("0")).toEqual([0]);
      expect(parser.parse("59")).toEqual([59]);
      expect(parser.parse("30")).toEqual([30]);
    });

    test("should handle hour field (0-23) with various inputs", () => {
      const parser = new FieldParser(0, 23);
      expect(parser.parse("0")).toEqual([0]);
      expect(parser.parse("23")).toEqual([23]);
      expect(parser.parse("12")).toEqual([12]);
    });

    test("should handle day field (1-31) with various inputs", () => {
      const parser = new FieldParser(1, 31);
      expect(parser.parse("1")).toEqual([1]);
      expect(parser.parse("31")).toEqual([31]);
      expect(parser.parse("15")).toEqual([15]);
    });

    test("should handle month field (1-12) with various inputs", () => {
      const parser = new FieldParser(1, 12);
      expect(parser.parse("1")).toEqual([1]);
      expect(parser.parse("12")).toEqual([12]);
      expect(parser.parse("6")).toEqual([6]);
    });

    test("should handle day of week field (0-6) with various inputs", () => {
      const parser = new FieldParser(0, 6);
      expect(parser.parse("0")).toEqual([0]);
      expect(parser.parse("6")).toEqual([6]);
      expect(parser.parse("3")).toEqual([3]);
    });

    test("should handle malformed step expressions gracefully", () => {
      const parser = new FieldParser(0, 59);
      // Missing base
      expect(parser.parse("/5")).toEqual([]);
      // Missing step
      expect(parser.parse("*/")).toEqual([]);
    });

    test("should handle malformed range expressions gracefully", () => {
      const parser = new FieldParser(0, 59);
      // Too many dashes
      expect(parser.parse("1-2-3")).toEqual([]);
      // Single dash is parsed as range 0-0 which gives [0]
      expect(parser.parse("-")).toEqual([0]);
    });

    test("should handle invalid range in step", () => {
      const parser = new FieldParser(0, 59);
      // Too many dashes in range with step
      expect(parser.parse("1-2-3/5")).toEqual([]);
    });
  });
});
