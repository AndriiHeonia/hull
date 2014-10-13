// http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/#tocAnchor-1-5

/**
 * Calculate the cross product of two points.
 * @param a first point
 * @param b second point
 * @return the value of the cross product
 */
function crossProduct(a, b) {
    return a[0] * b[1] - b[0] * a[1];
}

/**
 * Check if bounding boxes do intersect. If one bounding box
 * touches the other, they do intersect.
 * @param a first bounding box
 * @param b second bounding box
 * @return <code>true</code> if they intersect,
 *         <code>false</code> otherwise.
 */
function doBoundingBoxesIntersect(a, b) {
    return a[0][0] <= b[1][0] && a[1][0] >= b[0][0] && a[0][1] <= b[1][1]
            && a[1][1] >= b[0][1];
}

/**
 * Checks if a Point is on a line
 * @param a line (interpreted as line, although given as line
 *                segment)
 * @param b point
 * @return <code>true</code> if point is on line, otherwise
 *         <code>false</code>
 */
function isPointOnLine(a, b) {
    // Move the image, so that a[0] is on (0|0)
    var aTmp = [[0,0], [a[1][0] - a[0][0], a[1][1] - a[0][1]]];
    var bTmp = [b[0] - a[0][0], b[1] - a[0][1]];
    var r = crossProduct(aTmp[1], bTmp);
    return Math.abs(r) < EPSILON;
}

/**
 * Checks if a point is right of a line. If the point is on the
 * line, it is not right of the line.
 * @param a line segment interpreted as a line
 * @param b the point
 * @return <code>true</code> if the point is right of the line,
 *         <code>false</code> otherwise
 */
function isPointRightOfLine(a, b) {
    // Move the image, so that a[0] is on (0|0)
    var aTmp = [[0, 0], [a[1][0] - a[0][0], a[1][1] - a[0][1]]];
    var bTmp = [b[0] - a[0][0], b[1] - a[0][1]];
    return crossProduct(aTmp[1], bTmp) < 0;
}

/**
 * Check if line segment first touches or crosses the line that is
 * defined by line segment second.
 *
 * @param first line segment interpreted as line
 * @param second line segment
 * @return <code>true</code> if line segment first touches or
 *                           crosses line second,
 *         <code>false</code> otherwise.
 */
function lineSegmentTouchesOrCrossesLine(a, b) {
    return isPointOnLine(a, b[0])
            || isPointOnLine(a, b[1])
            || (isPointRightOfLine(a, b[0]) ^ isPointRightOfLine(a,
                    b[1]));
}

function getBoundingBox(a) {
    return [
        [
            Math.min(a[0][0], a[1][0]),
            Math.min(a[0][1], a[1][1])
        ],
        [
            Math.max(a[0][0], a[1][0]),
            Math.max(a[0][1], a[1][1])
        ]
    ];
}

/**
 * Check if line segments intersect
 * @param a first line segment
 * @param b second line segment
 * @return <code>true</code> if lines do intersect,
 *         <code>false</code> otherwise
 */
function doLinesIntersect(a, b) {
    var box1 = getBoundingBox(a);
    var box2 = getBoundingBox(b);
    return doBoundingBoxesIntersect(box1, box2)
            && lineSegmentTouchesOrCrossesLine(a, b)
            && lineSegmentTouchesOrCrossesLine(b, a);
}

var EPSILON = 0.000001;

module.exports = doLinesIntersect;