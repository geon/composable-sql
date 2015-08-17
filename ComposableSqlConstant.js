
'use strict';


var ComposableSqlExpression = require('./ComposableSqlExpression');
var quoteString = require('./quote').quoteString;

var _ = require('underscore')._;


module.exports = ComposableSqlConstant;


function ComposableSqlConstant (value) {

	this.value = value;
}


ComposableSqlConstant.prototype = ComposableSqlExpression;


ComposableSqlConstant.cast = function (constantish) {

	if (constantish instanceof ComposableSqlConstant) {

		return constantish;
	}

	return new ComposableSqlConstant(constantish);
};


ComposableSqlConstant.prototype.compile = function () {

	function quoteConstant (value) {

		if (_.isString(value)) {

			return quoteString(value);
		}

		if (_.isNumber(value)) {

			return value.toString();
		}		
		
		if (_.isNull(value)) {

			return 'NULL';
		}		
		
		throw new Error('Unknown type of ComposableSqlConstant value.');
	}

	if (_.isArray(this.value)) {

		return (
			'(' +
			this.value
				.map(quoteConstant)
				.join(', ') +
			')'
		);
	}

	return quoteConstant(this.value);
};
