# Cron Expression Parser

A command-line tool that parses cron expressions and shows the expanded schedule for each field.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
npm run build
```

## Usage

### Using npm script

```bash
npm run parse "*/15 0 1,15 * 1-5 /usr/bin/find"
```

### Using as global CLI command

You can install the parser globally and use it as a CLI command:

```bash
# Link the package globally
npm link

# Now use it from anywhere
cron-parser "*/15 0 1,15 * 1-5 /usr/bin/find"
```

To unlink later:
```bash
npm unlink -g cron-parser
```

### Using in another project

```bash
# Install from local path
npm install /path/to/cron-parser

# Or link it
cd /path/to/other-project
npm link cron-parser
```

### Output

```
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
```

### Supported Syntax

- `*` - any value
- `,` - list of values (e.g., `1,15,30`)
- `-` - range (e.g., `1-5`)
- `/` - step (e.g., `*/15`)

## Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── index.ts           # Entry point
├── CronParser.ts      # Main parser class
├── FieldParser.ts     # Parses individual cron fields
├── constants.ts       # Field ranges and names
├── types.ts           # Type definitions
└── validators/
    └── CronValidator.ts

test/
├── CronParser.test.ts
├── FieldParser.test.ts
└── CronValidator.test.ts
```

## Scripts

- `npm run build` - Compile TypeScript
- `npm run parse` - Run the parser
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run format` - Format code
