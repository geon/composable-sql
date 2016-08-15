
var sql = require('./index.js');


var users = sql.table('users', [
	'id',
	'name'
]);


var posts = sql.table('posts', [
	'id',
	'content',
	'created',
	'isPublished',
	'isDeleted',
	sql.column('userId', users.id)
]);


var comments = sql.table('comments', [
	'id',
	sql.column('postId', posts.id),
	sql.column('userId', users.id)
]);


var query = sql.query({

	// Single column, or array.
	select: [
		users.name,           // Column symbolically
		comments,             // Entire table
		sql.column('content') // Column by name
	],

	// Single expression, or array. Arrays are AND by defalut, but can be used in an OR explicitly.
	where: [
		sql.eq(
			sql.date(posts.created),
			sql.date(sql.now())
		),
		sql.eq(
			users.name,
			[
				'geon',
				'neon',
				'peon'
			]
		),
		// sql.or takes an array. A single expression doesn't make sense.
		sql.or([
			sql.not(posts.isPublished),
			posts.isDeleted
		])
	],

	// Single table, or array.
	// from: posts,
	from: [
		posts, // First one is always just a table.
		users, // Uses the foreign key by default.
		// Can be explicit.
		sql.join(
			comments,
			sql.eq(
				comments.postId,
				posts.id
			),
			'left'
		)
	]

});

var result = query.compile();

console.log(result.text);
console.log(result.parameters);
