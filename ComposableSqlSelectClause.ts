import { ComposableSqlExpression } from "./ComposableSqlExpression";
import { ComposableSqlColumn } from "./ComposableSqlColumn";
import { ComposableSqlTable } from "./ComposableSqlTable";
import { quoteIdentifier } from "./quote";
import { makeIndenter } from "./indent";

export class ComposableSqlSelectClause {
  expressions: ReadonlyArray<
    "*" | ComposableSqlExpression | ComposableSqlColumn | ComposableSqlTable
  >;

  constructor(
    expressions: ReadonlyArray<
      "*" | ComposableSqlExpression | ComposableSqlColumn | ComposableSqlTable
    >
  ) {
    this.expressions = expressions;
  }

  compile(indentationLevel) {
    return (
      "SELECT" +
      "\n" +
      this.expressions
        .map(function(expression) {
          if (expression == "*") {
            return "*";
          }

          // TODO: Other experessions needs to be supported.

          let tableName;
          let columnName;

          if (expression instanceof ComposableSqlColumn) {
            tableName = expression.table && expression.table.name;
            columnName = expression.name;
          } else {
            if (expression instanceof ComposableSqlTable) {
              tableName = expression.name;
            }
          }

          return (
            (tableName ? quoteIdentifier(tableName) + "." : "") +
            (columnName ? quoteIdentifier(columnName) : "*")
          );
        })
        .map(makeIndenter(indentationLevel + 1))
        .join("\n")
    );
  }
}
