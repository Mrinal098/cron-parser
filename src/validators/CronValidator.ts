import { FieldNames, FieldRanges } from '../constants.js';

export default class CronValidator {
  static validate(cronString: string): void {
    if (!cronString || cronString.trim().length === 0) {
      throw new Error('Cron string cannot be empty');
    }

    const expressions: string[] = cronString.trim().split(' ');

    if (expressions.length !== 6) {
      throw new Error(
        'Invalid cron format. Expected 5 time fields + 1 command',
      );
    }

    for (let index = 0; index < expressions.length - 1; index++) {
      const fieldName = FieldNames[index];
      if (!fieldName) {
        continue;
      }

      const expression = expressions[index];
      if (!expression) {
        continue;
      }

      this.validateField(fieldName, expression);
    }
  }

  private static validateField(fieldName: string, expression?: string): void {
    if (!expression || expression.trim() === '') {
      throw new Error(`${fieldName} field cannot be empty`);
    }

    const allowedPattern = /^[0-9*,\/\-]+$/;

    if (!allowedPattern.test(expression)) {
      throw new Error(`Invalid characters in ${fieldName}: "${expression}"`);
    }

    const fieldRange = FieldRanges[fieldName];
    if (!fieldRange) {
      throw new Error(`Unknown field name: "${fieldName}"`);
    }

    const { min, max } = fieldRange;

    const parts: string[] = expression.split(',');

    for (const part of parts) {
      this.validatePart(fieldName, part, min, max);
    }
  }

  private static validatePart(
    fieldName: string,
    part: string,
    min: number,
    max: number,
  ): void {
    if (part === '*') {
      return;
    }

    if (part.includes('/')) {
      const [base, stepStr] = part.split('/');

      if (!base || !stepStr) {
        throw new Error(`Invalid step syntax in ${fieldName}: "${part}"`);
      }

      const step = Number(stepStr);

      if (isNaN(step) || step <= 0) {
        throw new Error(`Invalid step value in ${fieldName}: "${part}"`);
      }

      if (base === '*') {
        return;
      }

      if (base.includes('-')) {
        this.validateRange(fieldName, base, min, max);
        return;
      }

      throw new Error(`Invalid step base in ${fieldName}: "${part}"`);
    }

    if (part.includes('-')) {
      this.validateRange(fieldName, part, min, max);
      return;
    }

    const value = Number(part);

    if (isNaN(value)) {
      throw new Error(`Invalid number in ${fieldName}: "${part}"`);
    }

    if (value < min || value > max) {
      throw new Error(
        `${fieldName} value out of range (${min}-${max}): "${value}"`,
      );
    }
  }

  private static validateRange(
    fieldName: string,
    rangePart: string,
    min: number,
    max: number,
  ): void {
    const [startStr, endStr] = rangePart.split('-');

    const start = Number(startStr);
    const end = Number(endStr);

    if (isNaN(start) || isNaN(end)) {
      throw new Error(`Invalid range in ${fieldName}: "${rangePart}"`);
    }

    if (start > end) {
      throw new Error(`Invalid range order in ${fieldName}: "${rangePart}"`);
    }

    if (start < min || end > max) {
      throw new Error(
        `${fieldName} range out of bounds (${min}-${max}): "${rangePart}"`,
      );
    }
  }
}
