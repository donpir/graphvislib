function GeomMathUtils() {
    console.log("constructor.");
}//EndConstructor.

GeomMathUtils.prototype = (function() {

    return {
        constructor: GeomMathUtils,

        intersectCircumferenceSegment: function(cx, cy, r, x1, y1) {
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
        },//EndFunction.

        coordinateOnSegAtDist: function (x0, y0, x1, y1, d) {
            var m = (y1 - y0) / (x1 - x0); var m2 = m * m;
            var d2 = d * d;
            var xd = Math.sqrt(d2 / (m2 + 1)) + x0;
            var yd = m * (xd - x0) + y0;
            return { x: xd, y: yd };
        }//EndFunction.

    }
})();