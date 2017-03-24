
var col1 = "red";
var col2 = "orange";

var  _proportion = function (subSegmentStart, subSegmentLength, segmentLength) {
    return (subSegmentStart * segmentLength) / subSegmentLength;
};//EndFunction.

var _placeMarker = function (marker, _radius) {
    var compute = function(d) {

        var source = GeomMathUtils.IntersectCircumferenceSegment(d.position.source.x, d.position.source.y, d.source.radious, d.position.target.x, d.position.target.y);
        var target = GeomMathUtils.IntersectCircumferenceSegment(d.position.target.x, d.position.target.y, d.target.radious, d.position.source.x, d.position.source.y);

        var lineEq = new LineEquation(source.x, source.y, target.x, target.y);
        var linkLength = LineEquation.CalculateSegmentLength(source.x, source.y, target.x, target.y);

        if (typeof d.source.length == 'undefined')
            throw "Unknown node segment length";

        var attributeLength = d.source.length > d.target.length ? d.source.length : d.target.length;

        var markerStartDist = _proportion(d.start, attributeLength, linkLength);
        var markerLength = _proportion(d.length, attributeLength, linkLength);

        var startPt = lineEq.pointAtDist(markerStartDist);
        var endPt = lineEq.pointAtDist(markerStartDist + markerLength);

        //debugger;
        d.position = { source: startPt, target: endPt };
        return d.position;
    };

    marker.attr("x1", function(d) {
        var pts = compute(d);
        return d.position.source.x;
    })  .attr("y1", function(d) { return d.position.source.y; })
        .attr("x2", function(d) { return d.position.target.x; })
        .attr("y2", function(d) { return d.position.target.y; })
        .style("stroke", function(d) { return d.group == 1 ? col1: col2; });
};//EndFunction.

function DoubleEdgeGraphBehaviour() {

};//EndConstructor.

DoubleEdgeGraphBehaviour.prototype = new BaseGraphBehaviour();

DoubleEdgeGraphBehaviour.prototype.init = function (svg, jsonGraph, force) {
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
        .filter(function (d) { return (typeof d.type == 'undefined'); })
        .attr("class", "link");

    this.linkup = this.linkShapes
        .append("line")
        .filter(function (d) { return (typeof d.type == 'undefined'); })
        .attr("class", "linkup");

    this.arrow = this.linkShapes
        .append("polygon")
        .filter(function (d) { return (typeof d.type == 'undefined' && d.directed == true)})
        .attr("class", "arrow");

    this.linkdown = this.linkShapes
        .append("line")
        .filter(function (d) { return (typeof d.type == 'undefined'); })
        .attr("class", "linkdown");

    this.markerup = this.linkShapes
        .append("line")
        .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker' && d.node == d.source.index); })
        .attr("class", "linkMarkerUp");

    this.markerdown = this.linkShapes
        .append("line")
        .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker' && d.node == d.target.index); })
        .attr("class", "linkMarkerDown");

    //NODES.
    this.nodeShapes = this._svg.selectAll(".nodeShapes")
        .data(jsonGraph.nodes)
        .enter();

    this.node = this.nodeShapes.append("circle")
        .attr("class", "node")
        .attr("r", function(d) {
            d.radious = d.length * 0.06;
            return d.radious;
        })
        .style("fill", function(d) { return _this.colour(d.group); })
        .call(this._force.drag);

    this.title = this.nodeShapes.append("text")
        .attr("class", "nodeTitle")
        .text(function(d) { return d.name; });

};

DoubleEdgeGraphBehaviour.prototype.update = function() {
    //It places the nodes.
    var _this = this;
    this.node.attr("cx", function (d) {
        return d.x;
    }).attr("cy", function (d) {
        return d.y;
    });

    //It places the nodes labels.
    this.title.attr("x", function(d) { return d.x - d.radious; })
        .attr("y", function(d) { return d.y - d.radious; });

    //It places the links.
    var move = function(lnk, dist) {
        var lineEq = new LineEquation(lnk.source.x, lnk.source.y, lnk.target.x, lnk.target.y);
        lineEq.translatePerpendicularly(dist);
        lnk.position = lineEq.position;
    };

    this.linkup.each(function (lnk) { move(lnk, -2); })
        .attr("x1", function(d) { return d.position.source.x; })
        .attr("y1", function(d) { return d.position.source.y; })
        .attr("x2", function(d) { return d.position.target.x; })
        .attr("y2", function(d) { return d.position.target.y; });

    this.linkdown.each(function (lnk) { move(lnk, 2); })
        .attr("x1", function(d) { return d.position.source.x; })
        .attr("y1", function(d) { return d.position.source.y; })
        .attr("x2", function(d) { return d.position.target.x; })
        .attr("y2", function(d) { return d.position.target.y; });

    this.markerup.each(function (lnk) { move(lnk, -2); });
    this.markerdown.each(function (lnk) { move(lnk, 2); });
    _placeMarker(this.markerup, this._radious);
    _placeMarker(this.markerdown, this._radious);


    this.arrow.attr("points", function(d) {
        var coord = [];

        var lq = new LineEquation(d.target.x, d.target.y, d.source.x, d.source.y);

        //Triangle vertex.
        //var target = GeomMathUtils.IntersectCircumferenceSegment(d.target.x, d.target.y, d.target.radious, d.source.x, d.source.y);
        //coord.push([target.x, target.y].join(","));

        var segmentLength = lq.calculateLength();
        var target = lq.pointAtDist(d.target.radious);
        coord.push([target.x, target.y].join(","));

        var pt = lq.pointAtDist(5 + d.target.radious);

        lq.perpendicularLineIn(pt.x, pt.y);
        var vx1 = lq.pointAtDist(5);
        var vx2 = lq.pointAtDist(-5);
        coord.push([vx1.x, vx1.y].join(","));
        coord.push([vx2.x, vx2.y].join(","));

        return coord.join(" ");
    });

};
