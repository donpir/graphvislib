function LineEquation(x0, y0, x1, y1) {
    this.m = (y1-y0) / (x1 - x0);
    this.pt0 = { x: x0, y: y0 };
    this.b = - this.m * x0 + y0; //y = mx + b;
}//EndConstructor.

LineEquation.CalculateSegmentLength = function (x1, y1, x2, y2) {
    var a = x2 - x1;
    var b = y2 - y1;
    var c = Math.sqrt(a*a + b*b);
    return c;
};//EndFunction.

LineEquation.prototype = (function() {

    /*var m = 0;
    var pt0 = null;
    var b = 0;//y = mx + b;*/

    return {
        constructor: LineEquation,

        /*init: function (x0, y0, x1, y1) {
            this.m = (y1-y0) / (x1 - x0);
            this.pt0 = { x: x0, y: y0 };
            this.b = - m * x0 + y0;

            return this;
        },//EndFunction.*/



        point0: function () { return this.pt0; },
        computeY: function (X) {
            return this.m * X + this.b;
        },

        pointAtDist: function (dist) {
            if (!isFinite(this.m))
                return { x: this.pt0.x, y: this.pt0.y + dist };

            var m2 = this.m * this.m;
            var d2 = dist * dist;
            var xd = Math.sqrt(d2 / (m2 + 1)) + this.pt0.x;
            var yd = this.m * (xd - this.pt0.x) + this.pt0.y;

            return { x: xd, y: yd };
        },

        check: function (x, y) {
            var div = this.computeY(x);
            return isFinite(div) ? div == y : true;
        },//EndFunction.

        rotate90Degree: function(pivotX, pivotY) {
            if (typeof pivotX == 'undefined')
                pivotX = this.pt0.x, pivotY = this.pt0.y;

            //Check weather the point is on the line.
            var isValidPoint = this.check(pivotX, pivotY);
            if (isValidPoint == false)
                throw "Not valid pivot number";

            if (isFinite(this.m)) this.m = 1 / this.m;
            else this.m = 0;

            return this;
        },//EndFunction.

        translatePerpendicularly: function (dist) {
            this.rotate90Degree();
            this.pt0 = this.pointAtDist(dist);
            this.rotate90Degree();
            return this;
        }//EndFunction.
    }
})();

function GeomMathUtils() {
    console.log("constructor.");
}//EndConstructor.

GeomMathUtils.IntersectCircumferenceSegment = function(cx, cy, r, x1, y1) {
    var m = (y1 - cy) / (x1 - cx);
    var k = -m * x1 + y1 - cy;
    var a = m * m + 1;
    var b = -2 * cx + 2 * m * k;
    var c = cx * cx + k * k - r * r;
    var delta = b * b - 4 * a * c;
    if (delta < 0) throw "Delta cannot be less then zero";

    var xVal1 = (-b + Math.sqrt(delta)) / (2 * a);
    var xVal2 = (-b - Math.sqrt(delta)) / (2 * a);

    var yVal1 = m * (xVal1 - x1) + y1;
    var yVal2 = m * (xVal2 - x1) + y1;

    if (x1 >= cx)
        return { x: xVal1, y: yVal1 };
    return { x: xVal2, y: yVal2 };
};//EndFunction.

GeomMathUtils.prototype = (function() {

    return {
        constructor: GeomMathUtils,

        /*intersectCircumferenceSegment: function(cx, cy, r, x1, y1) {
            var m = (y1 - cy) / (x1 - cx);
            var k = -m * x1 + y1 - cy;
            var a = m * m + 1;
            var b = -2 * cx + 2 * m * k;
            var c = cx * cx + k * k - r * r;
            var delta = b * b - 4 * a * c;
            if (delta < 0) throw "Delta cannot be less then zero";

            var xVal1 = (-b + Math.sqrt(delta)) / (2 * a);
            var xVal2 = (-b - Math.sqrt(delta)) / (2 * a);

            var yVal1 = m * (xVal1 - x1) + y1;
            var yVal2 = m * (xVal2 - x1) + y1;

            if (x1 >= cx)
                return { x: xVal1, y: yVal1 };
            return { x: xVal2, y: yVal2 };
        },//EndFunction.

        calculateSegmentLength: function (x1, y1, x2, y2) {
            var a = x2 - x1;
            var b = y2 - y1;
            var c = Math.sqrt(a*a + b*b);
            return c;
        },//EndFunction.*/

        coordinateOnSegAtDist: function (x0, y0, x1, y1, d) {
            var m = (y1 - y0) / (x1 - x0); var m2 = m * m;
            var d2 = d * d;
            var xd = Math.sqrt(d2 / (m2 + 1)) + x0;
            var yd = m * (xd - x0) + y0;
            return { x: xd, y: yd };
        }//EndFunction.

    }
})();