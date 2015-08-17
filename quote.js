
'use strict';


module.exports = {quoteIdentifier: quoteIdentifier};


function quoteIdentifier (identifier) {

	// TODO: Replace with proper implementation. Connection-specific?

	return '"'+identifier.replace(/"/g, '\\"')+'"';
}
