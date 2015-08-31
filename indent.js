
'use strict';

module.exports = {
	makeIndenter: makeIndenter,
	indent: indent
};


function makeIndenter (indentationLevel) {

	var indentation = '';

	for (var i = 0; i < indentationLevel; i++) {
	
		indentation += "\t";
	}

	return function (line) {

		return indentation + line;
	};
}


function indent (indentationLevel, line) {

	return makeIndenter(indentationLevel)(line);
}
