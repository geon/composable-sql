
'use strict';

var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var ComposableSqlConstant = require('./ComposableSqlConstant');
var ComposableSqlColumn = require('./ComposableSqlColumn');
var quoteIdentifier = require('./quote').quoteIdentifier;
var indent = require('./indent').indent;

var _ = require('underscore')._;


module.exports = ComposableSqlEq;


function ComposableSqlEq (a, b) {

	if (!arguments.length == 2) {

		throw new Error('Eq needs 2 arguments.');
	}

	this.a = ComposableSqlExpression.cast(a);
	this.b = ComposableSqlExpression.cast(b);
}


ComposableSqlEq.prototype.__proto__ = ComposableSqlExpression.prototype;


ComposableSqlEq.prototype.compile = function (indentationLevel) {

	var aCompiledLines = this.a.compile(0);
	var bCompiledLines = this.b.compile(0);

	var operator = ' = ';

	if (this.b instanceof ComposableSqlConstant) {

		if (_.isNull(this.b.value)) {

			operator = ' IS ';
		}

		if (_.isArray(this.b.value)) {

			operator = ' IN ';
		}
	}

	return indent(indentationLevel, aCompiledLines + operator + bCompiledLines);
};
