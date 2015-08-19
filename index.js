'use strict';

var ComposableSqlQuery = require('./ComposableSqlQuery');
var ComposableSqlTable = require('./ComposableSqlTable');
var ComposableSqlJoin = require('./ComposableSqlJoin');
var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var ComposableSqlColumn = require('./ComposableSqlColumn');
var ComposableSqlEq = require('./ComposableSqlEq');
var ComposableSqlAnd = require('./ComposableSqlAnd');
var ComposableSqlOr = require('./ComposableSqlOr');
var ComposableSqlFunctionCall = require('./ComposableSqlFunctionCall');

var _ = require('underscore')._;


module.exports = {

	column: function (name, foreignKey) {

		return new ComposableSqlColumn({
			name: name,
			foreignKey: foreignKey
		});
	},


	table: function (name, columns) {

		var table = new ComposableSqlTable({
			name: name,
			columns: columns
		});

		return table.columns;
	},


	join: function (table, condition, type) {

		return new ComposableSqlJoin({
			table: table,
			condition: condition,
			type: type
		});		
	},


	eq: function (a, b) {

		return new ComposableSqlEq(a, b);		
	},


	not: function (expression) {

		return new ComposableSqlFunctionCall('NOT', arguments);
	},


	and: function (expressions) {

		return new ComposableSqlAnd(expressions);		
	},


	or: function (expressions) {

		return new ComposableSqlOr(expressions);		
	},


	date: function (foo) {

		return new ComposableSqlFunctionCall('DATE', arguments);
	},


	now: function () {

		return new ComposableSqlFunctionCall('NOW', []);
	},


	query: function (definition) {

		return new ComposableSqlQuery(definition);				
	}
};
