import * as tslint from "tslint";

export class Formatter extends tslint.Formatters.AbstractFormatter {
  public format(failures: tslint.RuleFailure[]): string {
    return failures
      .map(fail => {
        const { line, character } = fail.getStartPosition().toJson();
        return `${fail.getFileName()}:${line +
          1}:${character}: ${fail.getRuleSeverity()}: ${fail.getFailure()} (${fail.getRuleName()})`;
      })
      .join("\n");
  }
}
