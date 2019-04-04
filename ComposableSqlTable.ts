import { quoteIdentifier } from "./quote";
import { ComposableSqlColumn } from "./ComposableSqlColumn";

interface TableDefinition {
  name: string;
  columns: ReadonlyArray<ComposableSqlColumn>;
}

export class ComposableSqlTable implements TableDefinition {
  name: string;
  columns: ReadonlyArray<ComposableSqlColumn>;

  //   static _columnCollections: Array<ReadonlyArray<ComposableSqlColumn>> = [];
  //   static _tablesMatchingColumnCollections: Array<ComposableSqlTable> = [];

  constructor(definition: TableDefinition) {
    this.name = definition.name;
    this.columns = definition.columns;

    // ComposableSqlTable._columnCollections.push(this.columns);
    // ComposableSqlTable._tablesMatchingColumnCollections.push(this);
  }

  //   findTableByColumns(columns) {
  //     var index = this._columnCollections.indexOf(columns);
  //     return this._tablesMatchingColumnCollections[index];
  //   }

  compile() {
    return quoteIdentifier(this.name);
  }
}
