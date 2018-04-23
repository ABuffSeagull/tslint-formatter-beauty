import * as ts from 'typescript'
import * as tslint from 'tslint'
import chalk from 'chalk'
import * as style from 'ansi-styles'
import * as logSymbols from 'log-symbols'
import { Formatter } from '../src/beautyFormatter'

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

const fixture = [
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
]

const formatter = new Formatter()

test('no linting errors', () => {
  expect(formatter.format([])).toBeEmpty()
})

test('file name', () => {
  const output = formatter.format(fixture)
  expect(output).toInclude(chalk.underline('src/index.ts'))
})

test('linter messages', () => {
  const output = formatter.format(fixture)
  expect(output).toInclude(chalk.red(
    '  Error: error example '
  ))
  expect(output).toInclude(chalk.yellow(
    '  Warning: warning example '
  ))
})

test('rule id', () => {
  const output = formatter.format(fixture)
  expect(output).toInclude(chalk.gray('(error-rule)'))
  expect(output).toInclude(chalk.gray('(warning-rule)'))
})

test('code highlight', () => {
  const output = formatter.format(fixture)
  expect(output).toInclude(style.bgRed.open + style.white.open)
  expect(output).toInclude(style.bgRed.close + style.white.close)
  expect(output).toInclude(style.bgYellow.open + style.black.open)
  expect(output).toInclude(style.bgYellow.close + style.black.close)
})

test('line number', () => {
  const output = formatter.format(fixture)
  expect(output).toInclude(chalk.gray('   1 | '))
  expect(output).toInclude(chalk.gray('   2 | '))
  expect(output).toInclude(chalk.gray('   3 | '))
  expect(output).toInclude(chalk.gray('    9 | '))
  expect(output).toInclude(chalk.gray('   10 | '))
  expect(output).toInclude(chalk.gray('   11 | '))
})

test('summary', () => {
  const output = formatter.format(fixture)
  expect(output).toInclude(logSymbols.error + chalk.red('  1 error'))
  expect(output).toInclude(logSymbols.warning + chalk.yellow('  1 warning'))
})

test('no summary', () => {
  const output = formatter.format(fixture, { noSummary: true })
  expect(output).not.toInclude(
    logSymbols.error + chalk.red('  1 error')
  )
  expect(output).not.toInclude(
    logSymbols.warning + chalk.yellow('  1 warning')
  )
})
