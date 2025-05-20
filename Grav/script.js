"use strict";

(function(start) {
	if(!Math.TAU) {
		Math.TAU = 2*Math.PI;
	}

	var width;
	var height;
	var centerX;
	var centerY;

	var canvas;
	var canvasContext;

	var points;

	var offsetX, offsetY;
	var scale;

	var c = 20000;
	var g = 5000;

	var init = function() {
		canvas = document.getElementById("theCanvas");
		canvas.width = 0.9*window.innerWidth;
		canvas.height = 0.9*window.innerHeight;
		//canvas.width = 4096;
		//canvas.height = 2304;

		width = canvas.width;
		height = canvas.height;
		centerX = Math.trunc(width / 2);
		centerY = Math.trunc(height / 2);

		offsetX = 0;
		offsetY = 0;
		scale = 1;

		canvasContext = canvas.getContext("2d");
		canvasContext.clearRect(0, 0, width, height);

		var i;
		var a, r;
		var x, y;
		var dx, dy, d;
		var v;
		points = [];
		for(i = 0; i<100; i ++) {
			a = Math.random()*Math.TAU;
			r = 2 + Math.random()*200;

			x = r*Math.cos(a);
			y = r*Math.sin(a);

			dx = x;
			dy = y;
			d = Math.sqrt(dx*dx + dy*dy);

			points[i] = {
				pos: {
					x: x,
					y: y
				},
				vel: {
					x: 500*(-dy/d)*(d/1100),
					y: 500*( dx/d)*(d/1100)
				},
				acc: {
					x: 0,
					y: 0
				},
				mass: 0.1 + (2*Math.random())
			};
			v = Math.sqrt(points[i].vel.x*points[i].vel.x + points[i].vel.y*points[i].vel.x);
			if(v > c) {
				points[i].vel.x = c*(points[i].vel.x/v);
				points[i].vel.y = c*(points[i].vel.y/v);
			}
		}
	};

	var update = function(elapsedTime, totalElapsedTime) {
		var i, j;
		var d, dx, dy;
		var ux, uy;
		var f, fx, fy;

		// Collisions
		for( i = 0; i < points.length; i ++ ) {
			if( points[i] ) {
				points[i].acc.x = 0;
				points[i].acc.y = 0;

				for( j = i+1; j < points.length; j ++ ) {
					if( points[j] ) {
						dx = points[j].pos.x - points[i].pos.x;
						dy = points[j].pos.y - points[i].pos.y;
						d = Math.sqrt(dx*dx + dy*dy);

						//if(d < 0.25*(points[i].mass+points[j].mass)) {
						if(d < (points[i].mass+points[j].mass)) {
							points[i].pos.x = ((points[i].mass*points[i].pos.x)+(points[j].mass*points[j].pos.x))/(points[i].mass+points[j].mass);
							points[i].pos.y = ((points[i].mass*points[i].pos.y)+(points[j].mass*points[j].pos.y))/(points[i].mass+points[j].mass);

							points[i].vel.x = ((points[i].mass*points[i].vel.x)+(points[j].mass*points[j].vel.x))/(points[i].mass+points[j].mass);
							points[i].vel.y = ((points[i].mass*points[i].vel.y)+(points[j].mass*points[j].vel.y))/(points[i].mass+points[j].mass);
							
							points[i].mass = points[i].mass+points[j].mass;

							points[j] = null;
						}
					}
				}
			}
		}

		//g += 100*elapsedTime;

		// Forces
		for( i = 0; i < points.length; i ++ ) {
			if(points[i]) {
				for( j = i+1; j < points.length; j ++ ) {
					if(points[j]) {
						dx = points[j].pos.x - points[i].pos.x;
						dy = points[j].pos.y - points[i].pos.y;
						d = Math.sqrt(dx*dx + dy*dy);

						ux = dx/d;
						uy = dy/d;

						f = g*((points[i].mass * points[j].mass) / (d*d));
						fx = f*ux;
						fy = f*uy;

						points[i].acc.x += fx/points[i].mass;
						points[i].acc.y += fy/points[i].mass;

						points[j].acc.x -= fx/points[j].mass;
						points[j].acc.y -= fy/points[j].mass;

						// dx = points[i].pos.x;
						// dy = points[i].pos.y;
						// //d = Math.sqrt(dx*dx + dy*dy);
						// d = (dx*dx + dy*dy);

						// ux = dx/d;
						// uy = dy/d;

						// //f = -d/10;
						// fx = f*ux;
						// fy = f*uy;

						// //points[i].acc.x += fx/points[i].mass;
						// //points[i].acc.y += fy/points[i].mass;
						// points[i].acc.x += fx;
						// points[i].acc.y += fy;
					}
				}

				var v0x = points[i].vel.x;
				var v0y = points[i].vel.y;
				var v0 = Math.sqrt(v0x*v0x + v0y*v0y);

				var v1x = elapsedTime*points[i].acc.x;
				var v1y = elapsedTime*points[i].acc.y;
				var v1 = Math.sqrt(v1x*v1x + v1y*v1y);

				var v = (v0+v1) / (1 + ((v0*v1)/(c*c)));
				var vx = v*((v0x+v1x)/(v0+v1));
				var vy = v*((v0y+v1y)/(v0+v1));

				points[i].vel.x = vx;
				points[i].vel.y = vy;

				points[i].pos.x += elapsedTime*points[i].vel.x;
				points[i].pos.y += elapsedTime*points[i].vel.y;
			}
		}
	};


	var draw = function(elapsedTime, totalElapsedTime) {
		var i, a;

		var worldMinX = Number.MAX_SAFE_INTEGER;
		var worldMinY = Number.MAX_SAFE_INTEGER;

		var worldMaxX = Number.MIN_SAFE_INTEGER;
		var worldMaxY = Number.MIN_SAFE_INTEGER;

		var totalMass = 0;
		var worldMassCenterX = 0;
		var worldMassCenterY = 0;
		
		var numPoints = 0;
		var worldCenterX = 0;
		var worldCenterY = 0;

		var worldWidth;
		var worldHeight;

		var targetViewWidth;
		var targetViewHeight;
		var targetViewScaleX;
		var targetViewScaleY;
		var targetViewScale;
		var targetViewOffsetX;
		var targetViewOffsetY;

		var x,y;
		var vx, vy;
		var ax, ay;

		var screenX, screenY;

		for( i = 0; i < points.length; i ++ ) {
			if(points[i]) {
				if( points[i].pos.x < worldMinX ) { worldMinX = points[i].pos.x; }
				if( points[i].pos.y < worldMinY ) { worldMinY = points[i].pos.y; }
				
				if( points[i].pos.x > worldMaxX ) { worldMaxX = points[i].pos.x; }
				if( points[i].pos.y > worldMaxY ) { worldMaxY = points[i].pos.y; }

				numPoints ++;
				worldCenterX += points[i].pos.x;
				worldCenterY += points[i].pos.y;

				totalMass += points[i].mass;
				worldMassCenterX += points[i].mass*points[i].pos.x;
				worldMassCenterY += points[i].mass*points[i].pos.y;
			}
		}

		worldCenterX = worldCenterX/numPoints;
		worldCenterY = worldCenterY/numPoints;

		worldMassCenterX = worldMassCenterX/totalMass;
		worldMassCenterY = worldMassCenterY/totalMass;

		worldWidth = worldMaxX - worldMinX;
		worldHeight = worldMaxY - worldMinY;

		targetViewWidth = worldWidth + 2*Math.abs(worldCenterX-worldMassCenterX);
		targetViewHeight = worldHeight + 2*Math.abs(worldCenterY-worldMassCenterY);

		if(numPoints > 1) {
			targetViewScaleX = width/targetViewWidth;
			targetViewScaleY = height/targetViewHeight;
			targetViewScale = Math.min(targetViewScaleX, targetViewScaleY);
			//targetViewScale = Math.max(targetScale, 0.1);

			targetViewOffsetX = (width-(targetViewWidth*targetViewScale))/2;
			targetViewOffsetY = (height-(targetViewHeight*targetViewScale))/2;
		}
		else {
			targetViewScaleX = 1;
			targetViewScaleY = 1;
			targetViewScale = 1;

			targetViewOffsetX = centerX;
			targetViewOffsetY = centerY;
		}

		canvasContext.clearRect(0, 0, width, height);

		a = 0.9*elapsedTime;
		offsetX = (1-a)*offsetX + a*targetViewOffsetX;
		offsetY = (1-a)*offsetY + a*targetViewOffsetY;
		scale = (1-a)*scale + a*targetViewScale

		// min/max bounds
		canvasContext.beginPath();
		canvasContext.strokeStyle="rgb(255,255,255)";
		var X0 = (worldMinX-worldMinX)*scale + offsetX;
		var Y0 = (worldMinY-worldMinY)*scale + offsetY;
		var X1 = (worldMaxX-worldMinX)*scale + offsetX;
		var Y1 = (worldMaxY-worldMinY)*scale + offsetY;
		canvasContext.rect(X0, Y0, X1-X0, Y1-Y0);
		canvasContext.stroke();

		for( i = 0; i < points.length; i ++ ) {
			if(points[i]) {
				x = points[i].pos.x;
				y = points[i].pos.y;
				screenX = (x-worldMinX)*scale + offsetX;
				screenY = (y-worldMinY)*scale + offsetY;

				vx = points[i].vel.x;
				vy = points[i].vel.y;

				ax = points[i].acc.x;
				ay = points[i].acc.y;

				// position
				canvasContext.beginPath();
				canvasContext.arc(screenX, screenY,
					Math.max(2, scale*points[i].mass),
					0, Math.TAU);
				canvasContext.fillStyle="rgb(0,"+ Math.trunc(255-(255*((i+1)/points.length))) +",0)";
				canvasContext.fill();

				// velocity
				canvasContext.beginPath();
				canvasContext.strokeStyle="rgb(255,0,0)";
				canvasContext.moveTo(screenX, screenY);
				canvasContext.lineTo(screenX+scale*vx, screenY+scale*vy);
				//var V = Math.sqrt(vx*vx + vy*vy);
				//canvasContext.lineTo(screenX+20*(vx/V), screenY+20*(vy/V));
				canvasContext.stroke();

				// acceleration
				canvasContext.beginPath();
				canvasContext.strokeStyle="rgb(0,0,255)";
				canvasContext.moveTo(screenX, screenY);
				canvasContext.lineTo(screenX+scale*ax, screenY+scale*ay);
				//var A = Math.sqrt(ax*ax + ay*ay);
				//canvasContext.lineTo(screenX+20*(ax/A), screenY+20*(ay/V));
				canvasContext.stroke();
			}
		}

		// center of mass
		canvasContext.beginPath();
		canvasContext.arc((worldMassCenterX-worldMinX)*scale + offsetX, (worldMassCenterY-worldMinY)*scale + offsetY,
			5,
			0, Math.TAU);
		canvasContext.fillStyle="rgb(255,255,255)";
		canvasContext.fill();

		// center of world
		canvasContext.beginPath();
		canvasContext.arc((worldCenterX-worldMinX)*scale + offsetX, (worldCenterY-worldMinY)*scale + offsetY,
			3,
			0, Math.TAU);
		canvasContext.fillStyle="rgb(255,255,0)";
		canvasContext.fill();
	};


// -- -- --

	const timestep = 1/240;
	const maxElapsedTime = 1/4;

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
		if(timestamp) {
			if(!lastTimestamp) {
				lastTimestamp = timestamp;
			}
			var elapsedTime = (timestamp-lastTimestamp)/1000;
			lastTimestamp = timestamp;

			if(elapsedTime > maxElapsedTime ) {
				console.log("Too slow: " + elapsedTime + ". Should be <" + maxElapsedTime);
				elapsedTime = maxElapsedTime;
			}

			accumulatedTime += elapsedTime;
			var processedTime = 0;

			while(accumulatedTime >= timestep) {
				totalElapsedTime += timestep;
				update(timestep, totalElapsedTime);

				accumulatedTime -= timestep;
				processedTime += timestep;
			}

			draw(processedTime, totalElapsedTime);
		}
		else {
			lastTimestamp = null;
		}
		animationCallbackId = window.requestAnimationFrame(_loop);
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