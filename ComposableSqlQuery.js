
'use strict';


var ComposableSqlSelectClause = require('./ComposableSqlSelectClause');
var ComposableSqlFromClause = require('./ComposableSqlFromClause');
var ComposableSqlWhereClause = require('./ComposableSqlWhereClause');


module.exports = ComposableSqlQuery;


function ComposableSqlQuery (query) {

	if (!arguments.length == 1) {

		throw new Error('Query needs 1 argument.');
	}

	this.select = query.select && new ComposableSqlSelectClause(query.select);
	this.from   = query.from   && new ComposableSqlFromClause  (query.from  );
	this.where  = query.where  && new ComposableSqlWhereClause (query.where );
}


ComposableSqlQuery.prototype.compile = function () {

	var sql;

	if (this.delete) {

		throw new Error('Not implemented.');

	} else if (this.update) {

		throw new Error('Not implemented.');

	} else {

		sql = [
			this.select.compile(0),
			this.from  .compile(0),
			this.where .compile(0)
		].join("\n") + ';';
	}

	return {
		text: sql,
		parameters: [1, 2, 3]
	}
};
