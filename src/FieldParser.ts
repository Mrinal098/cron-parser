export default class FieldParser {
  private min: number;
  private max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  public parse(expression: string): number[] {
    const result: Set<number> = new Set();

    const parts: string[] = expression.split(',');

    for (const part of parts) {
      this.parsePart(part, result);
    }

    return Array.from(result).sort((a, b) => a - b);
  }

  private parsePart(part: string, results: Set<number>): void {
    if (part === '*') {
      this.addRange(this.min, this.max, 1, results);
      return;
    }

    if (part.includes('/')) {
      const [base, stepStr] = part.split('/');
      if (!base || !stepStr) {
        return;
      }

      const step = Number(stepStr);

      if (base === '*') {
        this.addRange(this.min, this.max, step, results);
      } else if (base.includes('-')) {
        const rangeParts = base.split('-');
        if (rangeParts.length !== 2) {
          return;
        }
        const start = Number(rangeParts[0]);
        const end = Number(rangeParts[1]);
        if (isNaN(start) || isNaN(end)) {
          return;
        }

        this.addRange(start, end, step, results);
      }
      return;
    }

    if (part.includes('-')) {
      const rangeParts = part.split('-');
      if (rangeParts.length !== 2) {
        return;
      }
      const start = Number(rangeParts[0]);
      const end = Number(rangeParts[1]);
      if (isNaN(start) || isNaN(end)) {
        return;
      }

      this.addRange(start, end, 1, results);
      return;
    }

    const value = parseInt(part, 10);
    if (value >= this.min && value <= this.max) {
      results.add(value);
    }
  }

  private addRange(
    start: number,
    end: number,
    step: number,
    results: Set<number>,
  ): void {
    for (let i = start; i <= end; i += step) {
      if (i >= this.min && i <= this.max) {
        results.add(i);
      }
    }
  }
}
