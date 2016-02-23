// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill

function setup() {
  createCanvas(640, 480);
  //stroke(0); 
  //fill(255);
}

function draw() {
  	
	if (mouseIsPressed) {
	    fill(0);
	} else {
	    fill(255);
	}
	ellipse(mouseX, mouseY, 80, 80);
	  
}