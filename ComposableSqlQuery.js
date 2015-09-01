
'use strict';


var ComposableSqlColumn = require('./ComposableSqlColumn');
var ComposableSqlTable = require('./ComposableSqlTable');
var ComposableSqlJoin = require('./ComposableSqlJoin');
var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var ComposableSqlWhereClause = require('./ComposableSqlWhereClause');
var quoteIdentifier = require('./quote').quoteIdentifier;
var makeIndenter = require('./indent').makeIndenter;
var indent = require('./indent').indent;

var _ = require('underscore')._;


module.exports = ComposableSqlQuery;


function ComposableSqlQuery (definition) {

	if (!arguments.length == 1) {

		throw new Error('Query needs 1 argument.');
	}

	this.definition = definition;
}


ComposableSqlQuery.prototype.compile = function () {

	var sql;

	if (this.definition.delete) {

		throw new Error('Not implemented.');

	} else if (this.definition.update) {

		throw new Error('Not implemented.');

	} else {

		var whereClause = new ComposableSqlWhereClause(this.definition.where);

		sql = [
			'SELECT ' + "\n" + this.selectExpressionList(1),
			'FROM ' + "\n" + this.fromTables(1),
			whereClause.compile(0)
		].join("\n") + ';';
	}

	return {
		text: sql,
		parameters: [1, 2, 3]
	}
};


ComposableSqlQuery.prototype.selectExpressionList = function (indentationLevel) {

	return this.definition.select == '*'
		? ['*']
		: this.definition.select.map(function (selected) {

			var tableName;
			var columnName;

			var column = ComposableSqlColumn.cast(selected);
			if (column) {

				tableName  = column.table && column.table.name;
				columnName = column.name;

			} else {

				var table = ComposableSqlTable.cast(selected);
				if (table) {

					tableName  = table.name;
				}
			}

			return (
				tableName
					? quoteIdentifier(tableName)+'.'
					: ''
			) + (
				columnName
					? quoteIdentifier(columnName)
					: '*'
			);
		})
			.map(makeIndenter(indentationLevel))
			.join("\n");
}


ComposableSqlQuery.prototype.fromTables = function (indentationLevel) {

	var from = this.definition.from;

	if (!_.isArray(from)) {

		from = [from];
	}

	var baseTable = ComposableSqlTable.cast(from[0]);
	var joins     = from.slice(1).map(ComposableSqlJoin.cast);

	return [quoteIdentifier(baseTable.name)]
		.concat(joins.map(function (join) {

			return (
				join.type + ' JOIN ' + quoteIdentifier(join.table.name) +
				' ON ' + join.onExpression.compile(0)
			);
		}))
		.map(makeIndenter(indentationLevel))
		.join("\n");
};
