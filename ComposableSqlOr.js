
'use strict';


var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var makeIndenter = require('./indent').makeIndenter;
var indent = require('./indent').indent;


module.exports = ComposableSqlOr;


function ComposableSqlOr (expressions) {

	if (!arguments.length == 1) {

		throw new Error('Or needs 1 argument.');
	}

	this.expressions = expressions.map(function (expression) {

		var castExpression = ComposableSqlExpression.cast(expression);

		if (!castExpression) {

			var error = new Error('Bad expression to Or.');;
			error.badExpression = error;
			throw error;
		}

		return castExpression;
	});
}


ComposableSqlOr.prototype.__proto__ = ComposableSqlExpression.prototype;


ComposableSqlOr.prototype.compile = function (indentationLevel) {

	return '(' + "\n" +
		this.expressions
			.map(function (expression) {

				return expression.compile(indentationLevel + 1);
			})
			.map(makeIndenter(indentationLevel + 1))
			.join(' OR'+ "\n") + "\n" +
		indent(indentationLevel, ')');
};
