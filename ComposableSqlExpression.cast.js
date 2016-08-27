
var ComposableSqlExpression =  require('./ComposableSqlExpression');
var ComposableSqlConstant = require('./ComposableSqlConstant');
var ComposableSqlColumn = require('./ComposableSqlColumn');

var _ = require('underscore')._;


ComposableSqlExpression.cast = function (expressionish) {

	if (_.isString(expressionish) || _.isNumber(expressionish) || _.isNull(expressionish) || _.isArray(expressionish)) {

		return new ComposableSqlConstant(expressionish);
	}

	if (expressionish instanceof ComposableSqlExpression) {

		return expressionish;
	}

	var column = ComposableSqlColumn.cast(expressionish);
	if (column) {

		return column;
	}
};
