
'use strict';

var ComposableSqlExpression = require('./ComposableSqlExpression'); require('./ComposableSqlExpression.cast');
var ComposableSqlConstant = require('./ComposableSqlConstant');
var ComposableSqlColumn = require('./ComposableSqlColumn');
var quoteIdentifier = require('./quote').quoteIdentifier;

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


ComposableSqlEq.prototype.compile = function () {

	var aCompiledLines = this.a.compile();
	var bCompiledLines = this.b.compile();

	var operator = ' = ';

	if (this.b instanceof ComposableSqlConstant) {

		if (_.isNull(this.b.value)) {

			operator = ' IS ';
		}

		if (_.isArray(this.b.value)) {

			operator = ' IN ';
		}
	}

	var joiningLine = aCompiledLines.pop() + operator + bCompiledLines.pop();
	return aCompiledLines.concat([joiningLine], bCompiledLines);
};
