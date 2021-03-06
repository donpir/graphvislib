function BaseGraphBehaviour() { };//EndConstructor.

BaseGraphBehaviour.PlaceEdges = function(link) {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
};

BaseGraphBehaviour.prototype = (function() {

    return {
        constructor: BaseGraphBehaviour,

        init: function(svg, jsonGraph, force) {
            this._svg = svg;
            this._jsonGraph = jsonGraph;
            this._force = force;
            //this._radious = 20;
            this.colour = d3.scale.category20();
            var _this = this;

            //LINKS.
            this.linkShapes = this._svg.selectAll(".lnkShapes")
                .data(this._jsonGraph.links).enter();

            this.link = this.linkShapes
                .append("line")
                .filter(function (d) { return (typeof d.type == 'undefined'); })
                .attr("class", "link");

            this.arrow = this.linkShapes
                .append("polygon")
                //.append("circle")
                .filter(function (d) { return (typeof d.type == 'undefined' && d.directed == true)})
                .attr("class", "arrow");

            //NODES.
            this.nodeShapes = this._svg.selectAll(".nodeShapes")
                .data(jsonGraph.nodes)
                .enter();

            this.node = this.nodeShapes.append("circle")
                .attr("class", "node")
                .style("fill", function(d) { return _this.colour(d.group); })
                .call(this._force.drag);

            this.title = this.nodeShapes.append("text")
                .attr("class", "nodeTitle")
                .text(function(d) { return d.name; });

        },//EndFunction.

        update: function() {
            //It places the nodes.
            var _this = this;
            this.node.attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
                return d.y;
            }).attr("r", function(d) {
                d.radious = d.length * 0.05;
                return d.radious;
            });

            //It places the nodes labels.
            this.title.attr("x", function(d) { return d.x - d.radious; })
                .attr("y", function(d) { return d.y - d.radious; });

            //It places the edges.
            BaseGraphBehaviour.PlaceEdges(this.link);
        }//EndFunction.
    }
})();
