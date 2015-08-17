'use strict';


var vows = require('vows');

var sql = require('./index');
var ComposableSqlEq = require('./ComposableSqlEq');
var ComposableSqlConstant = require('./ComposableSqlConstant');


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
	.run();
