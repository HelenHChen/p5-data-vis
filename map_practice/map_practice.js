var mapImage;
var locationTable;
var dataTable;
var rowCount;
var minDist;
var labelText;
var labelX;
var labelY;

function preload() {
	mapImage = loadImage("data/map.png");
	var delimeter = '\t';
	locationTable = new Table("data/locations.tsv", delimeter);
	dataTable = new Table("data/random.tsv", delimeter);
}

function setup() {
	
	createCanvas(640, 480);
	rowCount = locationTable.getRowCount();
	
}

function draw() {
	
	background(255);
	fill("blue");
	image(mapImage, 0, 0);
	smooth();
	noStroke();
	minDist = Number.MAX_VALUE;
	
	for (var i = 0; i < rowCount; i++) {
		var abbrev = locationTable.getValue(i, 0);
		var x = locationTable.getValue(i, 1);
		var y = locationTable.getValue(i, 2);
		
		drawData(x, y, abbrev);
	}
	
	if (minDist != Number.MAX_VALUE) {
		fill(100);
		rectMode(CENTER);
		rect(labelX, labelY, 60, 15, 5);
		fill(0);
		textAlign(CENTER);
		text(labelText, labelX, labelY, 60, 15);		
	}
	
}

function drawData(x, y, abbrev) {

	var rowIndex = dataTable.getRowIndex(abbrev);
	var value = dataTable.getValue(rowIndex, 1);
	var size;
	
	ellipseMode(RADIUS);
	if (value >= 0) {
		fill('blue');
		size = map(value, 0, dataTable.getColumnMaxVal(1), 1.5, 15);	
	} else {
		fill('red');
		size = map(value, dataTable.getColumnMinVal(1), 0, 15, 1.5);
	}
	ellipse(x, y, size, size);
	var x2 = mouseX;
	var y2 = mouseY;
	var currDist = dist(x, y, x2, y2);
	
	if ((currDist < size + 2) && currDist < minDist) {
		minDist = currDist;
		labelText = Number(value).toFixed(1) + " (" + abbrev + ")";
		labelX = x;
		labelY = y - size - 10;
	}
	
}