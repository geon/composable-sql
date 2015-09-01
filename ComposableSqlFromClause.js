
'use strict';


var ComposableSqlTable = require('./ComposableSqlTable');
var ComposableSqlJoin = require('./ComposableSqlJoin');
var indent = require('./indent').indent;
var quoteIdentifier = require('./quote').quoteIdentifier;

var _ = require('underscore')._;


module.exports = ComposableSqlFromClause;


function ComposableSqlFromClause (tables) {

	if (!arguments.length == 1) {

		throw new Error('FromClause needs 1 argument.');
	}

	// Optionally accept a single table.
	if (!_.isArray(tables)) {

		tables = [tables];
	}

	this.baseTable = ComposableSqlTable.cast(tables[0]);
	this.joins     = tables.slice(1).map(ComposableSqlJoin.cast);
}


ComposableSqlFromClause.prototype.compile = function (indentationLevel) {

	return (
		'FROM' + "\n" +
		this.joins
			.map(function (join) {

				return indent(indentationLevel + 1,
					join.type + ' JOIN ' + quoteIdentifier(join.table.name) +
					' ON ' + join.onExpression.compile(indentationLevel + 1)
				);
			})
			.join("\n")
	);
};
