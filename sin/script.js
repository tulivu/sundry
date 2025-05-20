"use strict";

(function(start) {
	if(!Math.TAU) { Math.TAU = 2*Math.PI; }

	const updateTimestep = 1/240;
	const maxFrameElapsedTime = 1/4;

	// Canvas
	var canvas;
	var cwidth, cheight;
	var ccx, ccy;
	var canvasContext;

	// Globals
	var theta;
	var radius;
	var creating;
	var revolutions;
	var mode;

	var init = function() {
		canvas = document.getElementById("theCanvas");

		canvas.width = 0.9*window.innerWidth;
		canvas.height = 0.9*window.innerHeight;

		cwidth = canvas.width;
		cheight = canvas.height;
		ccx = Math.trunc(cwidth / 2);
		ccy = Math.trunc(cheight / 2);
	
		canvasContext = canvas.getContext("2d");

		// Do init stuff
		theta = 0;
		radius = Math.min(cwidth, cheight)/4;
		creating = true;
		revolutions = 0;
		//mode = "tau";
		mode = "pi";
	};

	// Called every updateTimestep, independent of draw rate.
	var update = function(elapsedTimeSinceUpdate, totalElapsedTime) {
		// Do update stuff
		// elapsedTimeSinceUpdate === updateTimestep

		theta += elapsedTimeSinceUpdate;
		if(Math.floor(theta / Math.TAU) > revolutions) {
			revolutions ++;
			creating = !creating;
		}
	};

	// Called no less than every maxFrameElapsedTime, independent of update rate.
	// Targets 30-60 fps via window.requestAnimationFrame
	var draw = function(elapsedTimeSinceDraw, totalElapsedTime) {
		// Do drawing
		// elapsedTimeSinceDraw ~ 1/60 && elapsedTimeSinceDraw <= maxFrameElapsedTime

		var i, x, y;

		var a = theta-(Math.TAU*revolutions);
		
		canvasContext.clearRect(0, 0, cwidth, cheight);

		//if(theta < Math.TAU) {
		canvasContext.beginPath();
		canvasContext.strokeStyle = "#000000";
		canvasContext.fillStyle = "#EEEEEE";
		canvasContext.moveTo(ccx, ccy);
		//canvasContext.arc(ccx, ccy, 0.1*radius, Math.TAU - a, Math.TAU, !creating);
		canvasContext.arc(ccx, ccy, 0.1*radius, Math.TAU - a, Math.TAU);
		canvasContext.fill();
		canvasContext.stroke();
		//}
		//else {
			//canvasContext.beginPath();
			//canvasContext.strokeStyle = "#000000";
			//canvasContext.fillStyle = "#EEEEEE";
			//canvasContext.moveTo(ccx, ccy);
			//canvasContext.arc(ccx, ccy, 0.1*radius, 0, Math.TAU);
			////canvasContext.arc(ccx, ccy, 0.1*radius, Math.TAU - a, Math.TAU, !creating);
			//canvasContext.fill();
			//canvasContext.stroke();
		//}

		canvasContext.beginPath();
		canvasContext.strokeStyle = "#DDDDDD";
		canvasContext.moveTo(0, ccy);
		canvasContext.lineTo(cwidth, ccy);
		canvasContext.stroke();

		if(mode==="pi") {
			drawTick(2*revolutions-2, 1);
			drawTick(2*revolutions-1, 1);
			drawTick(2*revolutions, 1);
			drawTick(2*revolutions + 1, 1);
			drawTick(2*revolutions + 2, 1);
			drawTick(2*revolutions + 3, 1);
		} else {
			drawTick(revolutions-1, 1);
			drawTick(revolutions, 1);
			drawTick(revolutions + 1, 1);
		}

		x = ccx+radius*Math.cos(a);
		y = ccy-radius*Math.sin(a);

		canvasContext.beginPath();
		canvasContext.strokeStyle = "#000000";
		canvasContext.moveTo(ccx+radius, ccy);
		canvasContext.lineTo(ccx, ccy);
		canvasContext.lineTo(x, y);
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.strokeStyle = "#0000FF";
		canvasContext.moveTo(ccx, ccy);
		canvasContext.lineTo(ccx, y);
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.fillStyle = "#0000FF";
		canvasContext.moveTo(ccx, y);
		canvasContext.arc(ccx, y, 3, 0, Math.TAU);
		canvasContext.fill();

		canvasContext.beginPath();
		canvasContext.fillStyle = "#000000";
		canvasContext.font="24px sans-serif";
		canvasContext.fillText("(θ, sin(θ))", ccx+5, y-5);
		canvasContext.fillText("(" + theta.toFixed(3) + ", " + Math.sin(a).toFixed(3) + ")", ccx+5, y-30);

		canvasContext.beginPath();
		canvasContext.strokeStyle = "#AAAAFF";
		canvasContext.moveTo(ccx, y);
		canvasContext.lineTo(x, y);
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.strokeStyle = "#0000FF";
		canvasContext.moveTo(0, ccy - radius*Math.sin(a-Math.TAU));
		for(i = 0.5; i >= 0; i -= 0.01 ) {
			canvasContext.lineTo(i*cwidth, ccy - radius*Math.sin(a + Math.TAU*((i-0.5)*2)));
		}
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.strokeStyle = "#DDDDFF";
		canvasContext.moveTo(0, ccy - radius*Math.sin(a-Math.TAU));
		for(i = 0.5; i < 1; i += 0.01 ) {
			canvasContext.lineTo(i*cwidth, ccy - radius*Math.sin(a + Math.TAU*((i-0.5)*2)));
		}
		canvasContext.stroke();

		//canvasContext.beginPath();
		//canvasContext.fillStyle = "#000000";
		//canvasContext.font="10px sans-serif";
		//canvasContext.fillText("θ=" + theta.toFixed(3), ccx+5, ccy-5);

		//app.pause();
		
		canvasContext.beginPath();
		canvasContext.strokeStyle = "#DDDDDD";
		canvasContext.moveTo(ccx/2, 0);
		canvasContext.lineTo(ccx/2, cwidth);
		canvasContext.stroke();
		
		canvasContext.fillStyle = "#000000";
		canvasContext.font="24px sans-serif";
		canvasContext.fillText("  -1", ccx/2-60, ccy-(radius*(-4/4))+6);
		canvasContext.fillText("-3/4", ccx/2-60, ccy-(radius*(-3/4))+6);
		canvasContext.fillText("-1/2", ccx/2-60, ccy-(radius*(-2/4))+6);
		canvasContext.fillText("-1/4", ccx/2-60, ccy-(radius*(-1/4))+6);
		canvasContext.fillText("   0", ccx/2-60, ccy+6);
		canvasContext.fillText(" 1/4", ccx/2-60, ccy-(radius*(1/4))+6);
		canvasContext.fillText(" 1/2", ccx/2-60, ccy-(radius*(2/4))+6);
		canvasContext.fillText(" 3/4", ccx/2-60, ccy-(radius*(3/4))+6);
		canvasContext.fillText("   1", ccx/2-60, ccy-radius+6);
		
		canvasContext.beginPath();
		canvasContext.strokeStyle = "#DDDDDD";
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(-4/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(-4/4)));
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(-3/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(-3/4)));
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(-2/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(-2/4)));
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(-1/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(-1/4)));
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(1/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(1/4)));
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(2/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(2/4)));
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(3/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(3/4)));
		canvasContext.moveTo(ccx/2-15, ccy-(radius*(4/4)));
		canvasContext.lineTo(ccx/2+15, ccy-(radius*(4/4)));
		canvasContext.stroke();
	};

	var drawTick = function(u, v) {
		if(u<0) return;

		var ro;
		if(mode==="pi") {
			if(v>4) return;
			ro = ((u/v)*Math.PI) - theta;
		}
		else {
			if(v>8) return;
			ro = ((u/v)*Math.TAU) - theta;
		}
		
		var ppr = cwidth/(2*Math.TAU);
		var po = ro*ppr;

		var x = po+ccx;
		var y = ccy+15;
		
		canvasContext.beginPath();
		canvasContext.strokeStyle = "#DDDDDD";
		canvasContext.moveTo(x, y);
		canvasContext.lineTo(x, y-radius-0.75*(radius/v));
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.fillStyle = "#000000";
		canvasContext.font="24x sans-serif";

		var text = u;
		if(v > 1){
			text += "/" + v;
		}
		
		if(mode==="pi") {
			text += " π";
		}
		else {
			text += " τ";
		}
		canvasContext.fillText(text, x, y-radius-0.75*(radius/v));

		if(v !== 1) {
			drawTick(u*2 - 1, v*2);
		}
		drawTick(u*2 + 1, v*2);

		// var x = ccx + ((a-(Math.TAU*revolutions))-(theta-(Math.TAU*revolutions)))*(cwidth/(2*Math.TAU));
		// var y = ccy-radius-(0.5*(1/scale)*radius);

		// canvasContext.beginPath();
		// canvasContext.strokeStyle = "#DDDDDD";
		// canvasContext.moveTo(x, ccy);
		// canvasContext.lineTo(x, y);
		// canvasContext.stroke();

		// canvasContext.beginPath();
		// canvasContext.fillStyle = "#000000";
		// canvasContext.font="10px sans-serif";
		// //canvasContext.fillText(a.toFixed(3), x, y-5);
		// canvasContext.fillText(revolutions + "/" + scale + " τ", x, y-5);
		
		// scale = 2*scale;
		// if(d==="both" || d==="right") {
		// 	drawTick(scale, a+(1/scale)*Math.TAU, "both");
		// }
		// if(d==="both" || d==="left") {
		// 	drawTick(scale, a-(1/scale)*Math.TAU, "both");
		// }
	};

// -- -- --

	var animationCallbackId = null;
	var initialized = false;
	var lastTimestamp = null;
	var totalElapsedTime = 0;
	var accumulatedTime = 0;

	var _init = function() {
		totalElapsedTime = 0;
		accumulatedTime = 0;

		init();
		initialized = true;
	};

	var _loop = function(timestamp) {
		if(app.running) {
			if(timestamp) {
				if(!lastTimestamp) {
					lastTimestamp = timestamp;
				}
				var elapsedTime = (timestamp-lastTimestamp)/1000;
				lastTimestamp = timestamp;

				if(elapsedTime > maxFrameElapsedTime ) {
					console.log("Too slow: " + elapsedTime + " seconds. Should be <" + maxFrameElapsedTime);
					elapsedTime = maxFrameElapsedTime;
				}

				accumulatedTime += elapsedTime;
				var processedTime = 0;

				while(accumulatedTime >= updateTimestep) {
					totalElapsedTime += updateTimestep;
					update(updateTimestep, totalElapsedTime);

					accumulatedTime -= updateTimestep;
					processedTime += updateTimestep;
				}

				draw(processedTime, totalElapsedTime);
			}
			else {
				lastTimestamp = null;
			}
			animationCallbackId = window.requestAnimationFrame(_loop);
		}
	};

// -- -- --

	var app = {};

	app.running = false;

	app.pause = function() {
		if(animationCallbackId) {
			window.cancelAnimationFrame(animationCallbackId);
			animationCallbackId = null;
		}

		app.running = false;
	};

	app.play = function(restart) {
		if(restart) {
			app.pause();
			initialized = false;
		}

		if(!initialized){
			_init();
		}

		app.running = true;

		if(!animationCallbackId) {
			_loop();
		}
	};

	if(start) {
		app.play();
	}

	return app;
})(true);