'use strict';


var vows = require('vows');

var sql = require('./index');
var ComposableSqlEq = require('./ComposableSqlEq');
var ComposableSqlConstant = require('./ComposableSqlConstant');
var ComposableSqlFromClause = require('./ComposableSqlFromClause');


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
		'ComposableSqlEq': {
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
	.addBatch({
		'ComposableSqlConstant string': {
			topic: function () {

				var c = new ComposableSqlConstant('foo');

				return c.compile();
			},

			'should compile to quoted string': function (topic) {
				assert(topic == '\'foo\'');
			}
		},
		'ComposableSqlConstant number': {
			topic: function () {

				var c = new ComposableSqlConstant(123);

				return c.compile();
			},

			'should compile to number': function (topic) {
				assert(topic == '123');
			}
		},
		'ComposableSqlConstant null': {
			topic: function () {

				var c = new ComposableSqlConstant(null);

				return c.compile();
			},

			'should compile to number': function (topic) {
				assert(topic == 'NULL');
			}
		},
		'ComposableSqlConstant array': {
			topic: function () {

				var c = new ComposableSqlConstant([123, 42, 1337]);

				return c.compile();
			},

			'should compile to "list"': function (topic) {
				assert(topic == '(123, 42, 1337)');
			}
		}
	})
	.addBatch({
		'ComposableSqlFromClause single table': {
			topic: function () {

				return new ComposableSqlFromClause(users);
			},

			'should have a base table': function (topic) {
				assert(topic.baseTable.columns == users);
			},

			'should have no joins': function (topic) {
				assert(!topic.joins.length);
			}
		},

		'ComposableSqlFromClause explicit join': {
			topic: function () {

				return new ComposableSqlFromClause([
					users,
					sql.join(
						comments,
						sql.eq(
							comments.userId,
							users.id
						),
						'left'
					)
				]);
			},

			'should have a base table': function (topic) {
				assert(topic.baseTable.columns == users);
			},

			'should be joined to the right table': function (topic) {
				assert(topic.joins[0].table.columns == comments);
			},

			'should be joined the right way': function (topic) {
				assert(topic.joins[0].type == 'LEFT');
			},

			'should be joined on the right condition': function (topic) {
				assert(
					topic.joins[0].onExpression instanceof ComposableSqlEq &&
					topic.joins[0].onExpression.a == comments.userId &&
					topic.joins[0].onExpression.b == users.id
				);
			}
		},

		'ComposableSqlFromClause automatic join to previous tables': {
			topic: function () {

				return new ComposableSqlFromClause([
					users,
					comments
				]);
			},

			'should have a base table': function (topic) {
				assert(topic.baseTable.columns == users);
			},

			'should be joined to the right table': function (topic) {
				assert(topic.joins[0].table.columns == comments);
			},

			'should be joined the right way': function (topic) {
				assert(topic.joins[0].type == 'INNER');
			},

			'should be joined on the right condition': function (topic) {
				assert(
					topic.joins[0].onExpression instanceof ComposableSqlEq &&
					topic.joins[0].onExpression.a == comments.userId &&
					topic.joins[0].onExpression.b == users.id
				);
			}
		},

		'ComposableSqlFromClause automatic join from previous tables': {
			topic: function () {

				return new ComposableSqlFromClause([
					comments,
					users
				]);
			},

			'should have a base table': function (topic) {
				assert(topic.baseTable.columns == comments);
			},

			'should be joined to the right table': function (topic) {
				assert(topic.joins[0].table.columns == users);
			},

			'should be joined the right way': function (topic) {
				assert(topic.joins[0].type == 'INNER');
			},

			'should be joined on the right condition': function (topic) {
				assert(
					topic.joins[0].onExpression instanceof ComposableSqlEq &&
					topic.joins[0].onExpression.a == users.id &&
					topic.joins[0].onExpression.b == comments.userId
				);
			}
		}
	})
	.run();
