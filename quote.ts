export function quoteIdentifier(identifier) {
  // TODO: Replace with proper implementation. Connection-specific?

  return '"' + identifier.replace(/"/g, '\\"') + '"';
}

export function quoteString(string) {
  // TODO: Replace with proper implementation. Connection-specific?

  return "'" + string.replace(/'/g, "\\'") + "'";
}
