"use strict";

(function(childCircleRadiusRatio, numChildCircles, rps) {
var theCanvas = document.getElementById("theCanvas");
theCanvas.width = 0.9*window.innerWidth;
theCanvas.height = 0.9*window.innerHeight;

//theCanvas.width = 4096;
//theCanvas.height = 2304;


var width = theCanvas.width;
var height = theCanvas.height;
var centerX = width / 2;
var centerY = height / 2;
var radius = Math.min(centerX, centerY);
var angle = 0;
var canvasContext = theCanvas.getContext("2d");

var x = [];
var y = [];

var clear = false;

if(!Math.TAU) { Math.TAU = 2*Math.PI; }

var lastTimestamp = null;
var drawCircles = function(timestamp) {
	if(!lastTimestamp) {
		lastTimestamp = timestamp;
	}
	var elapsedTime = (timestamp-lastTimestamp)/1000;
	if( elapsedTime > 0.1 ) {
		elapsedTime = 0.1;
	}
	lastTimestamp = timestamp;

	elapsedTime = 1/30;

	var angleDelta = rps*elapsedTime*Math.TAU;
	angle = angle + angleDelta;
//	while( angle > Math.TAU) {
//		angle = angle - Math.TAU;
//	}

	var r = radius;
	var a = angle;
	var cx = centerX;
	var cy = centerY;

	var childR, childA, childCX, childCY;

	var i;

	//canvasContext.beginPath();
	//canvasContext.arc(cx, cy, r, 0, 2*Math.PI);
	//canvasContext.stroke();

	for(i=0; i < numChildCircles; i ++) {
		childR = r * childCircleRadiusRatio;
		childCX = cx + (r - childR)*Math.cos(a);
		childCY = cy + (r - childR)*Math.sin(a);
		childA = -a*(1/childCircleRadiusRatio);
		//childA = a*(1/childCircleRadiusRatio);

		r = childR;
		cx = childCX;
		cy = childCY;
		a = childA;

		if(!clear && x[i]) {
			canvasContext.beginPath();
			canvasContext.moveTo(x[i], y[i]);
			canvasContext.lineTo(cx, cy);
//			if( angle < Math.TAU) {
				canvasContext.strokeStyle = "rgba(0, 0, 0, " + (i+1)/numChildCircles + ")";
//			} else {
//				canvasContext.strokeStyle = "rgba(255, 255, 255, 1)";
//			}
			canvasContext.stroke();
		}

		x[i] = cx;
		y[i] = cy;
		
		canvasContext.beginPath();
		canvasContext.arc(childCX, childCY, childR, 0, 2*Math.PI);
		if(!clear) {
//		if( angle < Math.TAU) {
			canvasContext.strokeStyle = "rgba(0, 0, 0, " + 0.1*((i+1)/numChildCircles) + ")";
			//canvasContext.strokeStyle = "rgba(0, 0, 0, 1)";
//		} else {
//			canvasContext.strokeStyle = "rgba(255, 255, 255, 1)";
//		}
		} else {
			canvasContext.strokeStyle = "rgba(0, 0, 0, 1)";
		}
		canvasContext.stroke();
	}

	// if( x ) {
	// 	canvasContext.beginPath();
	// 	canvasContext.moveTo(x, y);
	// 	canvasContext.lineTo(cx, cy);
	// 	canvasContext.stroke();
	// }

	// x = cx;
	// y = cy;
};

var animationCallbackId;
var draw  = function(timestamp) {
	if(clear) {
		canvasContext.clearRect(0, 0, width, height);
	}
	
	if(angle < Math.TAU) {
		drawCircles(timestamp);
		animationCallbackId = window.requestAnimationFrame(draw);
	} else {
		angle = 0;
		drawCircles(timestamp);
	}
};

animationCallbackId = window.requestAnimationFrame(draw);

var rpsControl = document.getElementById("speed");
rpsControl.value = rps;
rpsControl.addEventListener("change", function(ev) {
	window.cancelAnimationFrame(animationCallbackId);
	angle = 0;
	x = [];
	y = [];
	rps = ev.target.value;
	canvasContext.clearRect(0, 0, width, height);
	animationCallbackId = window.requestAnimationFrame(draw);
});

var eraseControl = document.getElementById("erase");
eraseControl.addEventListener("change", function(ev) {
	window.cancelAnimationFrame(animationCallbackId);
	angle = 0;
	x = [];
	y = [];
	clear = ev.target.checked;
	canvasContext.clearRect(0, 0, width, height);
	animationCallbackId = window.requestAnimationFrame(draw);
});

})(1/3, 6, 1/10);