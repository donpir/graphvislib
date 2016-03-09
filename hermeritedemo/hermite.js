var n=4,
    q=[{"i":0,"x":100,"y":150},{"i":1,"x":200,"y":80},{"i":2,"x":300,"y":250},{"i":3,"x":350,"y":100}],
    steps=100;

var svg = d3.select("#vis").append("svg")
    .attr("width",800)
    .attr("height",800);

var color = d3.scale.category10();

var line = d3.svg.line()
	    .x(function(d) {return d.x;})
	    .y(function(d) {return d.y;})
	    .interpolate("linear");

var controls = svg.selectAll("circle.control")
	.data(q)
	.enter().append("circle")
	.attr("class","control")
	.attr("r",8)
	.attr("cx",function(d) {return d.x;})
	.attr("cy",function(d) {return d.y;})
	.style("fill", function(d) { return color(d.i); })
	.call(d3.behavior.drag()
	.on("dragstart", function(d) {
		this.__origin__ = [d.x, d.y];
	})
	.on("drag", function(d) {
		d.x = Math.min(400, Math.max(0, this.__origin__[0] += d3.event.dx));
		d.y = Math.min(400, Math.max(0, this.__origin__[1] += d3.event.dy));
		svg.selectAll("circle.control")
			.data(q)
			.attr("cx",function(d) {return d.x;})
			.attr("cy",function(d) {return d.y;});
		update();
	})
	.on("dragend", function() {
		delete this.__origin__;
	}));

function linear(x0,y0,x1,y1,t)
{
	return { "x": x0+(x1-x0)*t, "y": y0+(y1-y0)*t };
}

function hermite(t) {
	var q0x=q[0].x,
	    q0y=q[0].y,

	    q1x=q[1].x-q[0].x,
	    q1y=q[1].y-q[0].y,

	    q2x=q[2].x,
	    q2y=q[2].y,

	    q3x=q[3].x-q[2].x,
	    q3y=q[3].y-q[2].y;

	tt=Math.pow(t,2);
	ttt=Math.pow(t,3);
	return {"x": (2*ttt-3*tt+1)*q0x+(ttt-2*tt+t)*q1x+(-2*ttt+3*tt)*q2x+(ttt-tt)*q3x,
        "y": (2*ttt-3*tt+1)*q0y+(ttt-2*tt+t)*q1y+(-2*ttt+3*tt)*q2y+(ttt-tt)*q3y};
}


update();


function update() {
	var curveGraph=svg.selectAll("path.curve")
		.data(makeCurve());
	curveGraph.enter().append("path");
	curveGraph.attr("class","curve")
		.attr("d",line);

}

function makeCurve() {
	curve = d3.range(steps+1).map(function(i) { return hermite(i/steps);})
	return [curve];
}
