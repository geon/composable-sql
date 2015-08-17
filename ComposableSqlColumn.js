
'use strict';

var ComposableSqlExpression = require('./ComposableSqlExpression');
var quoteIdentifier = require('./quote').quoteIdentifier;

var _ = require('underscore')._;


module.exports = ComposableSqlColumn;



function ComposableSqlColumn (definition) {

	if (!definition.name) {

		throw new Error('Missing name for column definition.');
	}

	definition.table && (this.table = definition.table);
	this.name = definition.name;
	definition.foreignKey && (this.foreignKey = definition.foreignKey);
}


ComposableSqlColumn.prototype.__proto__ = ComposableSqlExpression.prototype;


ComposableSqlColumn.cast = function (columnish) {

	if (columnish instanceof ComposableSqlColumn) {

		return columnish;
	}

	if (_.isString(columnish)) {

		return new ComposableSqlColumn({name: columnish});
	}
};


ComposableSqlColumn.prototype.compile = function () {

	return this.table && quoteIdentifier(this.table.name) + '.' + quoteIdentifier(this.name)
};
