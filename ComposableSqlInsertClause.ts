import { makeIndenter } from "./indent";

export class ComposableSqlInsertClause {
  insertion: any;

  constructor(insertion: any) {
    this.insertion = insertion;
  }

  compile(indentationLevel) {
    var columnNames = Object.keys(this.insertion.table.columns);

    return (
      "INSERT INTO (" +
      columnNames.join(", ") +
      ") VALUES\n" +
      this.insertion.rows
        .map(function(row) {
          return (
            "(" +
            columnNames.map(function(columnName) {
              // TODO: Use prepared statements instead.
              return ComposableSqlExpression.cast(
                row[columnName] || null
              ).compile(indentationLevel + 1);
            }) +
            ")"
          );
        })
        .map(makeIndenter(indentationLevel + 1))
        .join(",\n")
    );
  }
}
