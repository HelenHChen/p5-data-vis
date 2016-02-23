function Table(filename, delimeter) {
	
	this.data = new Array(0);
	this.delimeter = delimeter;
	this.rowNames = new Array(0);
	this.columnNames = new Array(0);
	
	var callBack = function(rows) {

		var rowCount = 0;
		this.columnNames = rows[0].trim().split(this.delimeter);
		
		for (var i = 1; i < rows.length; i++) {
			var currRow = rows[i].trim();
			
			if (currRow.length === 0 || currRow.startsWith('#')) {
				continue;
			}
			
			this.data[rowCount] = currRow.split(this.delimeter);
			this.rowNames[rowCount] = this.data[rowCount++][0];
			
		}
		
	}
	
	loadStrings(filename, callBack.bind(this));
		
}

Table.prototype.getRowCount = function() {
	return this.data.length;
}

Table.prototype.getRowNames = function() {
	return this.rowNames;
}

Table.prototype.getColumnName = function(columnNum) {
	return this.columnNames[columnNum];
}

Table.prototype.getColumnCount = function() {
	return this.columnNames.length;
}

Table.prototype.getValue = function(rowNum, colNum) {
	return this.data[rowNum][colNum];
}

Table.prototype.getRowIndex = function(rowName) {
	for (var i = 0; i < this.data.length; i++) {
		if (this.getValue(i, 0) === rowName) {
			return i;
		}
	}
}

Table.prototype.getColumnMinVal = function(colNum) {
	
	var min = Number.MAX_VALUE;
	
	for (var i = 0; i < this.data.length; i++) {
		var currVal = Number.parseFloat(this.data[i][colNum]);
		if (currVal < min) {
			min = currVal;
		}
	}
	
	return min;
	
}

Table.prototype.getColumnMaxVal = function(colNum) {
	
	var max = this.data[0][colNum];
	
	for (var i = 1; i < this.data.length; i++) {
		var currVal = Number.parseFloat(this.data[i][colNum]);
		if (currVal > max) {
			max = currVal;
		}
	}
	
	return max;
	
}

Table.prototype.getTableMax = function() {
	
	var max = Number.MIN_VALUE;
	
	for (var i = 1; i < this.columnNames.length; i++) {
		var currVal = this.getColumnMaxVal(i);
		if (currVal > max) {
			max = currVal;
		}
	}
	
	return max;
	
}

Table.prototype.isValid = function(row, col) {
    if (row < 0 || row >= this.getRowCount()) return false;
    if (col < 0 || col >= this.getColumnCount()) return false;
	var checkVal = +(this.data[row][col]);
    return typeof checkVal === 'number' && !isNaN(checkVal);	
}