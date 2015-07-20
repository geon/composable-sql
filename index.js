
function quoteColumn (columnName) {

	return '"'+columnName.replace(/"/g, '\\"')+'"';
}


function ComposableSqlColumn (definition) {

	if (!definition.name) {

		throw new Error('Missing name for column definition.');
	}

	definition.table && (this.table = definition.table);
	this.name = definition.name;
	definition.foreignKey && (this.foreignKey = definition.foreignKey);
}


function ComposableSqlTable (definition) {

	if (!definition.name) {

		throw new Error('Missing name for table definition.');
	}

	if (!definition.columns) {

		throw new Error('Missing columns for table definition.');
	}

	this.name = definition.name;
	this.columns = function (columns) {

		var obj = {}

		columns.forEach(function (column) {

			obj[column.name] = column;
		});

		return obj;

	}(definition.columns.map(function (definition) {

		var d = {
			table: this
		};

		if (definition instanceof ComposableSqlColumn) {

			d.name = definition.name;
			definition.foreignKey && (d.foreignKey = definition.foreignKey);

		} else {

			d.name = definition;
		}

		return new ComposableSqlColumn(d);

	}.bind(this)));
}


function ComposableSqlJoin (definition) {

	if (!definition.table) {

		throw new Error('Missing table for join definition.');
	}

	if (!definition.condition) {

		throw new Error('Missing condition for join definition.');
	}

	this.table = definition.table;
	this.condition = definition.condition;
	this.type = definition.type || 'inner';
}


function ComposableSqlEq (a, b) {

	if (!arguments.length == 2) {

		throw new Error('Eq needs 2 arguments.');
	}

	this.a = a;
	this.b = b;
}


function ComposableSqlNot (expression) {

	if (!arguments.length == 1) {

		throw new Error('Not needs 1 argument.');
	}

	this.expression = expression;
}


function ComposableSqlOr (expressions) {

	if (!arguments.length == 1) {

		throw new Error('Or needs 1 argument.');
	}

	this.expressions = expressions;
}


function ComposableSqlQuery (definition) {

	if (!arguments.length == 1) {

		throw new Error('Query needs 1 argument.');
	}

	this.definition = definition;
}


function ComposableSqlDate (expression) {

	if (!arguments.length == 1) {

		throw new Error('Date needs 1 argument.');
	}

	this.expression = expression;
}


ComposableSqlQuery.prototype.compile = function () {

	var sql;

	if (this.definition.delete) {

		throw new Error('Not implemented.');

	} else if (this.definition.update) {

		throw new Error('Not implemented.');

	} else {

		function indent (line) {

			return "\t" + line;
		}

		sql = [
			'SELECT ' + "\n" + this.selectExpresions().map(indent).join(",\n"),
			'FROM ' + "\n" + this.fromTables().map(indent).join("\n")
		].join("\n")
	}

	return {
		text: sql,
		parameters: [1, 2, 3]
	}
};


ComposableSqlQuery.prototype.selectExpresions = function () {

	if (this.definition.select == '*') {

		return ['*'];
	}

	return this.definition.select.map(function (selected) {

		var tableName, columnName;
		if (selected instanceof ComposableSqlColumn) {

			tableName  = selected.table.name;
			columnName = selected.name;

		} else if (selected instanceof ComposableSqlTable) {
			
			tableName  = selected.name;

		} else {

			columnName = selected;
		}


		return (
			tableName
				? quoteColumn(tableName)+'.'
				: ''
		) + (
			columnName
				? quoteColumn(columnName)
				: '*'
		);
	});
}


ComposableSqlQuery.prototype.fromTables = function () {

	var from = this.definition.from;
	console.log(from);

	// if (typeof from != 'Array') {

	// 	from = [this.definition.from];
	// }

	return [from[0].name].concat(from.slice(1).map(function (table) {

		var type = 'INNER';
		var tableName;
		var onExpression = 'fakefakefake';

		if (table instanceof ComposableSqlJoin) {

			tableName = table.table.name;
			type = table.type.toUpperCase();

		} else if (ComposableSqlTable) {

			tableName = table.name;
	
		} else {

			throw new Error('What to do here? Implementation incomplete.');
		}

		var type = 'INNER';
		return type + ' JOIN ' + quoteColumn(tableName) + ' ON ' + onExpression;
	}));
};


module.exports = {

	column: function (name, foreignKey) {

		return new ComposableSqlColumn({
			name: name,
			foreignKey: foreignKey
		});
	},


	table: function (name, columns) {

		return new ComposableSqlTable({
			name: name,
			columns: columns
		});
	},


	join: function (table, condition, type) {

		return new ComposableSqlJoin({
			table: table,
			condition: condition,
			type: type
		});		
	},


	eq: function (a, b) {

		return new ComposableSqlEq(a, b);		
	},


	not: function (expression) {

		return new ComposableSqlNot(expression);		
	},


	or: function (expressions) {

		return new ComposableSqlOr(expressions);		
	},


	date: function (expression) {

		return new ComposableSqlDate(expression);		
	},


	query: function (definition) {

		return new ComposableSqlQuery(definition);				
	}
};
