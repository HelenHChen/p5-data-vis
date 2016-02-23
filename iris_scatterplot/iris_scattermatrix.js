/*
7. Attribute Information:
   1. sepal length in cm
   2. sepal width in cm
   3. petal length in cm
   4. petal width in cm
   5. class: 
      -- Iris Setosa
      -- Iris Versicolour
      -- Iris Virginica
*/

var source;
var attr = ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"];
var classes = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"];
var minData = [100, 100, 100, 100];
var maxData = [0, 0, 0, 0];
var rowCount;


// formatting plot area
var majorPad = 50;
var gridWidth;
var tickLen = 5;
var tickLabelDist = tickLen * 2.5;
var labelPad = 1;
var plotX1, plotY1, plotX2, plotY2, xTitle, yTitle, xAxisLabelX, xAxisLabelY, yAxisLabelX, yAxisLabelY;
var gridX, gridY;
var axisIntervals = [1, 0.5, 1, 0.5];

// plot points attributes
var colorEncode = {
	strokeWeight: 3
}
var shapeEncode = {stroke: 51, strokeWeight: 0.8, size: 3};

function preload() {
	source = loadTable("data/iris.csv");
}

function setup() {
	
	createCanvas(650, 700);
	rowCount = source.getRowCount();
	
	for (var i = 0; i < rowCount; i++) {
		
		for (var j = 0; j < attr.length; j++) {
			var data = source.getNum(i, j);
			if (data < minData[j]) {
				minData[j] = data;
			}
			if (data > maxData[j]) {
				maxData[j] = data;
			}
		}
		
	}
	
    plotX1 = majorPad;
    plotX2 = width - majorPad;
    plotY1 = height - (width - 2 * majorPad) - majorPad;
    plotY2 = height - majorPad;
    
	gridWidth = (width - 2 * majorPad)/(attr.length);
	gridX = [];
	gridY = [];
	for (var i = 0; i < attr.length; i++) {
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
	background(224);	
	drawGrid();
	drawChartText();
	
	strokeWeight(1);
	
	drawAxisLabels();
	plotData("shape");
	
}

function drawGrid() {
    rectMode(CORNERS);
    fill(255);
	strokeWeight(1);
	stroke(0);
    rect(plotX1, plotY1, plotX2, plotY2);
	for (var i = 1; i < attr.length; i++) {
		line(plotX1, plotY1 + gridWidth * i, plotX2, plotY1 + gridWidth * i);
		line(plotX1 + gridWidth * i, plotY1, plotX1 + gridWidth *i, plotY2);
	}
}

function drawChartText() {
	// draw title
	textSize(24);
	textAlign(CENTER, BOTTOM);
	fill(0);
	noStroke();
	text("Iris Scatterplot Matrix", xTitle, yTitle);
	
	// draw attribute text
	textSize(14);
	textAlign(CENTER, CENTER);
	for (var i = 0; i < attr.length; i++) {
		text(attr[i], gridX[i] + gridWidth/2, gridY[i] + gridWidth/2);
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
	
	for (var row = 0; row < rowCount; row++) {
		
		for (var attrY = 0; attrY < attr.length; attrY++) {
			
			var y = map(source.getNum(row, attrY), floor(minData[attrY]), ceil(maxData[attrY]), plotY1 + gridWidth * (attrY + 1), plotY1 + gridWidth * attrY);
			
			for (var attrX = 0; attrX < attr.length; attrX++) {
		
				if (attrX != attrY) {
					var x = map(source.getNum(row, attrX), floor(minData[attrX]), ceil(maxData[attrX]), plotX1 + gridWidth * attrX, plotX1 + gridWidth * (attrX + 1));

					switch (source.getString(row, attr.length)) {
						case classes[0]:
							if (encoding === "color") {
								stroke(30, 144, 255, 120);	//dodgerblue
								strokeWeight(colorEncode.strokeWeight);
								point(x, y);
							} else if (encoding === "shape") {
								stroke(shapeEncode.stroke);
								strokeWeight(shapeEncode.strokeWeight);
								noFill();
								ellipse(x,y, shapeEncode.size, shapeEncode.size);
							}
							break;
						case classes[1]:
							if (encoding === "color") {
								stroke(0, 238, 118, 120);	//springgreen 1
								strokeWeight(colorEncode.strokeWeight);
								point(x, y);
							} else if (encoding === "shape") {
								stroke(shapeEncode.stroke);
								strokeWeight(shapeEncode.strokeWeight);
								noFill();
								triangle(x, y - shapeEncode.size/2, x - shapeEncode.size/1.73, y + shapeEncode.size/2, x + shapeEncode.size/1.73, y + shapeEncode.size/2);
							}
							break;
						case classes[2]:
							if (encoding === "color") {
								stroke(255, 185, 15, 120);	//darkgoldenrod 1
								strokeWeight(colorEncode.strokeWeight);
								point(x, y);
							} else if (encoding === "shape") {
								stroke(shapeEncode.stroke);
								strokeWeight(shapeEncode.strokeWeight);
								noFill();
								rectMode(CENTER);
								rect(x, y, shapeEncode.size, shapeEncode.size);
							}
							break;	
					}

				}
		
			}	
			
		}

	}
}

function Iris(sepalLength, sepalWidth, petalLength, petalWidth) {
	this.sepalLength = sepalLength;
	this.sepalWidth = sepalWidth;
	this.petalLength = petalLength;
	this.petalWidth = petalWidth;
}