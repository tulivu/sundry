"use strict";

(function (start) {
	if (!Math.TAU) { Math.TAU = 2 * Math.PI; }

	//const updateTimestep = 1 / 240;
	const updateTimestep = 1 / 24;
	const maxFrameElapsedTime = 1 / 4;

	// Canvas
	var canvas;
	var cwidth, cheight;
	var ccx, ccy;
	var canvasContext;

	var list;
	var canvas2ContextImageData, rmap;

	var init = function () {
		canvas = document.getElementById("theCanvas");
		//canvas.width = 0.9*window.innerWidth;
		//canvas.height = 0.9*window.innerHeight;
		//canvas.width = 4096;
		//canvas.height = 2304;

		cwidth = canvas.width;
		cheight = canvas.height;
		ccx = Math.trunc(cwidth / 2);
		ccy = Math.trunc(cheight / 2);

		canvasContext = canvas.getContext("2d");

		var canvas2 = document.createElement("canvas");
		canvas2.width = cwidth;
		canvas2.height = cheight;
		var canvas2Context = canvas2.getContext("2d");
		canvas2Context.font = "bolder 48px sans-serif";
		canvas2Context.shadowBlur = 30;
		canvas2Context.shadowColor = "black";
		canvas2Context.fillStyle = "black";
		canvas2Context.fillText("Happy Birthday!", 24, ccy + (24 / 2));
		canvas2ContextImageData = canvas2Context.getImageData(0, 0, cwidth, cheight);
		rmap = canvas2ContextImageData.data;
		for (var i = 0; i < rmap.length; i += 4) {
			rmap[i + 0] = 255 - rmap[i + 3];
			rmap[i + 1] = 255 - rmap[i + 3];
			rmap[i + 2] = 255 - rmap[i + 3];
			rmap[i + 3] = 255;
		}
		canvas2Context.putImageData(canvas2ContextImageData, 0, 0);
		//document.body.appendChild(canvas2);

		// Do init stuff
		list = {
			count: 0,
			first: null,

			createNode: function (data) {
				return {
					data: data,
					next: null
				};
			},

			insertAfter: function (existingNode, data) {
				var newNode = this.createNode(data);

				if (existingNode === null) {
					newNode.next = this.first;
					this.first = newNode;
				}
				else {
					newNode.next = existingNode.next;
					existingNode.next = newNode;
				}

				this.count++;
			}
		};

		var x, y, r;

		x = cwidth - 24;
		y = ccy + 10 * Math.random() - 5;
		r = 1;//10*Math.random() + 10;
		list.insertAfter(null, createData(x, y, r));

		x = 24;
		y = ccy + 10 * Math.random() - 5;
		r = 1;//10*Math.random() + 10;
		list.insertAfter(null, createData(x, y, r));
	};

	var calcR = function (x, y) {
		//return 0.2 * (y/(Math.abs(y - ccy)+1)) + 1;
		//return 10;
		//return (1000 / (list.count + 1)) + 1;
		var r;

		var i = 4 * (Math.floor(x) + cwidth * Math.floor(y));
		if (i < 0 || i > rmap.length) {
			r = 255;
		}
		else {
			r = rmap[i];
		}
		r = r / 255;
		r = r * (0.9 * (2 * (Math.abs(y - ccy) / cheight)) + 0.1);
		r = r + 1;
		r = r * r * r * r;

		return r;
	};

	var subdivide = function () {
		var node, nextNode, x, y, a, r;
		node = list.first;
		nextNode = node.next;

		while (nextNode !== null) {
			a = 0.25 + 0.5 * Math.random();
			x = a * node.data.x + (1 - a) * nextNode.data.x + (2 * Math.random() - 1);
			//x = Math.random()*cwidth;

			//y = a * node.data.y + (1 - a) * nextNode.data.y + (2 * Math.random() - 1);
			y = ccy + 10 * Math.random() - 5;

			r = 0.01;//10*Math.random() + 10;

			list.insertAfter(node, createData(x, y, r));

			node = nextNode;
			nextNode = nextNode.next;
		}
	};

	var createData = function (x, y, r) {
		return {
			x: x,
			y: y,
			vx: 0,
			vy: 0,
			ax: 0,
			ay: 0,
			r: r
		};
	};

	var lastSubdivide = 0;
	var waitTime = 0.1;

	// Called every updateTimestep, independent of draw rate.
	var update = function (elapsedTimeSinceUpdate, totalElapsedTime) {
		// Do update stuff
		// elapsedTimeSinceUpdate === updateTimestep

		if (list.count < 2000) {
			if ((totalElapsedTime - lastSubdivide) > waitTime) {
				subdivide();
				lastSubdivide = totalElapsedTime;
				waitTime += 0.1;
			}
		}

		var node, otherNode;
		var dx, dy, d2, d;
		var r;
		var dax, day;

		node = list.first;
		while (node !== null) {
			otherNode = node.next;
			while (otherNode !== null) {
				dx = node.data.x - otherNode.data.x;
				dy = node.data.y - otherNode.data.y;
				d2 = dx * dx + dy * dy;
				r = node.data.r + otherNode.data.r;
				if (d2 < (r * r)) {
					d = Math.sqrt(d2);

					dax = elapsedTimeSinceUpdate * 500 * (dx / d);
					day = elapsedTimeSinceUpdate * 500 * (dy / d);

					node.data.ax += dax;
					node.data.ay += day;

					otherNode.data.ax -= dax;
					otherNode.data.ay -= day;
				}

				otherNode = otherNode.next;
			}

			if (node.data.x - node.data.r < 0) {
				//node.data.ax += elapsedTimeSinceUpdate * 100000;
				node.data.ax *= 0.0;
				//node.data.vx *= 0.0;
			}
			else if (node.data.x + node.data.r > cwidth) {
				//node.data.ax -= elapsedTimeSinceUpdate * 100000;
				node.data.ax *= 0.0;
				//node.data.vx *= 0.0;
			}

			if (node.data.y - node.data.r < 0) {
				//node.data.ay += elapsedTimeSinceUpdate * 100000;
				node.data.ay *= 0.0;
				//node.data.vy *= 0.0;
			}
			else if (node.data.y + node.data.r > cheight) {
				//node.data.ay -= elapsedTimeSinceUpdate * 100000;
				node.data.ay *= 0.0;
				//node.data.vy *= 0.0;
			}

			node = node.next;
		}

		node = list.first;
		while (node !== null) {
			node.data.vx += elapsedTimeSinceUpdate * node.data.ax;
			node.data.vy += elapsedTimeSinceUpdate * node.data.ay;

			node.data.x += elapsedTimeSinceUpdate * node.data.vx;
			node.data.y += elapsedTimeSinceUpdate * node.data.vy;

			node.data.vx *= 0.9;
			node.data.vy *= 0.9;

			node.data.ax *= 0.0;
			node.data.ay *= 0.0;

			node.data.r = 0.99 * node.data.r + (1 - 0.99) * calcR(node.data.x, node.data.y);

			node = node.next;
		}
	};

	// Called no less than every maxFrameElapsedTime, independent of update rate.
	// Targets 30-60 fps via window.requestAnimationFrame
	var draw = function (elapsedTimeSinceDraw, totalElapsedTime) {
		// Do drawing
		// elapsedTimeSinceDraw ~ 1/60 && elapsedTimeSinceDraw <= maxFrameElapsedTime

		//canvasContext.putImageData(canvas2ContextImageData, 0, 0);

		var node, pnode, nnode;
		// var m = 0;
		// var dx1 = 0;
		// var dy1 = 0;
		// var dx2, dy2;

		canvasContext.clearRect(0, 0, cwidth, cheight);
		//canvasContext.putImageData(canvas2ContextImageData, 0, 0);
		canvasContext.lineWidth = 1;

		// canvasContext.beginPath();
		// canvasContext.moveTo(list.first.data.x, list.first.data.y);

		// pnode = list.first;
		// node = pnode.next;

		// while (node !== null) {
		// 	// nnode = node.next;
		// 	// if (nnode !== null) {
		// 	// 	m = gradient(pnode.data, nnode.data);
		// 	// 	dx2 = (nnode.data.x - node.data.x) * -0.3;
		// 	// 	dy2 = dx2 * m * 0.6;
		// 	// } else {
		// 	// 	dx2 = 0;
		// 	// 	dy2 = 0;
		// 	// }

		// 	// canvasContext.bezierCurveTo(
		// 	// 	pnode.data.x - dx1, pnode.data.y - dy1,
		// 	// 	node.data.x + dx2, node.data.y + dy2,
		// 	// 	node.data.x, node.data.y);
		// 	canvasContext.lineTo(node.data.x, node.data.y);

		// 	// dx1 = dx2;
		// 	// dy1 = dy2;
		// 	// pnode = node;
		// 	node = node.next;
		// }
		// canvasContext.stroke();


		node = list.first;
		while (node !== null) {
			canvasContext.beginPath();
			canvasContext.arc(node.data.x, node.data.y, node.data.r, 0, Math.TAU);
			canvasContext.stroke();
			node = node.next;
		}
	};

	function gradient(a, b) {
		return (b.y - a.y) / (b.x - a.x);
	}


	// -- -- --

	var animationCallbackId = null;
	var initialized = false;
	var lastTimestamp = null;
	var totalElapsedTime = 0;
	var accumulatedTime = 0;

	var _init = function () {
		totalElapsedTime = 0;
		accumulatedTime = 0;

		init();
		initialized = true;
	};

	var _loop = function (timestamp) {
		if (timestamp) {
			if (!lastTimestamp) {
				lastTimestamp = timestamp;
			}
			var elapsedTime = (timestamp - lastTimestamp) / 1000;
			lastTimestamp = timestamp;

			if (elapsedTime > maxFrameElapsedTime) {
				elapsedTime = maxFrameElapsedTime;
			}

			accumulatedTime += elapsedTime;
			var processedTime = 0;

			while (accumulatedTime >= updateTimestep) {
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
	};

	// -- -- --

	var app = {};

	app.running = false;

	app.pause = function () {
		if (animationCallbackId) {
			window.cancelAnimationFrame(animationCallbackId);
			animationCallbackId = null;
		}

		app.running = false;
	};

	app.play = function (restart) {
		if (restart) {
			app.pause();
			initialized = false;
		}

		if (!initialized) {
			_init();
		}

		app.running = true;

		if (!animationCallbackId) {
			_loop();
		}
	};

	if (start) {
		app.play();
	}

	return app;
})(true);