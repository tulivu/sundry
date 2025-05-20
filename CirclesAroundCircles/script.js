"use strict";

(function() {
	if(!Math.TAU) { Math.TAU = 2*Math.PI; }

	var svg;
	var cwidth, cheight;
	var ccx, ccy;

	svg = document.getElementById("theSvg");
	svg.setAttribute("width", 0.9*window.innerWidth);
	svg.setAttribute("height", 0.9*window.innerHeight);

	cwidth = Number(svg.getAttribute("width"));
	cheight = Number(svg.getAttribute("height"));
	ccx = Math.trunc(cwidth / 2);
	ccy = Math.trunc(cheight / 2);
	
	var draw = function() {
		var r = Math.min(cwidth, cheight)/8;
		
		drawCircle(ccx, ccy, r);

		subdraw(ccx, ccy, 0*Math.TAU/4, r, 1/2, 1);
		subdraw(ccx, ccy, 1*Math.TAU/4, r, 1/2, 1);
		subdraw(ccx, ccy, 2*Math.TAU/4, r, 1/2, 1);
		subdraw(ccx, ccy, 3*Math.TAU/4, r, 1/2, 1);
	};

	var subdraw  = function(cx, cy, a, r, dr, min_r) {
		var sub_r = r*dr;
		var sub_cx = cx + (r + 1.05*sub_r)*Math.cos(a);
		var sub_cy = cy + (r + 1.05*sub_r)*Math.sin(a);

		drawCircle(sub_cx, sub_cy, sub_r);

		if( sub_r > min_r) {
			subdraw(sub_cx, sub_cy, a, sub_r, 1.0*dr, min_r);

			subdraw(sub_cx, sub_cy, a+(Math.TAU/4), sub_r, 0.8*dr, min_r);
			subdraw(sub_cx, sub_cy, a-(Math.TAU/4), sub_r, 0.8*dr, min_r);
		}
	};

	var drawCircle = function(x, y, r) {
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("cx", x);
		circle.setAttribute("cy", y);
		circle.setAttribute("r", r);
		//circle.setAttribute("fill", "black");
		//circle.setAttribute("fill-opacity", "0.0");
		//circle.setAttribute("stroke", "black");
		//circle.setAttribute("stroke-width", "1");
		svg.appendChild(circle);
	};

	draw();
})();