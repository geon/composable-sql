
'use strict';


var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var quoteIdentifier = require('./quote').quoteIdentifier;
var ComposableSqlTable = require('./ComposableSqlTable');
var makeIndenter = require('./indent').makeIndenter;


module.exports = ComposableSqlInsertClause;


function ComposableSqlInsertClause (insertion) {

	if (!arguments.length == 1) {

		throw new Error('FromClause needs 1 argument.');
	}

	var castTable = ComposableSqlTable.cast(insertion.table);
	if (!castTable) {

		var error = new Error('Bad table.');;
		error.badTable = insertion.table;
		throw error;
	}

	if (!insertion.rows) {

		throw new Error('Bad rows.');
	}

	this.insertion = {
		table: castTable,
		rows: insertion.rows
	};
}


ComposableSqlInsertClause.prototype.compile = function (indentationLevel) {

	var columnNames = Object.keys(this.insertion.table.columns)

	return (
		'INSERT INTO (' + columnNames.join(', ') + ") VALUES\n" +
		this.insertion.rows
			.map(function (row) {

				return (
					'(' +
					columnNames
						.map(function (columnName) {
							// TODO: Use prepared statements instead.
							return ComposableSqlExpression.cast(
								row[columnName] || null
							).compile(indentationLevel + 1);
						}) +
					')'
				);
			})
			.map(makeIndenter(indentationLevel + 1))
			.join(",\n")
	);
};
