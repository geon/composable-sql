
'use strict';


var ComposableSqlTable = require('./ComposableSqlTable');
var ComposableSqlJoin = require('./ComposableSqlJoin');
var ComposableSqlEq = require('./ComposableSqlEq');
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
	this.joins.forEach(function (join, index, joins) {

		// Respect explicit joins.
		if (join.onExpression) {
			return;
		}

		// A join can refer to any of the earlier tables.
		var earlierTables = joins
			.slice(0, index)
			.map(function (join) {

				return join.table;
			})
			.reverse();
		earlierTables.push(this.baseTable);

		// Joins can be automatically detected when earlier tables have
		// columns with foreign keys to the table in this join.
		var earlierColumnsWithForeignKey = _.flatten(earlierTables
			.map(function (table) {

				return table.columns && _.values(table.columns)
					.filter(function (column) {

						return !!column.foreignKey;
					});
			})
			// TODO: This seems redundant. Won't flatten just concatenate the empty arrays anyway?
			.filter(function (foreignKeys) {

				return !!foreignKeys.length
			})
		);

		// If there is one, join to the first column that
		// has a foreign key to the table in this join.
		// TODO: Rewrite with .find().
		for (var i = 0; i < earlierColumnsWithForeignKey.length; i++) {
			var column = earlierColumnsWithForeignKey[i];

			if (column.foreignKey.table == join.table) {

				join.onExpression = new ComposableSqlEq(
					join.table.columns[column.foreignKey.name],
					column
				);
				return;
			}
		}

		// Check if any of the columns in the table of this
		// join has a foreign key to a previous table.
		var localColumnsWithForeignKey = _.values(join.table.columns)
			.filter(function (column) {

				return !!column.foreignKey;
			});
		for (var i = 0; i < localColumnsWithForeignKey.length; i++) {
			var column = localColumnsWithForeignKey[i];

			for (var j = 0; j < earlierTables.length; j++) {
				var earlierTable = earlierTables[j];

				if (column.foreignKey.table == earlierTable) {

					join.onExpression = new ComposableSqlEq(
						column,
						earlierTable.columns[column.foreignKey.name]
					);
					return;
				}
			}
		}


		throw new Error('No matching foreign key.');
	}.bind(this));
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
