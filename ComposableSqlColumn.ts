import { quoteIdentifier } from "./quote";
import { ComposableSqlTable } from "./ComposableSqlTable";

interface ColumnDefinition {
  name: string;
  table?: ComposableSqlTable;
  foreignKey?: string;
}

export class ComposableSqlColumn implements ColumnDefinition {
  name: string;
  table?: ComposableSqlTable;
  foreignKey?: string;

  constructor(definition: ColumnDefinition) {
    this.name = definition.name;
    this.table = definition.table;
    this.foreignKey = definition.foreignKey;
  }

  compile() {
    return (
      this.table &&
      quoteIdentifier(this.table.name) + "." + quoteIdentifier(this.name)
    );
  }
}
