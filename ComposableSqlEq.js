
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

	var aCompiled = this.a.compile();
	var bCompiled = this.b.compile();

	if (bCompiled == 'NULL') {

		return aCompiled + ' IS NULL';
	}

	if (this.b instanceof ComposableSqlConstant && _.isArray(this.b.value)) {

		return aCompiled + ' IN ' + bCompiled;
	}

	return (
		aCompiled + ' = ' +
		bCompiled
	);
};
