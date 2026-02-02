import { FieldDisplayNames, FieldNames, FieldRanges } from './constants.js';
import FieldParser from './FieldParser.js';
import { CronParserOutputType } from './types.js';
import CronValidator from './validators/CronValidator.js';

export default class CronParser {
  public parse(cronString: string): CronParserOutputType {
    CronValidator.validate(cronString);

    const expressions: string[] = cronString.trim().split(' ');

    const output: CronParserOutputType = {
      command: expressions[5] || '',
    };

    for (let index = 0; index < expressions.length - 1; index++) {
      const fieldName = FieldNames[index];
      if (!fieldName) {
        continue;
      }

      const expression = expressions[index];
      if (!expression) {
        continue;
      }

      output[fieldName] = this.parseField(fieldName, expression);
    }

    return output;
  }

  private parseField(fieldName: string, expression: string): number[] {
    const range = FieldRanges[fieldName];
    if (!range) {
      throw new Error(`Unknown field name: "${fieldName}"`);
    }
    const fieldParser = new FieldParser(range.min, range.max);
    return fieldParser.parse(expression);
  }

  public formatAndPrint(output: CronParserOutputType): void {
    const formattedOutput = this.formatOutput(output);
    console.log(formattedOutput);
  }

  private formatOutput(output: CronParserOutputType): string {
    let result = '';
    for (const key of FieldNames) {
      const value = output[key];
      const displayName = FieldDisplayNames[key] || key;
      if (Array.isArray(value)) {
        result += `${displayName.padEnd(14)}${value.join(' ')}\n`;
      } else {
        result += `${displayName.padEnd(14)}${value}\n`;
      }
    }
    return result.trimEnd();
  }
}
