#!/usr/bin/env node

import CronParser from "./CronParser.js";

const input = process.argv[2];

if (!input) {
  console.error("Please provide an input string");
  process.exit(1);
}

try {
  const cronParser = new CronParser();
  const output = cronParser.parse(input);
  cronParser.formatAndPrint(output);
} catch (error: any) {
  throw error;
}
