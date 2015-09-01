
'use strict';


var ComposableSqlColumn = require('./ComposableSqlColumn');
var ComposableSqlTable = require('./ComposableSqlTable');
var indent = require('./indent').indent;
var makeIndenter = require('./indent').makeIndenter;
var quoteIdentifier = require('./quote').quoteIdentifier;

var _ = require('underscore')._;


module.exports = ComposableSqlSelectClause;


function ComposableSqlSelectClause (expressions) {

	if (!arguments.length == 1) {

		throw new Error('FromClause needs 1 argument.');
	}

	// Optionally accept a single column.
	if (!_.isArray(expressions)) {

		tables = [tables];
	}

	this.expressions = expressions.map(function (expression) {

		if (expression == '*') {

			return '*';
		}

		// TODO: Other experessions needs to be supported.

		var castExpression = ComposableSqlColumn.cast(expression) || ComposableSqlTable.cast(expression);
		if (!castExpression) {

			var error = new Error('Bad expression to SelectClause.');;
			error.badExpression = castExpression;
			throw error;
		}

		return castExpression;
	});
}


ComposableSqlSelectClause.prototype.compile = function (indentationLevel) {

	return (
		'SELECT' + "\n" +
		this.expressions
			.map(function (expression) {

				if (expression == '*') {

					return '*';
				}

				// TODO: Other experessions needs to be supported.

				var tableName;
				var columnName;

				if (expression instanceof ComposableSqlColumn) {

					tableName  = expression.table && expression.table.name;
					columnName = expression.name;

				} else {

					if (expression instanceof ComposableSqlTable) {

						tableName  = expression.name;
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
			.map(makeIndenter(indentationLevel + 1))
			.join("\n")
	);
};
