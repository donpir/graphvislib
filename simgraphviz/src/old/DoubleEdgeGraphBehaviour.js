function DoubleEdgeGraphBehaviour() {};//EndConstructor.

DoubleEdgeGraphBehaviour.prototype = (function () {

    var linkup = null;
    var linkdown = null;
    var markerup = null;
    var markerdown = null;
    var _radius = 20;

    var color = d3.scale.category20();

    var col1 = "red";
    var col2 = "orange";

    var  _proportion = function (subSegmentStart, subSegmentLength, segmentLength) {
        return (subSegmentStart * segmentLength) / subSegmentLength;
    };//EndFunction.

    var _placeMarker = function (marker) {
        var compute = function(d) {

            var source = GeomMathUtils.IntersectCircumferenceSegment(d.position.source.x, d.position.source.y, _radius, d.position.target.x, d.position.target.y);
            var target = GeomMathUtils.IntersectCircumferenceSegment(d.position.target.x, d.position.target.y, _radius, d.position.source.x, d.position.source.y);

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

    return {
        constructor: BasicBehaviour,

        init: function(svg, jsonGraph) {
            this._svg = svg;
            this._jsonGraph = jsonGraph;

            /*linkup = this._svg.selectAll(linkup)
                .data(this._jsonGraph.links.filter(function(d) { return (typeof d.type != 'undefined' && d.type == 'marker' && d.node == d.source.index); }))
                .enter().append("line")
                .attr("class", "linkup");*/

            var lnkShapes = this._svg.selectAll(".lnkShapes")
                .data(this._jsonGraph.links).enter();

            linkup = lnkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type == 'undefined'); })
                .attr("class", "linkup");

            linkdown = lnkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type == 'undefined'); })
                .attr("class", "linkdown");

            markerup = lnkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker' && d.node == d.source.index); })
                .attr("class", "linkMarkerUp");

            markerdown = lnkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker' && d.node == d.target.index); })
                .attr("class", "linkMarkerDown");

            /*marker = lnkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker' && d.node == d.source.index); })
                .attr("class", "linkMarker");*/
        },

        preUpdate: function() {

            var move = function(lnk, dist) {
                var lineEq = new LineEquation(lnk.source.x, lnk.source.y, lnk.target.x, lnk.target.y);
                lineEq.translatePerpendicularly(dist);
                lnk.position = lineEq.position;
            };

            linkup.each(function (lnk) { move(lnk, -2); })
                .attr("x1", function(d) { return d.position.source.x; })
                .attr("y1", function(d) { return d.position.source.y; })
                .attr("x2", function(d) { return d.position.target.x; })
                .attr("y2", function(d) { return d.position.target.y; });

            linkdown.each(function (lnk) { move(lnk, 2); })
                .attr("x1", function(d) { return d.position.source.x; })
                .attr("y1", function(d) { return d.position.source.y; })
                .attr("x2", function(d) { return d.position.target.x; })
                .attr("y2", function(d) { return d.position.target.y; });

            markerup.each(function (lnk) { move(lnk, -2); });
            markerdown.each(function (lnk) { move(lnk, 2); });
            _placeMarker(markerup);
            _placeMarker(markerdown);
        },

        update: function() {

        }
    }
})();