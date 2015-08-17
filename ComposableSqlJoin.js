
'use strict';


var ComposableSqlTable = require('./ComposableSqlTable');


module.exports = ComposableSqlJoin;


function ComposableSqlJoin (definition) {

	if (!definition.table) {

		throw new Error('Missing table for join definition.');
	}

	// if (!definition.condition) {

	// 	throw new Error('Missing condition for join definition.');
	// }

	this.table = ComposableSqlTable.cast(definition.table);

	if (!this.table) {

		throw new Error('Invalid table for join definition.');
	}

	this.onExpression = definition.condition || {compile:function(){return'fake';}};
	this.type = (definition.type || 'INNER').toUpperCase();
}


ComposableSqlJoin.cast = function (joinish) {

	if (joinish instanceof ComposableSqlJoin) {

		return joinish;
	}

	var table = ComposableSqlTable.cast(joinish);
	if (table) {

		return new ComposableSqlJoin({
			table: table
		});
	}
};
