function SimilarityGraphViz() {
    var width = 720, height = 500; //default width and height.

    var _force = d3.layout.force().charge(-320).linkDistance(100).size([width, height]);

    var _geomMath = new GeomMathUtils();
    var _svg = undefined;
    var _radius = 20;

    var _createNode = function(cx, cy, text) {
        var node = _svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", _radius)
                   .style("fill", "grey").style("stroke", "black");
        _svg.append("text").text(text).attr("font-size", "10px").attr("x", cx-_radius).attr("y", cy+_radius + 10);
        return node;
    };

    var  _proportion = function (subSegmentStart, subSegmentLength, segmentLength) {
        return (subSegmentStart * segmentLength) / subSegmentLength;
    };//EndFunction.

    var _placeEdge = function (link) {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
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
        }).attr("y1", function(d) {
            //var pts = compute(d);
            return d.position.source.y;
        }).attr("x2", function(d) {
            //var pts = compute(d);
            return d.position.target.x;
        }).attr("y2", function(d) {
            //var pts = compute(d);
            return d.position.target.y;
        });
    };//EndFunction.

    /**
     * Generate the visualization using 'width' and 'height'.
     */
    function build(jsonGraph) {
        _svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

        var color = d3.scale.category20();

        _force.nodes(jsonGraph.nodes)
            .links(jsonGraph.links)
            .start();


        //EDGES.
        var lnkShapes = _svg.selectAll(".lnkShapes")
            .data(jsonGraph.links).enter();

        var link = lnkShapes
            .append("line")
            .filter(function (d) { return (typeof d.type == 'undefined'); })
            .attr("class", "link");

        var marker = lnkShapes
            .append("line")
            .filter(function (d) { return (typeof d.type != 'undefined' && d.type == 'marker'); })
            .attr("class", "linkMarker");

        //NODES.
        var nodeShapes = _svg.selectAll(".nodeShapes")
            .data(jsonGraph.nodes)
            .enter();

        var node = nodeShapes.append("circle")
            .attr("class", "node")
            .attr("r", _radius)
            .style("fill", function(d) { return color(d.group); })
            .call(_force.drag);

        var title = nodeShapes.append("text")
            .attr("class", "nodeTitle")
            .text(function(d) { return d.name; });


        _force.on("tick", function() {
            _placeEdge(link);

            node.attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
                    return d.y;
                });

            title.attr("x", function(d) { return d.x - _radius; })
                 .attr("y", function(d) { return d.y - _radius; });


            _placeMarker(marker);
        });

        debugger;

    }//EndFunction.

    build.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return build;
    };//EndFunction.

    build.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return my;
    };//EndFunction.

    return build;

}//EndVizLibrary.