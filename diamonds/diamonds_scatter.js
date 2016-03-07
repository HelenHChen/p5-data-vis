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
var midData = [0, 0, 0, 0, 0, 43, 43, 326, 0, 0, 0];
var rowCount;

// set up animation variables
var animateIndex = [];
var animateNum = 200;		// number of points to draw at a time when animating
var animateStart = 0;
var isAnimate = false;

// formatting plot area
var majorPad = 50;
var gridWidth;
var tickLen = 3;
var tickLabelDist = tickLen * 1.5;
var labelPad;
var plotX1, plotY1, plotX2, plotY2, xTitle, yTitle, xAxisLabelX, xAxisLabelY, yAxisLabelX, yAxisLabelY, xLegend, yLegend;
var gridX, gridY;
// var axisIntervalFreq = 4;
// var axisIntervals = [0, 0.5, 1, 1, 1, 5, 10, 2000, 2, 10, 5];

// pointColors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
// pointColors = ["rgba(27, 158, 119, 1)", "rgba(217, 95, 2, 1)", "rgba(117, 112, 179, 1)", "rgba(231, 41, 138, 1)", "rgba(102, 166, 30, 1)"];
var pointColors = ["rgba(76, 114, 176, 1)", "rgba(85, 168, 104, 1)", "rgba(196, 78, 82, 1)", "rgba(129, 114, 178, 1)", "rgba(204, 185, 116, 1)"];

// plot points attributes
var pointEncode = {
	strokeWeight: 2
}
var shapeEncode = {
	strokeWeight: 0.3,
	size: 4.5
};

function preload() {
	source = loadTable("data/diamonds500.csv", "csv", "header");
}

function setup() {
	
	createCanvas(950, 1000);
	rowCount = source.getRowCount();
	
	//get min and max
	for (var i = 0; i < rowCount; i++) {
		
		//fill in randomize index
		animateIndex.push(i);
		
		source.setNum(i, "cut", cut[source.getString(i,"cut")]);
		source.setNum(i, "color", colors[source.getString(i,"color")]);
		source.setNum(i, "clarity", clarity[source.getString(i,"clarity")]);
		
		// update min and max based on dataset
		for (var c = 1; c < attr.length; c++) {
			var data = source.getNum(i, c);
			if (axisMin(data) < minData[c]) {
				minData[c] = axisMin(data);
			}
			if (axisMax(data) > maxData[c]) {
				maxData[c] = axisMax(data);
			}
		}
		
	}
	
	// update mid based on new min and max
	for (var i = 1; i < attr.length; i++) {
		midData[i] = (maxData[i] + minData[i])/2;
	}
	
	//shuffle randomized index
	shuffleIndex(animateIndex);
	
	//update axisIntervals based on min and max
	// for (var i = 1; i < axisIntervals.length; i++) {
// 		var interval = (maxData[i] - minData[i])/axisIntervalFreq;
// 		if (maxData[i] > 10 && interval % 5 > 1) {
// 			//interval = Math.round(interval);
// 			interval = floor(interval - interval % 5 + 5)
// 		}
// 		axisIntervals[i] = interval;
// 	}
	
    plotX1 = majorPad;
    plotX2 = width - majorPad;
    plotY1 = height - (width - 2 * majorPad) - majorPad;
    plotY2 = height - majorPad;

	gridWidth = (width - 2 * majorPad)/(useAttr.length);
	labelPad = gridWidth * 0.1;	
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
	
	xLegend = plotX2 - gridWidth * 2;
	yLegend = plotY2 - gridWidth * 2;
	
	//call noLoop unless doing animation
	if (!isAnimate) {
		noLoop();		
	} else {
		frameRate(30);
	}
	
	drawGrid();
	drawChartText();
	
}

function draw() {
	//background(255);	

	strokeWeight(1);
	
	drawAxisLabels();
	plotData("point", isAnimate);
	drawLegend();
	
}

function drawGrid() {
    rectMode(CORNER);
    noFill();
	strokeWeight(.5);
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
	fill(169, 169, 169);
	textSize(14);
	textAlign(CENTER, CENTER);
	for (var i = 0; i < useAttr.length; i++) {
		text(attr[useAttr[i]], gridX[gridX.length - 1 - i] + gridWidth/2, gridY[i] + gridWidth/2);			
	}
	
}

// function drawAxisLabels() {
// 	fill(169, 169, 169);
// 	stroke(169, 169, 169);
// 	textSize(8);
// 	strokeWeight(0.25);
//
// 	for (var count = 0; count < useAttr.length; count++) {
//
// 		var low = minData[useAttr[count]] - axisIntervals[useAttr[count]];
// 		var high = maxData[useAttr[count]] + axisIntervals[useAttr[count]];
// 		var reversedCount = useAttr.length - count - 1;
//
// 		for (var i = low + axisIntervals[useAttr[count]]; i < high; i += axisIntervals[useAttr[count]]) {
//
// 			var label = i;
// 			if (label < 10) {
// 				label = label.toFixed(1);
// 			}
//
// 			//x-axis labels
// 			if (count !== 0) {
// 				var x = map(i, low, high, plotX1 + reversedCount * gridWidth, plotX1 + (reversedCount + 1) * gridWidth);
// 				var y = plotY1 - tickLen;
// 				textAlign(CENTER, BOTTOM);
// 				text(label, x, plotY1 - tickLabelDist);
// 				stroke(0,0,0);
// 				line(x, y, x, y + tickLen);
// 				noStroke();
// 			}
//
// 			//y-axis labels
// 			if (count !== useAttr.length - 1) {
// 				y = map(i, low, high, plotY1 + (count + 1) * gridWidth, plotY1 + count * gridWidth);
// 				x = plotX1 - tickLen;
// 				textAlign(RIGHT, CENTER);
// 				text(label, plotX1 - tickLabelDist, y);
// 				stroke(0,0,0);
// 				line(x, y, x + tickLen, y);
// 				noStroke();
// 			}
//
// 		}
//
// 	}
//
// }

function drawAxisLabels() {
	fill(169, 169, 169);
	stroke(169, 169, 169);
	textSize(8);
	strokeWeight(0.25);
	
	for (var count = 0; count < useAttr.length; count++) {
		
		var reversedCount = useAttr.length - count - 1;
		var labels = [];
		labels.push(minData[useAttr[count]]);
		labels.push(midData[useAttr[count]]);
		labels.push(maxData[useAttr[count]]);
	
		for (var i = 0; i < labels.length; i++) {
			
			var label = labels[i];
			if (label < 10) {
				label = label.toFixed(1);
			}
			
			//x-axis labels
			if (count !== 0) {
				var x = map(label, labels[0], labels[2], plotX1 + reversedCount * gridWidth + labelPad, plotX1 + (reversedCount + 1) * gridWidth - labelPad);
				var y = plotY1 - tickLen;
				textAlign(CENTER, BOTTOM);
				text(label, x, plotY1 - tickLabelDist);
				stroke(0,0,0);
				line(x, y, x, y + tickLen);
				noStroke();
			}
			
			//y-axis labels
			if (count !== useAttr.length - 1) {
				y = map(label, labels[0], labels[2], plotY1 + (count + 1) * gridWidth - labelPad, plotY1 + count * gridWidth + labelPad);
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

function drawLegend() {
	
	var padding = 10;
	var yBands = (gridWidth * 2 - padding * 2)/(classes.length + 1);
	var keySize = yBands * 0.6;
	
	//draw rectangle around legend box
	rectMode(CORNER);
	noFill();
	strokeWeight(1);
	stroke(169, 169, 169);
	rect(xLegend, yLegend, gridWidth * 2, gridWidth * 2);
	
	//legend title
	textSize(24);
	textAlign(CENTER, CENTER);
	fill(0);
	noStroke();
	text(category.name, xLegend + gridWidth, yLegend + padding + yBands/2);
	
	//legend key
	textSize(14);
	for (var i = 0; i < classes.length; i++) {
		fill(pointColors[i]);
		textAlign(LEFT, CENTER);
		text(classes[i], xLegend + 5 * padding + keySize, yLegend + padding + yBands * (i + 1) + yBands/2);
		rectMode(CENTER);
		rect(xLegend + 3 * padding, yLegend + padding + yBands * (i + 1) + yBands/2, keySize, keySize);
	}
	
}

function plotData(encoding, animate) {
	fill(0);
	var numData = 0;
	var startIndex = 0;
	
	//determine number of rows to use based on whether we're animating
	if (animate) {
		numData = animateNum;
		startIndex = animateStart;
	} else {
		numData = rowCount;
	}

	for (var data = startIndex; data < (startIndex + numData); data++) {
		var adjusted = data % rowCount;
		for (var row = 0; row < gridY.length; row++) {
			var cat = source.getNum(adjusted, category.name);
			var attrY = useAttr[row];
			var y = map(source.getNum(adjusted, attrY), minData[attrY], maxData[attrY], gridY[row] + gridWidth - labelPad, gridY[row] + labelPad);					
			for (var col = 0; col < (gridX.length - 1 - row); col++) {
				var attrX = useAttr[useAttr.length - col - 1];
				var x = map(source.getNum(adjusted, attrX), minData[attrX], maxData[attrX], gridX[col] + labelPad, gridX[col] + gridWidth - labelPad);
				blendMode(REPLACE);
				stroke(pointColors[cat]);
			
				if (encoding === "point") {
					//strokeWeight(pointEncode.strokeWeight);
					//point(x,y);
					strokeWeight(shapeEncode.strokeWeight);
					stroke(255);
					fill(pointColors[cat]);
					ellipse(x, y, shapeEncode.size, shapeEncode.size);
				} else if (encoding === "shape") {
					strokeWeight(shapeEncode.strokeWeight);
					noFill();
					//Either circles or '+' marks: comment out unused one
					ellipse(x, y, shapeEncode.size, shapeEncode.size);
					//plusMark(x, y, shapeEncode.size);
				}
				
			}	
		}			
	}
	
	if (animate) {
		animateStart++;
		animateStart = animateStart % rowCount;
	}
}

function drawShapePoints(cat, x, y) {
	var diameter = shapeEncode.size;
	var radius = diameter/2;
	switch(cat) {
	case 0:
		ellipse(x, y, diameter, diameter);
		break;
	case 1:
		triangle(x, y - radius, x - diameter/1.73, y + radius, x + diameter/1.73, y + radius);
		break;
	case 2:
		rectMode(CENTER);
		rect(x, y, diameter, diameter);
		break;
	case 3:
		quad(x, y - radius, x + radius, y, x, y + radius, x - radius, y);
		break;
	case 4:
		star(x, y, radius/3, radius, 5);
	}
}

function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function plusMark(x, y, radius) {
	line(x, y - radius/2, x, y + radius/2);
	line(x - radius/2, y, x + radius/2, y);
}

function shuffleIndex(indexArray) {
	for (var i = indexArray.length - 1; i >= 0; i--) {
		var j = Math.floor(Math.random() * i);
		var temp = indexArray[i];
		indexArray[i] = indexArray[j];
		indexArray[j] = temp;
	}
}

function axisMin(origMin) {
	if (origMin > 10) {
		origMin -= origMin % 5
	}
	return floor(origMin);
}

function axisMax(origMax) {
	if (origMax > 10) {
		origMax = floor(origMax - origMax % 5 + 5);
	}
	return origMax;
}