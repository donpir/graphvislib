
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
        //.filter(function (d) { return (typeof d.type == 'marker' && d.ends.length > 0); })
        .attr("class", "link");

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

    this.link
        .attr("x1", function(d) { return d.source.x + ((d.source.x < d.target.x) ? nodeWidth : 0); })
        .attr("y1", function(d) { return d.source.y + d.sourceStart / reducer; })
        .attr("x2", function(d) { return d.target.x + ((d.source.x < d.target.x) ? 0 : nodeWidth); })
        .attr("y2", function(d) { return d.target.y + d.targetStart / reducer; })
        .style("stroke", function(d) { return d.group == 1 ? col1: col2; })
        .style("stroke-width", function(d) { return d.length / reducer; });

};
