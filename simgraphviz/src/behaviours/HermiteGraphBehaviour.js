
var col1 = "red";
var col2 = "orange";

function HermiteGraphBehaviour() {
};//EndConstructor.

HermiteGraphBehaviour.prototype = new BaseGraphBehaviour();

HermiteGraphBehaviour.prototype.init = function(svg, jsonGraph, force) {
    this._svg = svg;
    this._jsonGraph = jsonGraph;
    this._force = force;
    this._radious = 20;
    this.colour = d3.scale.category20();
    var _this = this;

    //LINKS.
    this.linkShapes = this._svg.selectAll(".lnkShapes")
        .data(this._jsonGraph.links).enter();

    this.link = this.linkShapes
        .append("line")
        .attr("class", "link");

    /*this.link = this._
        .append("g")
        .attr("class", "link");*/

    //NODES.
    this.nodeShapes = this._svg.selectAll(".nodeShapes")
        .data(jsonGraph.nodes)
        .enter();

    this.node = this.nodeShapes.append("rect")
        .attr("class", "node")
        .style("fill", function(d) { return _this.colour(d.group); })
        .call(this._force.drag);

    this.title = this.nodeShapes.append("text")
        .attr("class", "nodeTitle")
        .text(function(d) { return d.name; });
};

var n=4,
    q=[{"i":0,"x":100,"y":150},{"i":1,"x":200,"y":80},{"i":2,"x":300,"y":250},{"i":3,"x":350,"y":100}],
    steps=100;


var line = d3.svg.line()
    .x(function(d) {return d.x;})
    .y(function(d) {return d.y;})
    .interpolate("linear");

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

function makeCurve() {
    var curve = d3.range(steps+1).map(function(i) { return hermite(i/steps);})
    return [curve];
}


HermiteGraphBehaviour.prototype.update = function() {
    var _this = this;

    var reducer = 8;
    var nodeWidth = _this._radious/2;

    //It places the nodes.
    this.node.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return nodeWidth; })
        .attr("height", function(d) { return d.length / reducer; });

    //It places the nodes labels.
    this.title.attr("x", function(d) { return d.x - _this._radious; })
        .attr("y", function(d) { return d.y - 3; });

    /*this.link
        .data(makeCurve())
        .enter()
        .append("path")
        .attr("d", line);*/


    this.link
        .attr("x1", function(d) { return d.source.x + ((d.source.x < d.target.x) ? nodeWidth : 0); })
        .attr("y1", function(d) { return d.source.y + d.sourceStart / reducer; })
        .attr("x2", function(d) { return d.target.x + ((d.source.x < d.target.x) ? 0 : nodeWidth); })
        .attr("y2", function(d) { return d.target.y + d.targetStart / reducer; })
        .style("stroke", function(d) { return d.group == 1 ? col1: col2; })
        .style("stroke-opacity", function(d) { return d.group == 1 ? .6 : .3; })
        .style("stroke-width", function(d) { return d.length / reducer; });

};
