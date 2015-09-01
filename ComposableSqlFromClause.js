
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
	if (!this.baseTable) {

		throw new Error('FromClause needs a base table.');
	}

	this.joins = tables.slice(1).map(ComposableSqlJoin.cast);

	// Auto-join if no foreign key is explicitly set.
	this.joins.forEach(function (join) {

		if (!join.onExpression) {

			join.onExpression = {compile:function(){return'fake';}};
		}
	});
}


ComposableSqlFromClause.prototype.compile = function (indentationLevel) {

	return (
		'FROM' + "\n" +
		indent(indentationLevel + 1, this.baseTable.compile()) + "\n" +
		this.joins
			.map(function (join) {

				return indent(indentationLevel + 1,
					join.compile(indentationLevel + 1)
				);
			})
			.join("\n")
	);
};
