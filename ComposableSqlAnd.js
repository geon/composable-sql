
'use strict';


var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var indent = require('./indent');


module.exports = ComposableSqlAnd;


function ComposableSqlAnd (expressions) {

	if (!arguments.length == 1) {

		throw new Error('And needs 1 argument.');
	}

	this.expressions = expressions.map(function (expression) {

		var castExpression = ComposableSqlExpression.cast(expression);

		if (!castExpression) {

			var error = new Error('Bad expression to And.');;
			error.badExpression = error;
			throw error;
		}

		return castExpression;
	});
}


ComposableSqlAnd.prototype.__proto__ = ComposableSqlExpression.prototype;


ComposableSqlAnd.prototype.compile = function () {

	return ['('].concat(this.expressions.map(function (expression, index, arr) {

		var compiled = expression.compile();
		compiled.push(compiled.pop() + (index < arr.length-1 ? ' AND' : ''));
		return compiled;

	}).reduce(function (soFar, next) { return soFar.concat(next);}, []).map(indent), [')']);
};