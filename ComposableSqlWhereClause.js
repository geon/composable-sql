
'use strict';


var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var ComposableSqlAnd = require('./ComposableSqlAnd');
var indent = require('./indent').indent;

var _ = require('underscore')._;


module.exports = ComposableSqlWhereClause;


function ComposableSqlWhereClause (expression) {

	if (!arguments.length == 1) {

		throw new Error('WhereClause needs 1 argument.');
	}

	// Optionally accept an array to be AND:ed instead of a single expression.
	if (_.isArray(expression)) {

		this.expression = new ComposableSqlAnd(expression);

	} else {

		this.expression = ComposableSqlExpression.cast(expression);
	}

	if (!this.expression) {

		var error = new Error('Bad expression to WhereClause.');;
		error.badExpression = expression;
		throw error;
	}
}


ComposableSqlWhereClause.prototype.compile = function (indentationLevel) {

	return (
		'WHERE' + "\n" +
		indent(indentationLevel + 1, this.expression.compile(indentationLevel + 1))
	);
};
