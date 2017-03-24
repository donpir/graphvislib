
function SingleEdgeGraphBehaviour() {

};//EndConstructor.

SingleEdgeGraphBehaviour.prototype = new BaseGraphBehaviour();

SingleEdgeGraphBehaviour.prototype.init = function (svg, jsonGraph, force) {
    BaseGraphBehaviour.prototype.init.call(this, svg, jsonGraph, force);

    this.marker = this.linkShapes
        .append("line")
        .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker'); })
        .attr("class", "linkMarker");

};

SingleEdgeGraphBehaviour.prototype.update = function() {
    BaseGraphBehaviour.prototype.update.call(this);
    var _this = this;

    var  _proportion = function (subSegmentStart, subSegmentLength, segmentLength) {
        return (subSegmentStart * segmentLength) / subSegmentLength;
    };//EndFunction.

    var _placeMarker = function (marker) {
        var compute = function(d) {

            var source = GeomMathUtils.IntersectCircumferenceSegment(d.source.x, d.source.y, d.source.radious, d.target.x, d.target.y);
            var target = GeomMathUtils.IntersectCircumferenceSegment(d.target.x, d.target.y, d.target.radious, d.source.x, d.source.y);
            //debugger;
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
            .attr("y2", function(d) { return d.position.target.y; });

    };//EndFunction.

    _placeMarker(this.marker);

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
