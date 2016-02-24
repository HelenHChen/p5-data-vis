var source;
var attr = ["","carat","cut","color","clarity","depth","table","price","x","y","z"];
var category = {name: "cut", index: 2};	//category = cut
var classes = ["Fair", "Good", "Very Good", "Premium", "Ideal"];
var useAttr = [1, 5, 6, 7, 8, 9, 10];
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
var tickLabelDist = tickLen * 1.5;
var labelPad = 1;
var plotX1, plotY1, plotX2, plotY2, xTitle, yTitle, xAxisLabelX, xAxisLabelY, yAxisLabelX, yAxisLabelY;
var gridX, gridY;
var axisIntervalFreq = 4;
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
	
	//get min and max
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
	
	//update axisIntervals based on min and max
	for (var i = 1; i < axisIntervals.length; i++) {
		var interval = (ceil(maxData[i]) - floor(minData[i]))/axisIntervalFreq;
		if (maxData[i] > 10) {
			interval = Math.round(interval);
		}
		axisIntervals[i] = interval;
	}
	
	console.log(minData);
	console.log(maxData);
	
    plotX1 = majorPad;
    plotX2 = width - majorPad;
    plotY1 = height - (width - 2 * majorPad) - majorPad;
    plotY2 = height - majorPad;

	gridWidth = (width - 2 * majorPad)/(useAttr.length);		
	gridX = [];
	gridY = [];
	for (var i = 0; i < useAttr.length; i++) {
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
	
	drawAxisLabels();
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
	for (var i = 0; i < useAttr.length; i++) {
		text(attr[useAttr[i]], gridX[gridX.length - 1 - i] + gridWidth/2, gridY[i] + gridWidth/2);			
	}
	
}

function drawAxisLabels() {
	fill(0);
	textSize(10);
	strokeWeight(1);
	
	for (var count = 0; count < useAttr.length; count++) {
		
		var low = floor(minData[useAttr[count]]) - axisIntervals[useAttr[count]];
		var high = ceil(maxData[useAttr[count]]) + axisIntervals[useAttr[count]];	
		var reversedCount = useAttr.length - count - 1;
	
		for (var i = low + axisIntervals[useAttr[count]]; i < high; i += axisIntervals[useAttr[count]]) {
			
			var label = i;
			if (label < 10) {
				label = label.toFixed(1);
			}
			
			//x-axis labels
			if (count !== 0) {
				var x = map(i, low, high, plotX1 + reversedCount * gridWidth, plotX1 + (reversedCount + 1) * gridWidth);
				var y = plotY1 - tickLen;
				textAlign(CENTER, BOTTOM);
				text(label, x, plotY1 - tickLabelDist);
				stroke(0,0,0);
				line(x, y, x, y + tickLen);
				noStroke();
			}
			
			//y-axis labels
			if (count !== useAttr.length - 1) {
				y = map(i, low, high, plotY1 + (count + 1) * gridWidth, plotY1 + count * gridWidth);
				x = plotX1 - tickLen;
				textAlign(RIGHT, CENTER);
				text(label, plotX1 - tickLabelDist, y);
				stroke(0,0,0);
				line(x, y, x + tickLen, y);
				noStroke();
			}

		}
		
	}
	
}

function plotData(encoding) {
	fill(0);
	for (var data = 0; data < rowCount; data++) {
		for (var row = 0; row < gridY.length; row++) {
			var attrY = useAttr[row];
			var y = map(source.getNum(data, attrY), floor(minData[attrY] - axisIntervals[attrY]), ceil(maxData[attrY] + axisIntervals[attrY]), gridY[row] + gridWidth, gridY[row]);		
			for (var col = 0; col < (gridX.length - 1 - row); col++) {
				var attrX = useAttr[useAttr.length - col - 1];
				var x = map(source.getNum(data, attrX), floor(minData[attrX] - axisIntervals[attrX]), ceil(maxData[attrX] + axisIntervals[attrX]), gridX[col], gridX[col] + gridWidth);
			
				if (encoding === "color") {
					stroke(colorEncode.colors[source.getString(data, category.name)]);
					strokeWeight(colorEncode.strokeWeight);
					point(x,y);
				}
			}	
		}			
	}
}