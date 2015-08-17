'use strict';


var vows = require('vows');

var sql = require('./index');
var ComposableSqlEq = require('./ComposableSqlEq');


var users = sql.table('users', [
	'id',
	'name'
]);


var posts = sql.table('posts', [
	'id',
	'content',
	sql.column('userId', users.id)
]);


var comments = sql.table('comments', [
	'id',
	sql.column('postId', posts.id),
	sql.column('userId', users.id)
]);


function assert (condition) {

	if (!condition) {

		throw new Error();
	}
}


vows.describe('composable-sql')
	.addBatch({
		'eq': {
			topic: function () {

				var eq = new ComposableSqlEq(
					comments.postId,
					posts.id
				);

				return eq.compile();
			},

			'should compile to fully qualified column names': function (topic) {
				assert(topic == '"comments"."postId" = "posts"."id"');
			}
		}
	})
	.run();
