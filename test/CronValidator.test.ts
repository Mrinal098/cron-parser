import CronValidator from "../src/validators/CronValidator.js";

describe("CronValidator", () => {
  describe("empty and invalid format validation", () => {
    test("should throw if cron string is empty", () => {
      expect(() => CronValidator.validate("")).toThrow(
        "Cron string cannot be empty"
      );
    });

    test("should throw if cron string is only whitespace", () => {
      expect(() => CronValidator.validate("   ")).toThrow(
        "Cron string cannot be empty"
      );
    });

    test("should throw if cron has fewer than 6 parts", () => {
      expect(() => CronValidator.validate("*/15 0 1 * *")).toThrow(
        "Invalid cron format"
      );
    });

    test("should throw if cron has only 1 part", () => {
      expect(() => CronValidator.validate("*/15")).toThrow(
        "Invalid cron format"
      );
    });

    test("should throw if cron has only 3 parts", () => {
      expect(() => CronValidator.validate("*/15 0 1")).toThrow(
        "Invalid cron format"
      );
    });

    test("should pass for valid cron string", () => {
      expect(() =>
        CronValidator.validate("*/15 0 1,15 * 1-5 /usr/bin/find")
      ).not.toThrow();
    });
  });

  describe("minute field validation", () => {
    test("should throw for out of range minute value (>59)", () => {
      expect(() => CronValidator.validate("70 0 1 * * /cmd")).toThrow(
        "minute value out of range"
      );
    });

    test("should pass for valid minute value", () => {
      expect(() => CronValidator.validate("59 0 1 * * /cmd")).not.toThrow();
    });
  });

  describe("hour field validation", () => {
    test("should throw for out of range hour value (>23)", () => {
      expect(() => CronValidator.validate("0 24 1 * * /cmd")).toThrow(
        "hour value out of range"
      );
    });

    test("should pass for valid hour value", () => {
      expect(() => CronValidator.validate("0 23 1 * * /cmd")).not.toThrow();
    });
  });

  describe("day of month field validation", () => {
    test("should throw for out of range day value (>31)", () => {
      expect(() => CronValidator.validate("0 0 32 * * /cmd")).toThrow(
        "dayOfMonth value out of range"
      );
    });

    test("should throw for out of range day value (<1)", () => {
      expect(() => CronValidator.validate("0 0 0 * * /cmd")).toThrow(
        "dayOfMonth value out of range"
      );
    });

    test("should pass for valid day value", () => {
      expect(() => CronValidator.validate("0 0 31 * * /cmd")).not.toThrow();
    });
  });

  describe("month field validation", () => {
    test("should throw for out of range month value (>12)", () => {
      expect(() => CronValidator.validate("0 0 1 13 * /cmd")).toThrow(
        "month value out of range"
      );
    });

    test("should throw for out of range month value (<1)", () => {
      expect(() => CronValidator.validate("0 0 1 0 * /cmd")).toThrow(
        "month value out of range"
      );
    });

    test("should pass for valid month value", () => {
      expect(() => CronValidator.validate("0 0 1 12 * /cmd")).not.toThrow();
    });
  });

  describe("day of week field validation", () => {
    test("should throw for out of range day of week value (>6)", () => {
      expect(() => CronValidator.validate("0 0 1 * 7 /cmd")).toThrow(
        "dayOfWeek value out of range"
      );
    });

    test("should pass for valid day of week value", () => {
      expect(() => CronValidator.validate("0 0 1 * 6 /cmd")).not.toThrow();
    });
  });

  describe("step validation", () => {
    test("should throw for invalid step '*/0'", () => {
      expect(() => CronValidator.validate("*/0 0 1 * * /cmd")).toThrow(
        "Invalid step value"
      );
    });

    test("should throw for negative step", () => {
      expect(() => CronValidator.validate("*/-1 0 1 * * /cmd")).toThrow(
        "Invalid step value"
      );
    });

    test("should throw for non-numeric step", () => {
      expect(() => CronValidator.validate("*/abc 0 1 * * /cmd")).toThrow(
        "Invalid characters in minute"
      );
    });

    test("should throw for step without base", () => {
      expect(() => CronValidator.validate("/5 0 1 * * /cmd")).toThrow(
        "Invalid step syntax"
      );
    });

    test("should throw for step without value", () => {
      expect(() => CronValidator.validate("*/ 0 1 * * /cmd")).toThrow(
        "Invalid step syntax"
      );
    });

    test("should pass for valid step", () => {
      expect(() => CronValidator.validate("*/15 0 1 * * /cmd")).not.toThrow();
    });

    test("should pass for valid range with step", () => {
      expect(() => CronValidator.validate("1-10/2 0 1 * * /cmd")).not.toThrow();
    });

    test("should throw for invalid step base (not * or range)", () => {
      expect(() => CronValidator.validate("5/10 0 1 * * /cmd")).toThrow(
        "Invalid step base"
      );
    });
  });

  describe("range validation", () => {
    test("should throw for invalid range order (start > end)", () => {
      expect(() => CronValidator.validate("10-5 0 1 * * /cmd")).toThrow(
        "Invalid range order"
      );
    });

    test("should throw for range with start out of bounds", () => {
      expect(() => CronValidator.validate("0 25-30 1 * * /cmd")).toThrow(
        "hour range out of bounds"
      );
    });

    test("should throw for range with end out of bounds", () => {
      expect(() => CronValidator.validate("0-60 0 1 * * /cmd")).toThrow(
        "minute range out of bounds"
      );
    });

    test("should throw for non-numeric range start", () => {
      expect(() => CronValidator.validate("abc-10 0 1 * * /cmd")).toThrow(
        "Invalid characters in minute"
      );
    });

    test("should throw for non-numeric range end", () => {
      expect(() => CronValidator.validate("1-abc 0 1 * * /cmd")).toThrow(
        "Invalid characters in minute"
      );
    });

    test("should pass for valid range", () => {
      expect(() => CronValidator.validate("1-10 0 1 * * /cmd")).not.toThrow();
    });
  });

  describe("list validation", () => {
    test("should pass for valid list", () => {
      expect(() => CronValidator.validate("1,5,10,15 0 1 * * /cmd")).not.toThrow();
    });

    test("should throw for list with out of range value", () => {
      expect(() => CronValidator.validate("1,5,70 0 1 * * /cmd")).toThrow(
        "minute value out of range"
      );
    });

    test("should throw for list with invalid characters", () => {
      expect(() => CronValidator.validate("1,5,abc 0 1 * * /cmd")).toThrow(
        "Invalid characters in minute"
      );
    });
  });

  describe("invalid characters validation", () => {
    test("should throw for invalid characters (letters)", () => {
      expect(() => CronValidator.validate("abc 0 1 * * /cmd")).toThrow(
        "Invalid characters in minute"
      );
    });

    test("should throw for invalid characters (special chars)", () => {
      expect(() => CronValidator.validate("@ 0 1 * * /cmd")).toThrow(
        "Invalid characters in minute"
      );
    });

    test("should throw for invalid characters in hour field", () => {
      expect(() => CronValidator.validate("0 #$% 1 * * /cmd")).toThrow(
        "Invalid characters in hour"
      );
    });

    test("should pass for valid special characters (*, /, -, ,)", () => {
      expect(() =>
        CronValidator.validate("*/5 0-5 1,15 * 1-5 /cmd")
      ).not.toThrow();
    });
  });

  describe("wildcard validation", () => {
    test("should pass for wildcard in all fields", () => {
      expect(() => CronValidator.validate("* * * * * /cmd")).not.toThrow();
    });

    test("should pass for wildcard with step", () => {
      expect(() => CronValidator.validate("*/5 */2 */3 */1 */1 /cmd")).not.toThrow();
    });
  });

  describe("complex expressions validation", () => {
    test("should pass for complex mixed expression", () => {
      expect(() =>
        CronValidator.validate("0,15,30,45 1-5 */5 1-12/2 1-5 /cmd")
      ).not.toThrow();
    });

    test("should pass for all ranges at boundaries", () => {
      expect(() =>
        CronValidator.validate("0-59 0-23 1-31 1-12 0-6 /cmd")
      ).not.toThrow();
    });

    test("should throw for multiple invalid parts in list", () => {
      expect(() => CronValidator.validate("1,2,100 0 1 * * /cmd")).toThrow(
        "minute value out of range"
      );
    });

    test("should throw for invalid base in step that is not * or range", () => {
      expect(() => CronValidator.validate("5/10 0 1 * * /cmd")).toThrow(
        "Invalid step base"
      );
    });
  });
});
