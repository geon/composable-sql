
'use strict';


var ComposableSqlColumn = require('./ComposableSqlColumn');


module.exports = ComposableSqlTable;


function ComposableSqlTable (definition) {

	if (!definition.name) {

		throw new Error('Missing name for table definition.');
	}

	if (!definition.columns) {

		throw new Error('Missing columns for table definition.');
	}

	this.name = definition.name;
	this.columns = function (columns) {

		var obj = {}

		columns.forEach(function (column) {

			obj[column.name] = column;
		});

		return obj;

	}(definition.columns.map(function (definition) {

		var d = {
			table: this
		};

		if (definition instanceof ComposableSqlColumn) {

			d.name = definition.name;
			definition.foreignKey && (d.foreignKey = definition.foreignKey);

		} else {

			d.name = definition;
		}

		return new ComposableSqlColumn(d);

	}.bind(this)));

	ComposableSqlTable._columnCollections.push(this.columns);
	ComposableSqlTable._tablesMatchingColumnCollections.push(this);
}


ComposableSqlTable._columnCollections = [];
ComposableSqlTable._tablesMatchingColumnCollections = [];


ComposableSqlTable.findTableByColumns = function (columns) {

	var index = this._columnCollections.indexOf(columns);
	return this._tablesMatchingColumnCollections[index];
}


ComposableSqlTable.cast = function (tableish) {

	if (tableish instanceof ComposableSqlTable) {

		return tableish;
	}

	var owner = ComposableSqlTable.findTableByColumns(tableish);
	if (owner) {

		return owner;
	}

	// if (_.isString(tableish)) {

	// 	return new ComposableSqlTable({name: columnish});
	// }
}
