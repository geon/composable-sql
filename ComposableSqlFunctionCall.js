
'use strict';

var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');


module.exports = ComposableSqlFunctionCall;


function ComposableSqlFunctionCall (functionName, args) {

	this.functionName = functionName;
	this.args = args
		? Array.prototype.map.apply(args, [ComposableSqlExpression.cast])
		: [];
}


ComposableSqlFunctionCall.prototype.__proto__ = ComposableSqlExpression.prototype;


ComposableSqlFunctionCall.prototype.compile = function () {

	return this.functionName + '(' + this.args.map(function (expression) {

		return expression.compile();

	}).join(', ') + ')';
};
