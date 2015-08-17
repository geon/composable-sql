
'use strict';

var ComposableSqlColumn = require('./ComposableSqlColumn');
var quoteIdentifier = require('./quote').quoteIdentifier;


module.exports = ComposableSqlEq;


function ComposableSqlEq (a, b) {

	if (!arguments.length == 2) {

		throw new Error('Eq needs 2 arguments.');
	}

	this.a = a;
	this.b = b;
}


ComposableSqlEq.prototype.compile = function () {

	// if (_.isNull(b)) {

	// 	return this.a.compile() + ' IS NULL';
	// }

	// if (_.isArray(b)) {

	// 	return this.a.compile() + ' IN (' + b.map(function (b2) { return b2.compile(); }).join(', ') + ')';
	// }

	// return this.a.compile() + ' = ' + this.b.compile();

	return (
		quoteIdentifier(ComposableSqlColumn.cast(this.a).name) + ' = ' +
		quoteIdentifier(ComposableSqlColumn.cast(this.b).name)
	);
};
