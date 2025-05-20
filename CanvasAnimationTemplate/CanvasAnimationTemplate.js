"use strict";

const canvasFactory = function (spec) {
	spec = spec || {};
	//const id = spec.id || "_" + btoa(crypto.getRandomValues(new Uint32Array(32)));
	const id = spec.id || "_" + btoa(Math.random());
	const parent = spec.parent || document.body;
	const width = spec.width || 800;
	const height = spec.height || 600;

	let _canvasElement = document.getElementById(id);
	if (!_canvasElement) {
		_canvasElement = document.createElement("canvas");
		_canvasElement.id = id;
		_canvasElement.width = width;
		_canvasElement.height = height;

		parent.appendChild(_canvasElement);
	}
	//else
	//{
	//	if(canvasElement.parentElement && parent !== canvasElement.parentElement)
	//	{
	//		canvasElement.parentElement.removeChild(canvasElement);
	//		parent.appendChild(canvasElement);
	//	}
	//}

	return _canvasElement;
};

const animatedAppFactory = function (spec) {
	spec = spec || {};

	const init = spec.init || (() => { });
	const update = spec.update || ((elapsedTimeSinceUpdate, totalElapsedTime) => { });
	const draw = spec.draw || ((elapsedTimeSinceDraw, totalElapsedTime) => { });

	let _animationCallbackId = null;
	let _initialized = false;
	let _lastTimestamp = null;
	let _totalElapsedTime = 0;
	let _accumulatedTime = 0;

	const _init = function () {
		_totalElapsedTime = 0;
		_accumulatedTime = 0;

		init();

		_initialized = true;
	};

	const _loop = function (timestamp) {
		if (timestamp) {
			const updateTimestep = 1 / 240;
			const maxFrameElapsedTime = 1 / 4;

			if (!_lastTimestamp) {
				_lastTimestamp = timestamp;
			}

			let elapsedTime = (timestamp - _lastTimestamp) / 1000;
			_lastTimestamp = timestamp;

			if (elapsedTime > maxFrameElapsedTime) {
				//console.log(`Too slow: ${elapsedTime} seconds. Should be < ${maxFrameElapsedTime}`);
				elapsedTime = maxFrameElapsedTime;
			}

			_accumulatedTime += elapsedTime;

			let processedTime = 0;
			while (_accumulatedTime >= updateTimestep) {
				_totalElapsedTime += updateTimestep;

				update(updateTimestep, _totalElapsedTime);

				_accumulatedTime -= updateTimestep;
				processedTime += updateTimestep;
			}

			draw(processedTime, _totalElapsedTime);
		}
		else {
			_lastTimestamp = null;
		}

		_animationCallbackId = window.requestAnimationFrame(_loop);
	};

	//	const _pause = function (toggle) {
	//		if (_animationCallbackId) {
	//			window.cancelAnimationFrame(_animationCallbackId);
	//			_animationCallbackId = null;
	//		}
	//		else if (toggle) {
	//			_play();
	//		}
	//	};
	//
	//	const _play = function (restart) {
	//		if (restart) {
	//			_pause();
	//			_initialized = false;
	//		}
	//
	//		if (!_initialized) {
	//			_init();
	//		}
	//
	//		if (!_animationCallbackId) {
	//			_loop();
	//		}
	//	};
	//
	//	return {
	//		pause: _pause,
	//		play: _play
	//	};

	return {
		pause: function (toggle) {
			if (_animationCallbackId) {
				window.cancelAnimationFrame(_animationCallbackId);
				_animationCallbackId = null;
			}
			else if (toggle) {
				this.play();
			}
		},

		play: function (restart) {
			if (restart) {
				this.pause();
				_initialized = false;
			}

			if (!_initialized) {
				_init();
			}

			if (!_animationCallbackId) {
				_loop();
			}
		}
	};
};

const animatedCanvasAppFactory = function (spec) {
	spec = spec || {};

	const init = spec.init || ((canvas) => { });

	const canvas = canvasFactory(spec);
	const app = animatedAppFactory({
		init: function () {
			init(canvas);
		},
		update: spec.update,
		draw: spec.draw
	});
	return app;
};

//export { canvasFactory, appFactory, animatedCanvasAppFactory };
