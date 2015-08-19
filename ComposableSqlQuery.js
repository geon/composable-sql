
'use strict';


var ComposableSqlColumn = require('./ComposableSqlColumn');
var ComposableSqlTable = require('./ComposableSqlTable');
var ComposableSqlJoin = require('./ComposableSqlJoin');
var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var ComposableSqlAnd = require('./ComposableSqlAnd');
var quoteIdentifier = require('./quote').quoteIdentifier;

var _ = require('underscore')._;


module.exports = ComposableSqlQuery;


function ComposableSqlQuery (definition) {

	if (!arguments.length == 1) {

		throw new Error('Query needs 1 argument.');
	}

	this.definition = definition;
}


ComposableSqlQuery.prototype.compile = function () {

	function indent (line) {

		return "\t" + line;
	}

	var sql;

	if (this.definition.delete) {

		throw new Error('Not implemented.');

	} else if (this.definition.update) {

		throw new Error('Not implemented.');

	} else {

		sql = [
			'SELECT ' + "\n" + this.selectExpresionLines().map(indent).join(",\n"),
			'FROM ' + "\n" + this.fromLines().map(indent).join("\n"),
			'WHERE ' + "\n" + this.whereLines().map(indent).join("\n")
		].join("\n") + ';';
	}

	return {
		text: sql,
		parameters: [1, 2, 3]
	}
};


ComposableSqlQuery.prototype.selectExpresionLines = function () {

	if (this.definition.select == '*') {

		return ['*'];
	}

	return this.definition.select.map(function (selected) {

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
	});
}


ComposableSqlQuery.prototype.fromLines = function () {

	var from = this.definition.from;

	if (!_.isArray(from)) {

		from = [from];
	}

	var baseTable = ComposableSqlTable.cast(from[0]);
	var joins     = from.slice(1).map(ComposableSqlJoin.cast);

	return [quoteIdentifier(baseTable.name)]
		.concat(joins.map(function (join) {

			return join.type + ' JOIN ' + quoteIdentifier(join.table.name) + ' ON ' + join.onExpression.compile();
		}));
};


ComposableSqlQuery.prototype.whereLines = function () {

	var conditions = this.definition.where;
	if (!_.isArray(conditions)) {

		return conditions.compile();
	}

	return new ComposableSqlAnd(conditions).compile();
};
