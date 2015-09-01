
'use strict';


var ComposableSqlSelectClause = require('./ComposableSqlSelectClause');
var ComposableSqlFromClause = require('./ComposableSqlFromClause');
var ComposableSqlWhereClause = require('./ComposableSqlWhereClause');


module.exports = ComposableSqlQuery;


function ComposableSqlQuery (definition) {

	if (!arguments.length == 1) {

		throw new Error('Query needs 1 argument.');
	}

	this.definition = definition;
}


ComposableSqlQuery.prototype.compile = function () {

	var sql;

	if (this.definition.delete) {

		throw new Error('Not implemented.');

	} else if (this.definition.update) {

		throw new Error('Not implemented.');

	} else {

		var selectClause = new ComposableSqlSelectClause(this.definition.select);
		var   fromClause = new ComposableSqlFromClause  (this.definition.from  );
		var  whereClause = new ComposableSqlWhereClause (this.definition.where );

		sql = [
			selectClause.compile(0),
			  fromClause.compile(0),
			 whereClause.compile(0)
		].join("\n") + ';';
	}

	return {
		text: sql,
		parameters: [1, 2, 3]
	}
};
