export function makeIndenter(indentationLevel: number) {
  var indentation = "";

  for (var i = 0; i < indentationLevel; i++) {
    indentation += "\t";
  }

  return function(line) {
    return indentation + line;
  };
}

export function indent(indentationLevel: number, line: string) {
  return makeIndenter(indentationLevel)(line);
}
