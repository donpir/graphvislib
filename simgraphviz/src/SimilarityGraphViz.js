function SimilarityGraphViz(behaviour) {
    var width = 720, height = 500; //default width and height.
    var _behaviour = behaviour;


    var _force = d3.layout.force().charge(-320).linkDistance(100).size([width, height]);

    var _svg = null;
    var _radius = 20;



    var _createNode = function(cx, cy, text) {
        var node = _svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", _radius)
                   .style("fill", "grey").style("stroke", "black");
        _svg.append("text").text(text).attr("font-size", "10px").attr("x", cx-_radius).attr("y", cy+_radius + 10);
        return node;
    };




    /**
     * Generate the visualization using 'width' and 'height'.
     */
    function build(jsonGraph) {
        _svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

        var color = d3.scale.category20();

        _force.nodes(jsonGraph.nodes)
            .links(jsonGraph.links)
            .start();

        _behaviour.init(_svg, jsonGraph);

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
            _behaviour.preUpdate();

            node.attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
                    return d.y;
                });

            title.attr("x", function(d) { return d.x - _radius; })
                 .attr("y", function(d) { return d.y - _radius; });


            _behaviour.update();
        });

        debugger;
        return build;
    }//EndFunction.

    build.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return build;
    };//EndFunction.

    build.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return build;
    };//EndFunction.

    build.behaviour = function(fnc) {
        if (!arguments.length) return _behaviour;
        _behaviour = fnc;
        return build;
    };//EndAccessor.

    build.svg = function () {
        return _svg;
    };

    return build;

}//EndVizLibrary.



