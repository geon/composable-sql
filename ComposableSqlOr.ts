import { ComposableSqlExpression } from "./ComposableSqlExpression";
import { makeIndenter, indent } from "./indent";

export class ComposableSqlOr {
  expressions: ReadonlyArray<ComposableSqlExpression>;

  constructor(expressions) {
    this.expressions = expressions;
  }

  compile(indentationLevel) {
    return (
      "(" +
      "\n" +
      this.expressions
        .map(expression => expression.compile(indentationLevel + 1))
        .map(makeIndenter(indentationLevel + 1))
        .join(" OR" + "\n") +
      "\n" +
      indent(indentationLevel, ")")
    );
  }
}
