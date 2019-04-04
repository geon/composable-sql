export interface ComposableSqlExpression {
  // Abstract class.
  compile: (indentationLevel: number) => string;
}
