function BasicBehaviour() {};//EndConstructor.

BasicBehaviour.PlaceEdges = function(link) {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
};

BasicBehaviour.prototype = (function () {

    var lnkShapes = null;
    var link = null;
    var marker = null;
    var _radius = 20;

    var  _proportion = function (subSegmentStart, subSegmentLength, segmentLength) {
        return (subSegmentStart * segmentLength) / subSegmentLength;
    };//EndFunction.

    var _placeMarker = function (marker) {
        var compute = function(d) {

            var source = GeomMathUtils.IntersectCircumferenceSegment(d.source.x, d.source.y, _radius, d.target.x, d.target.y);
            var target = GeomMathUtils.IntersectCircumferenceSegment(d.target.x, d.target.y, _radius, d.source.x, d.source.y);

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

    return {
        constructor: BasicBehaviour,

        init: function(svg, jsonGraph) {
            this._svg = svg;
            this._jsonGraph = jsonGraph;

            lnkShapes = this._svg.selectAll(".lnkShapes")
                .data(this._jsonGraph.links).enter();

            link = lnkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type == 'undefined'); })
                .attr("class", "link");

            marker = lnkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker'); })
                .attr("class", "linkMarker");
        },

        preUpdate: function() {
            BasicBehaviour.PlaceEdges(link);
        },

        update: function() {
            _placeMarker(marker);
        }
    }
})();