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
var plotX1, plotY1, plotX2, plotY2, xAxisLabelX, xAxisLabelY, yAxisLabelX, yAxisLabelY;
var axisIntervals = [0.5, 0.5, 1, 0.5];
var tickLen = 5;

function preload() {
	source = loadTable("data/iris.csv");
}

function setup() {
	
	createCanvas(800, 800);
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
	
    plotX1 = 120;
    plotX2 = width - 80;
    xAxisLabelX = (plotX1 + plotX2)/2;
	yAxisLabelX = plotX1/2;
    plotY1 = 100;
    plotY2 = height - 100;
    xAxisLabelY = height - 25;
	yAxisLabelY = (plotY1 + plotY2)/2;
	
}

function draw() {
	background(224);
	
    rectMode(CORNERS);
    fill(255);
    noStroke();
    rect(plotX1, plotY1, plotX2, plotY2);
	
	drawAxisLabels(3, 3);
	plotData(3, 3);
	
}

function drawAxisLabels(attrX, attrY) {
	fill(0);
	textSize(10);
	textAlign(CENTER, TOP);
	strokeWeight(1);
	
	var low = floor(minData[attrX]);
	var high = ceil(maxData[attrX]);

	for (var i = low; i <= high; i += axisIntervals[attrX]) {
		var x = map(i, low, high, plotX1, plotX2);
		stroke(0,0,0);
		line(x, plotY2, x, plotY2 + tickLen);
		noStroke();
		text(i, x, plotY2 + tickLen*2);
	}
	
	text(attr[attrX], xAxisLabelX, xAxisLabelY);
	
	low = floor(minData[attrY]);
	high = ceil(maxData[attrY]);
	textAlign(CENTER, CENTER);
	
	for (var i = low; i <= high; i += axisIntervals[attrY]) {
		var y = map(i, low, high, plotY2, plotY1);
		stroke(0,0,0);
		line(plotX1, y, plotX1 - tickLen, y);
		noStroke();
		text(i, plotX1 - tickLen*2, y);
	}
	
	text(attr[attrY], yAxisLabelX, yAxisLabelY);
	
}

function plotData(attrX, attrY) {
	
	fill(0);
	strokeWeight(5);
	
	for (var i = 0; i < rowCount; i++) {
		
		var x = map(source.getNum(i, attrX), floor(minData[attrX]), ceil(maxData[attrX]), plotX1, plotX2);
		var y = map(source.getNum(i, attrY), floor(minData[attrY]), ceil(maxData[attrY]), plotY2, plotY1);
		
		switch (source.getString(i, attr.length)) {
			case classes[0]:
				stroke(30, 144, 255, 120);	//dodgerblue
				break;
			case classes[1]:
				stroke(0, 238, 118, 120);	//springgreen 1
				break;
			case classes[2]:
				stroke(255, 185, 15, 120);	//darkgoldenrod 1
				break;	
		}
		
		point(x, y);
	}
}

function Iris(sepalLength, sepalWidth, petalLength, petalWidth) {
	this.sepalLength = sepalLength;
	this.sepalWidth = sepalWidth;
	this.petalLength = petalLength;
	this.petalWidth = petalWidth;
}