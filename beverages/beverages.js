// data source and its attributes
var dataTable;
var dataMin, dataMax, columnCount, rowCount, yearMin, yearMax, years;

// formatting plot area
var plotX1, plotY1, plotX2, plotY2, labelX, labelY;
var yearInterval = 10;
var volumeInterval = 10;
var volumeIntervalMinor = 5;
var tabLeft, tabRight; // array; Add above setup() 
var tabTop, tabBottom;
var tabPad = 10;

//tracking data
var currentColumn = 1;

function preload() {
	var delimeter = '\t';
	dataTable = new Table("data/milk-tea-coffee.tsv", delimeter);
}

function setup() {
	
	createCanvas(720, 405);
	columnCount = dataTable.getColumnCount();
	rowCount = dataTable.getRowCount();
	
	years = dataTable.getRowNames(); //in String format
	yearMin = years[0];
	yearMax = years[years.length-1];
	
	dataMin = 0;
	dataMax = ceil(dataTable.getTableMax()/volumeInterval) * volumeInterval;
	
    // Corners of the plotted time series
    plotX1 = 120;
    plotX2 = width - 80;
    labelX = 50;
    plotY1 = 60;
    plotY2 = height - 79;
    labelY = height -25;
    smooth();	
	
	tabLeft = new Array(columnCount);
	tabRight = new Array(columnCount);
	
}

function draw() {
	background(224);
	
    rectMode(CORNERS);
    fill(255);
    noStroke();
    rect(plotX1, plotY1, plotX2, plotY2);
	
    drawVolumeLabels();
    drawAxisLabels();
	
    stroke('#5679C1');
    fill('#5679C1');
    drawDataArea(currentColumn);
    //drawDataHighlight(currentColumn);
    drawTitleTabs();
    drawYearLabels();
}

function drawVolumeLabels() {
    fill(0);
    textSize(10);
    textAlign(RIGHT, CENTER);
    stroke(128);
    strokeWeight(1);
  
    for (var v = dataMin + volumeIntervalMinor; v <= dataMax; v += volumeIntervalMinor) {
		var y = map(v, dataMin, dataMax, plotY2, plotY1);
      	if (v % volumeInterval == 0) {
        	text(floor(v), plotX1 - 10, y);
        	line(plotX1 - 4, y, plotX1, y);
      	} else if (v % volumeIntervalMinor == 0) {
        	line(plotX1 - 2, y, plotX1, y);
      	}
    }
}

function drawAxisLabels() {
    fill(0);
    textSize(13);
    textLeading(15);
    textAlign(CENTER, CENTER);
    text("Gallons\nconsumed\nper capita", labelX, (plotY1+plotY2)/2);
    textAlign(CENTER);
    text("Year", (plotX1+plotX2)/2, labelY);	
}

function drawDataArea(col) {
    //noStroke();
    beginShape();
    for (var row = 0; row < rowCount; row++) {
      if (dataTable.isValid(row, col)) {
		  var value = this.dataTable.getValue(row, col);
		  console.log(row + " " + col + " " + value);		  
		  var x = map(+years[row], yearMin, yearMax, plotX1, plotX2);
		  var y = map(+value, dataMin, dataMax, plotY2, plotY1);
		  console.log(x + " " + y);
		  vertex(x, y);
		  //point(x, y);
       } 
    }
    vertex(plotX2, plotY2);
    vertex(plotX1, plotY2);
    endShape(CLOSE);	
}

function drawYearLabels() {
    fill(0);
    textSize(10);
    textAlign(CENTER, TOP);
    strokeWeight(1);
  
    for (var row = 0; row < years.length; row++) {
      if (years[row] % yearInterval == 0) {
        var x = map(years[row], yearMin, yearMax, plotX1, plotX2);
        text(years[row], x, plotY2 + 10);
        if (row === 0) {
          stroke(0);
          line(x, plotY1, x, plotY2);
          stroke(255);
        } else {
          line(x, plotY1, x, plotY2);
        }
      }
    }	
}

function drawTitleTabs() {
	rectMode(CORNERS);
	noStroke();
	textSize(20);
	textAlign(LEFT);
	
	var runningX = plotX1;
	tabTop = plotY1 - textAscent() -15;
	tabBottom = plotY1;
	
	for (var col = 1; col < columnCount; col++) {
		var title = dataTable.getColumnName(col);
		tabLeft[col] = runningX;
		var titleWidth = textWidth(title);
		tabRight[col] = tabLeft[col] + tabPad + titleWidth + tabPad;
		
		fill(col == currentColumn ? 255 : 224);
		rect(tabLeft[col], tabTop, tabRight[col], tabBottom);
		
		fill(col == currentColumn ? 0 : 64);
		text(title, runningX + tabPad, plotY1 - tabPad);
		
		runningX = tabRight[col];
	}
}

function mousePressed() {
	if (mouseY > tabTop && mouseY < tabBottom) {
	    for (var col = 1; col < columnCount; col++) {
	    	if (mouseX > tabLeft[col] && mouseX < tabRight[col]) {
	    		setColumn(col);
	    		break;
	    	}
	    }
	}
}

function setColumn(col) {
	if (col != currentColumn) {
		currentColumn = col;
	}
}