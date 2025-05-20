"use strict";
//import { canvasFactory, appFactory, animatedCanvasAppFactory } from "./CanvasAnimationTemplate.js";

(function () {
	if (!Math.TAU) { Math.TAU = 2 * Math.PI; }

	let canvasContext;
	let canvasContextImageData;

	let size;
	let num;

	const app = animatedCanvasAppFactory(
		{
			id: "myCanvas",

			parent: document.body,

			init: function (canvas) {
				canvasContext = canvas.getContext("2d");
				canvasContextImageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
				let data = canvasContextImageData.data;

				size = data.length / 4;
				num = Math.trunc(0.01 * size);

				let i = 0;
				for (let y = 0; y < canvas.height; y++) {
					for (let x = 0; x < canvas.width; x++) {
						data[i + 0] = Math.trunc(256 * Math.random());
						data[i + 1] = Math.trunc(256 * Math.random());
						data[i + 2] = Math.trunc(256 * Math.random());
						data[i + 3] = 255;

						i += 4;
					}
				}
				canvasContext.putImageData(canvasContextImageData, 0, 0);
			},

			// Called every updateTimestep, independent of draw rate.
			//   elapsedTimeSinceUpdate === updateTimestep
			update: function (elapsedTimeSinceUpdate, totalElapsedTime) {
				let data = canvasContextImageData.data;

				for (let i = 0; i < num; i++) {
					let p = Math.trunc(size * Math.random()) * 4;

					data[p + 0] = (data[p + 0] + Math.trunc(10 * Math.random())) % 256;
					data[p + 1] = (data[p + 1] + Math.trunc(10 * Math.random())) % 256;
					data[p + 2] = (data[p + 2] + Math.trunc(10 * Math.random())) % 256;
				}
			},

			// Called no less than every maxFrameElapsedTime, independent of update rate.
			// Targets 30-60 fps via window.requestAnimationFrame
			//   elapsedTimeSinceDraw ~ 1/60 && elapsedTimeSinceDraw <= maxFrameElapsedTime
			draw: function (elapsedTimeSinceDraw, totalElapsedTime) {
				canvasContext.putImageData(canvasContextImageData, 0, 0);
			}
		}
	);

	app.play();
})();
