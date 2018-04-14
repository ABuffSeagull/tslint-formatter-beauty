import * as assert from 'assert'
import * as ts from 'typescript'
import * as tslint from 'tslint'
import * as Chalk from 'chalk'
import * as style from 'ansi-styles'
import * as logSymbols from 'log-symbols'
import { Formatter } from './beautyFormatter'

const chalk = Chalk.default

function createFailure (
  fileName: string,
  code: string,
  start: number,
  end: number,
  message: string,
  rule: string,
  severity: tslint.RuleSeverity
) {
  const sourceFile = ts.createSourceFile(
    fileName,
    code,
    ts.ScriptTarget.ES2015
  )
  const failure = new tslint.RuleFailure(sourceFile, start, end, message, rule)
  failure.setRuleSeverity(severity)
  return failure
}

const formatter = new Formatter()

// Success example
assert.strictEqual(formatter.format([]), '')

const output = formatter.format([
  createFailure(
    'src/index.ts',
    'var a = 0;\n\n\n\n\n\n\n\n[].forEach(function () {\n  //\n})\n',
    0,
    3,
    'error example',
    'error-rule',
    'error'
  ),
  createFailure(
    'src/index.ts',
    'var a = 0;\n\n\n\n\n\n\n\n[].forEach(function () {\n  //\n})\n',
    29,
    49,
    'warning example',
    'warning-rule',
    'warning'
  ),
])

// File name
assert(output.includes(chalk.underline('src/index.ts')))

// Linter message
assert(output.includes(chalk.red(
  '  Error: error example '
)))
assert(output.includes(chalk.yellow(
  '  Warning: warning example '
)))

// Rule Id
assert(output.includes(chalk.gray('(error-rule)')))
assert(output.includes(chalk.gray('(warning-rule)')))

// Code highlight
assert(output.includes(style.bgRed.open + style.white.open))
assert(output.includes(style.bgRed.close + style.white.close))
assert(output.includes(style.bgYellow.open + style.black.open))
assert(output.includes(style.bgYellow.close + style.black.close))

// Line number
assert(output.includes(chalk.gray('   1 | ')))
assert(output.includes(chalk.gray('   2 | ')))
assert(output.includes(chalk.gray('   3 | ')))
assert(output.includes(chalk.gray('    9 | ')))
assert(output.includes(chalk.gray('   10 | ')))
assert(output.includes(chalk.gray('   11 | ')))

// Summary
assert(output.includes(logSymbols.error + chalk.red('  1 error')))
assert(output.includes(logSymbols.warning + chalk.yellow('  1 warning')))

console.log(chalk.green('All tests passed.'))
