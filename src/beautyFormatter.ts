import * as tslint from 'tslint'
import chalk from 'chalk'
import * as style from 'ansi-styles'
import * as logSymbols from 'log-symbols'
import highlight from '@babel/highlight'
import codeExcerpt = require('code-excerpt')

function padStart(text: string, length: number) {
  return text.length >= length
    ? text
    : `${' '.repeat(length - text.length)}${text}`
}

function sort(a: tslint.RuleFailure, b: tslint.RuleFailure) {
  if (a.getRuleSeverity() === 'error' && b.getRuleSeverity() === 'warning') {
    return -1
  }

  if (a.getRuleSeverity() === 'warning' && b.getRuleSeverity() === 'error') {
    return 1
  }

  if (
    a.getStartPosition().getPosition()
    > b.getStartPosition().getPosition()) {
    return 1
  }

  return 0
}

export interface Options {
  noSummary?: boolean
}

export class Formatter extends tslint.Formatters.AbstractFormatter {
  format(failures: tslint.RuleFailure[], options?: Options): string {
    let output = '\n'

    const results: { [filename: string]: tslint.RuleFailure[] } = {}
    failures.forEach(failure => {
      const filePath = failure.getFileName()
      if (results[filePath]) {
        results[filePath].push(failure)
      } else {
        results[filePath] = [failure]
      }
    })

    Object.keys(results).forEach(result => {
      output += chalk.underline(result.replace(process.cwd(), '.')) + '\n'

      results[result].sort(sort).forEach(failure => {
        output += failure.getRuleSeverity() === 'error'
          ? chalk.red(`  Error: ${failure.getFailure()} `)
          : chalk.yellow(`  Warning: ${failure.getFailure()} `)
        output += chalk.gray(`(${failure.getRuleName()})`) + '\n'

        const startLine = failure
          .getStartPosition()
          .getLineAndCharacter().line + 1
        const endLine = failure.getEndPosition().getLineAndCharacter().line + 1
        const startColumn = failure
          .getStartPosition()
          .getLineAndCharacter()
          .character + 1
        const endColumn = failure
          .getEndPosition()
          .getLineAndCharacter()
          .character + 1

        const rawLines = codeExcerpt(
          failure.getRawLines(),
          startLine,
          { around: 2 })
        const padding = rawLines[rawLines.length - 1].line.toString().length + 6
        const lines = rawLines.map(line => {
          let painted = chalk.gray(padStart(`${line.line} | `, padding))

          const painter: {
            (text: string): string,
            open: string,
            close: string
          } = (text => (failure.getRuleSeverity() === 'error'
            ? chalk.bgRed(chalk.white(text))
            : chalk.bgYellow(chalk.black(text)))) as {
              (text: string): string,
              open: string,
              close: string
            }
          painter.open = `/*****${failure.getRuleSeverity() === 'error'
            ? style.bgRed.open + style.white.open
            : style.bgYellow.open + style.black.open}`
          painter.close = `${failure.getRuleSeverity() === 'error'
            ? style.bgRed.close + style.white.close
            : style.bgYellow.close + style.black.close}*****/`

          if (line.line === startLine) {
            const chars = line.value.split('')
            chars.splice(startColumn - 1, 0, painter.open)
            if (startLine === endLine) {
              chars.splice(
                startColumn === endColumn ? endColumn + 1 : endColumn,
                0,
                painter.close
              )
            } else {
              chars.push(painter.close)
            }

            painted += highlight(chars.join(''))
          } else if (line.line > startLine && line.line < endLine) {
            painted += highlight(`/*****${painter(line.value)}*****/`)
          } else if (line.line === endLine) {
            const chars = line.value.split('')
            chars.unshift(painter.open)
            chars.splice(endColumn, 0, painter.close)

            painted += highlight(chars.join(''))
          } else {
            painted += highlight(line.value)
          }

          painted = painted.replace(/\/\*\*\*\*\*/g, '')
            .replace(/\*\*\*\*\*\//g, '')

          return painted
        })

        output += lines.join('\n')

        output += '\n\n'
      })
    })

    const errorsCount = failures
      .filter(failure => failure.getRuleSeverity() === 'error')
      .length
    const warningsCount = failures
      .filter(failure => failure.getRuleSeverity() === 'warning')
      .length

    if (errorsCount === 0 && warningsCount === 0) {
      return ''   // Without errors and warnings, be silent
    }

    if (options && options.noSummary) {
      return output
    }

    if (errorsCount > 0) {
      output += logSymbols.error
        + chalk.red(`  ${errorsCount} error${errorsCount === 1 ? '' : 's'}`)
    }
    if (warningsCount > 0) {
      if (errorsCount > 0) {
        output += '\n'
      }

      output += logSymbols.warning
        + chalk.yellow(
          `  ${warningsCount} warning${warningsCount === 1 ? '' : 's'}`
        )
    }

    output += '\n'

    return output
  }
}
