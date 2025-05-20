window.onload = function () {
	var canvas = document.getElementById("theCanvas");
	var size = canvas.width * canvas.height;
	var context = canvas.getContext("2d");
	var imageData = context.createImageData(canvas.width, canvas.height);
	var data = imageData.data;


	var cycleTime = 10000; //ms

	var metaballs;
	var angle;
	var radius;

	var startTimestamp;
	var lastTimestamp;

	var init = function () {
		var i;

		for (i = 0; i < size; i++) {
			data[i * 4 + 0] = 0;
			data[i * 4 + 1] = 0;
			data[i * 4 + 2] = 0;
			data[i * 4 + 3] = 255;
		}

		var centerx = toInt(canvas.width / 2);
		var centery = toInt(canvas.height / 2);
		var weight = Math.min(canvas.width, canvas.height) / 20; 

		radius = Math.min(canvas.width, canvas.height) / 5.5;


		metaballs = [];
		metaballs.push({
			r: weight,
			cx: centerx - (centerx / 3),
			cy: centery - (centery / 3),
		});
		metaballs.push({
			r: weight,
			cx: centerx + (centerx / 3),
			cy: centery - (centery / 3),
		});
		metaballs.push({
			r: weight,
			cx: centerx + (centerx / 3),
			cy: centery + (centery / 3),
		});
		metaballs.push({
			r: weight,
			cx: centerx - (centerx / 3),
			cy: centery + (centery / 3),
		});

		angle = 1.25*Math.PI;

		startTimestamp = null;
		lastTimestamp = null;
	};

	var iterate = function (dt) {
		var x = Math.sqrt(Math.abs(Math.cos(angle))) * radius * Math.sign(Math.cos(angle));
		var y = Math.sqrt(Math.abs(Math.sin(angle))) * radius * Math.sign(Math.sin(angle));

		metaballs[0].x = metaballs[0].cx - x;
		metaballs[0].y = metaballs[0].cy - y;

		metaballs[1].x = metaballs[1].cx + x;
		metaballs[1].y = metaballs[1].cy - y;

		metaballs[2].x = metaballs[2].cx + x;
		metaballs[2].y = metaballs[2].cy + y;

		metaballs[3].x = metaballs[3].cx - x;
		metaballs[3].y = metaballs[3].cy + y;

		angle += (2 * Math.PI) * (dt / cycleTime);
		if (angle > 2 * Math.PI) {
			angle -= 2 * Math.PI;
		}
	};

	var render = function () {
		var i, j;
		var x, y;
		var dx, dy;
		var dx2, dy2;
		var metaball;
		var c;
		for (i = 0; i < size; i++) {
			x = i % canvas.width;
			y = toInt((i - x) / canvas.width);

			c = 0;
			for (j = 0; j < metaballs.length; j++) {
				metaball = metaballs[j];
				dx = metaball.x - x;
				dy = metaball.y - y;
				
				dx2 = dx * dx;
				dy2 = dy * dy;
				if ((dx2 < 1) && (dy2 < 1)) {
					c = 1;
				}
				else {
					c += metaball.r / Math.sqrt(dx2 + dy2);
				}
			}

			c = c * c * c * c;
			c = Math.max(0, Math.min(255, toInt(255 * c)));
			data[i * 4 + 0] = c;
			data[i * 4 + 1] = c;
			data[i * 4 + 2] = c;
		}
		context.putImageData(imageData, 0, 0);
	};

	var toInt = function (value) {
		return ~ ~value;
	};

	var run = function (timestamp) {
		if (!startTimestamp) startTimestamp = timestamp;
		if (!lastTimestamp) lastTimestamp = timestamp;

		var dt = timestamp - lastTimestamp;
		lastTimestamp = timestamp;

		iterate(dt);
		render();

		requestAnimationFrame(run);
	};

	init();
	requestAnimationFrame(run);
};