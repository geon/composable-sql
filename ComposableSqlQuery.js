
'use strict';


var ComposableSqlSelectClause = require('./ComposableSqlSelectClause');
var ComposableSqlFromClause = require('./ComposableSqlFromClause');
var ComposableSqlWhereClause = require('./ComposableSqlWhereClause');


module.exports = ComposableSqlQuery;


function ComposableSqlQuery (definition) {

	if (!arguments.length == 1) {

		throw new Error('Query needs 1 argument.');
	}

	this.selectClause = new ComposableSqlSelectClause(definition.select);
	this.  fromClause = new ComposableSqlFromClause  (definition.from  );
	this. whereClause = new ComposableSqlWhereClause (definition.where );
}


ComposableSqlQuery.prototype.compile = function () {

	var sql;

	if (this.delete) {

		throw new Error('Not implemented.');

	} else if (this.update) {

		throw new Error('Not implemented.');

	} else {

		sql = [
			this.selectClause.compile(0),
			this.  fromClause.compile(0),
			this. whereClause.compile(0)
		].join("\n") + ';';
	}

	return {
		text: sql,
		parameters: [1, 2, 3]
	}
};
