
'use strict';


var ComposableSqlTable = require('./ComposableSqlTable');


module.exports = ComposableSqlJoin;


function ComposableSqlJoin (definition) {

	if (!definition.table) {

		throw new Error('Missing table for join definition.');
	}

	this.table = ComposableSqlTable.cast(definition.table);

	if (!this.table) {

		throw new Error('Invalid table for join definition.');
	}

	this.onExpression = definition.condition;
	this.type = (definition.type || 'INNER').toUpperCase();
}


ComposableSqlJoin.cast = function (joinish) {

	if (joinish instanceof ComposableSqlJoin) {

		return joinish;
	}

	var table = ComposableSqlTable.cast(joinish);
	if (table) {

		return new ComposableSqlJoin({
			table: table
		});
	}
};


ComposableSqlJoin.prototype.compile = function (indentationLevel) {

	return (
		this.type + ' JOIN ' + this.table.compile(indentationLevel + 1) +
		' ON ' + this.onExpression.compile(indentationLevel + 1)
	);
};
