interface SelectQueryDefinition {
  type: "select";
  select: ComposableSqlSelectClause;
  from: ComposableSqlFromClause;
  where: ComposableSqlWhereClause;
}

interface InsertSelectQueryDefinition {
  type: "insert-select";
  insert: ComposableSqlInsertClause;
  select: SelectQueryDefinition;
}

interface InsertQueryDefinition {
  type: "insert";
  insert: ComposableSqlInsertClause;
}

type QueryDefinition =
  | SelectQueryDefinition
  | InsertSelectQueryDefinition
  | InsertQueryDefinition;

export class ComposableSqlQuery {
  query: QueryDefinition;

  constructor(query: QueryDefinition) {
    this.query = query;
  }

  compile() {
    var sql;

    if (this.query.type === "insert") {
      sql = this.query.insert.compile(0) + ";";
      // } else if (this.query.type === "update") {
      //   throw new Error("Not implemented.");
    } else if (this.query.type === "select") {
      sql =
        [this.query.select, this.query.from, this.query.where]
          .map(part => part.compile(0))
          .join("\n") + ";";
    }

    return {
      text: sql,
      parameters: [1, 2, 3]
    };
  }
}
