// 'use strict';

var _ = require('underscore')._;


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


ComposableSqlColumn.cast = function (columnish) {

	if (columnish instanceof ComposableSqlColumn) {

		return columnish;
	}

	if (_.isString(columnish)) {

		return new ComposableSqlColumn({name: columnish});
	}
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

	ComposableSqlTable._columnCollections.push(this.columns);
	ComposableSqlTable._tablesMatchingColumnCollections.push(this);
}


ComposableSqlTable._columnCollections = [];
ComposableSqlTable._tablesMatchingColumnCollections = [];


ComposableSqlTable.findTableByColumns = function (columns) {

	var index = this._columnCollections.indexOf(columns);
	return this._tablesMatchingColumnCollections[index];
}


ComposableSqlTable.cast = function (tableish) {

	if (tableish instanceof ComposableSqlTable) {

		return tableish;
	}

	var owner = ComposableSqlTable.findTableByColumns(tableish);
	if (owner) {

		return owner;
	}

	// if (_.isString(tableish)) {

	// 	return new ComposableSqlTable({name: columnish});
	// }
}


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

	this.condition = definition.condition;
	this.type = definition.type || 'inner';
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

		var tableName;
		var columnName;

		var column = ComposableSqlColumn.cast(selected);
		if (column) {

			tableName  = column.table && column.table.name;
			columnName = column.name;

		} else {

			var table = ComposableSqlTable.cast(selected);
			if (table) {

				tableName  = table.name;
			}
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

	// if (typeof from != 'Array') {

	// 	from = [this.definition.from];
	// }

	return [quoteColumn(ComposableSqlTable.cast(from[0]).name)].concat(from.map(ComposableSqlJoin.cast).map(function (join) {

		return join.type + ' JOIN ' + quoteColumn(join.table.name) + ' ON ' + join.onExpression;
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

		var table = new ComposableSqlTable({
			name: name,
			columns: columns
		});

		return table.columns;
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
