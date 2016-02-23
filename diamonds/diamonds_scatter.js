var source;
var attr = ["","carat","cut","color","clarity","depth","table","price","x","y","z"];
var category = {name: "cut", index: 2};	//category = cut
var classes = ["Fair", "Good", "Very Good", "Premium", "Ideal"];
var cut = {Fair: 0, Good: 1, "Very Good": 2, Premium: 3, Ideal: 4};
var colors = {J: 0, I: 1, H: 2, G: 3, F: 4, E: 5, D: 6};
var clarity = {I1: 0, SI1: 1, SI2: 2, VS1: 3, VS2: 4, VVS1: 5, VVS2: 6, IF: 7};

var maxData = [0, 0, 0, 0, 0, 43, 43, 326, 0, 0, 0];
var minData = [0, 5, 4, 6, 7, 79, 95, 18823, 11, 59, 32];
var rowCount;


// formatting plot area
var majorPad = 50;
var gridWidth;
var tickLen = 5;
var tickLabelDist = tickLen * 2.5;
var labelPad = 1;
var plotX1, plotY1, plotX2, plotY2, xTitle, yTitle, xAxisLabelX, xAxisLabelY, yAxisLabelX, yAxisLabelY;
var gridX, gridY;
var axisIntervals = [0, 0.5, 1, 1, 1, 5, 10, 2000, 2, 10, 5];

// plot points attributes
var colorEncode = {
	strokeWeight: 2,
	colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
}
var shapeEncode = {stroke: 51, strokeWeight: 0.8, size: 3};

function preload() {
	source = loadTable("data/diamonds100.csv", "csv", "header");
}

function setup() {
	
	createCanvas(950, 1000);

	rowCount = source.getRowCount();
	for (var i = 0; i < rowCount; i++) {
		source.setNum(i, "cut", cut[source.getString(i,"cut")]);
		source.setNum(i, "color", colors[source.getString(i,"color")]);
		source.setNum(i, "clarity", clarity[source.getString(i,"clarity")]);
		
		for (var c = 1; c < attr.length; c++) {
			var data = source.getNum(i, c);
			if (data < minData[c]) {
				minData[c] = data;
			}
			if (data > maxData[c]) {
				maxData[c] = data;
			}
		}
		
	}
	
	console.log(minData);
	console.log(maxData);
	
    plotX1 = majorPad;
    plotX2 = width - majorPad;
    plotY1 = height - (width - 2 * majorPad) - majorPad;
    plotY2 = height - majorPad;

	//modified for this data set: subtracting 2 from attr.length
	//since one primary column and one category column do not count as attributes
	gridWidth = (width - 2 * majorPad)/(attr.length - 2);		
	gridX = [];
	gridY = [];
	for (var i = 0; i < attr.length - 2; i++) {
		gridX.push(plotX1 + i * gridWidth);
		gridY.push(plotY1 + i * gridWidth);
	}
	
	xTitle = width/2;
	yTitle = plotY1 - majorPad;
	
	xAxisLabelX = (plotX1 + plotX2)/2;
	yAxisLabelX = plotX1/2;
    xAxisLabelY = height - 25;
	yAxisLabelY = (plotY1 + plotY2)/2;
	
}

function draw() {
	background(255);	
	drawGrid();
	drawChartText();
	
	strokeWeight(1);
	
	//drawAxisLabels();
	plotData("color");
	
}

function drawGrid() {
    rectMode(CORNER);
    noFill();
	strokeWeight(1);
	stroke(169, 169, 169);
	
	for (var i = 0; i < gridY.length; i++) {
		for (var j = gridX.length - 1 - i; j >= 0; j--) {
			rect(gridX[j], gridY[i], gridWidth, gridWidth);
		}
	}
	
}

function drawChartText() {
	// draw title
	textSize(24);
	textAlign(CENTER, BOTTOM);
	fill(0);
	noStroke();
	text("Diamonds Scatterplot Matrix", xTitle, yTitle);
	
	// draw attribute text
	textSize(14);
	textAlign(CENTER, CENTER);
	var attr_count = 1;
	for (var i = 0; i < attr.length - 2; i++) {
		if (attr_count !== category.index) {
			text(attr[attr_count], gridX[attr.length - 3 - i] + gridWidth/2, gridY[i] + gridWidth/2);			
		} else {
			i--;
		}
		attr_count++;
	}
	
}

function drawAxisLabels() {
	fill(0);
	textSize(10);
	strokeWeight(1);
	
	for (var currAttr = 0; currAttr < attr.length; currAttr++) {
		
		var low = floor(minData[currAttr]);
		var high = ceil(maxData[currAttr]);	
		
		for (var i = low; i <= high; i += axisIntervals[currAttr]) {
			var x = map(i, low, high, plotX1 + currAttr * gridWidth, plotX1 + (currAttr + 1) * gridWidth);
			
			if (currAttr % 2 == 0) {
				var y = plotY2;
				textAlign(CENTER, TOP);
				text(i, x, plotY2 + tickLabelDist);
			} else {
				var y = plotY1 - tickLen;
				textAlign(CENTER, BOTTOM);
				text(i, x, plotY1 - tickLabelDist);
			}
			
			stroke(0,0,0);
			line(x, y, x, y + tickLen);
			noStroke();

		}
	
		for (var i = low; i <= high; i += axisIntervals[currAttr]) {
			var y = map(i, low, high, plotY1 + (currAttr + 1) * gridWidth, plotY1 + currAttr * gridWidth);
			
			if (currAttr % 2 == 0) {
				var x = plotX2;
				textAlign(LEFT, CENTER);
				text(i, plotX2 + tickLabelDist, y);
			} else {
				var x = plotX1 - tickLen;
				textAlign(RIGHT, CENTER);
				text(i, plotX1 - tickLabelDist, y);
			}
			stroke(0,0,0);
			line(x, y, x + tickLen, y);
			noStroke();

		}
	
		
	}
	
}

function plotData(encoding) {
	
	fill(0);
	
	for (var data = 0; data < rowCount; data++) {
		// if (data % 100 != 0) {
// 			continue;
// 		}
		var attrY = 1;
		for (var row = 0; row < gridY.length; row++) {
			if (attrY === category.index) {
				attrY++;
			}
			var y = map(source.getNum(data, attrY), floor(minData[attrY] - axisIntervals[attrY]), ceil(maxData[attrY] + axisIntervals[attrY]), gridY[row] + gridWidth, gridY[row]);
			var attrX = 10;			
			for (var col = 0; col < (gridX.length - 1 - row); col++) {
				if (attrX === category.index) {
					attrX--;
				}
				var x = map(source.getNum(data, attrX), floor(minData[attrX] - axisIntervals[attrX]), ceil(maxData[attrX] + axisIntervals[attrX]), gridX[col], gridX[col] + gridWidth);
				
				if (encoding === "color") {
					stroke(colorEncode.colors[source.getString(data, category.name)]);
					strokeWeight(colorEncode.strokeWeight);
					point(x,y);
				}
				
				attrX--;
			}	
			attrY++;
		}

	}
}