
'use strict';

var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var indent = require('./indent').indent;


module.exports = ComposableSqlFunctionCall;


function ComposableSqlFunctionCall (functionName, args) {

	this.functionName = functionName;
	this.args = args
		? Array.prototype.map.apply(args, [ComposableSqlExpression.cast])
		: [];
}


ComposableSqlFunctionCall.prototype.__proto__ = ComposableSqlExpression.prototype;


ComposableSqlFunctionCall.prototype.compile = function (indentationLevel) {

	return indent(indentationLevel, this.functionName) + '(' + this.args.map(function (expression) {

		return expression.compile(0);

	}).join(', ') + ')';
};
