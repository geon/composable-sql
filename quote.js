
'use strict';


module.exports = {
	quoteIdentifier: quoteIdentifier,
	quoteString: quoteString
};


function quoteIdentifier (identifier) {

	// TODO: Replace with proper implementation. Connection-specific?

	return '"'+identifier.replace(/"/g, '\\"')+'"';
}

function quoteString (string) {

	// TODO: Replace with proper implementation. Connection-specific?

	return '\''+string.replace(/'/g, '\\\'')+'\'';
}
