/*
 Papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/
*/

function _sortByX(pointset) {
    return pointset.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] - b[1];                           
        } else {                                                    
            return a[0] - b[0];                                                           
        }                                                                                           
    });                                     
}

// see: http://allenchou.net/2013/07/cross-product-of-2d-vectors/
function _cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); 
}

function _angle(o, a, b) {
    var aShifted = [a[0] - o[0], a[1] - o[1]],
        bShifted = [b[0] - o[0], b[1] - o[1]];

    var angleRad = Math.acos((aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1]) /
        (Math.sqrt(aShifted[0] * aShifted[0] + aShifted[1] * aShifted[1]) *
         Math.sqrt(bShifted[0] * bShifted[0] + bShifted[1] * bShifted[1])));

    return angleRad * 180 / Math.PI;
}

function _upperTangent(pointset) {
    var lower = [];
    for (var l = 0; l < pointset.length; l++) {
        while (lower.length >= 2 && (_cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0)) {
            lower.pop();
        }
        lower.push(pointset[l]);

        // debugger;
        // window.ctx1.clearRect (0, 0, 341, 238);
        // window.ctx1.beginPath();
        // window.ctx1.moveTo(lower[0][0], lower[0][1]);
        // for (var i = 0; i < lower.length; i++) {
        //     window.ctx1.lineTo(lower[i][0], lower[i][1]);
        //     window.ctx1.moveTo(lower[i][0], lower[i][1]);
        // }
        // window.ctx1.stroke();
        // window.ctx1.closePath();
    }
    lower.pop();
    return lower;    
}

function _lowerTangent(pointset) {
    var reversed = pointset.reverse(),
        upper = [];
    for (var u = 0; u < reversed.length; u++) {
        while (upper.length >= 2 && (_cross(upper[upper.length - 2], upper[upper.length - 1], reversed[u]) <= 0)) {
            upper.pop();
        }
        upper.push(reversed[u]);

        // debugger;
        // window.ctx1.clearRect (0, 0, 341, 238);
        // window.ctx1.beginPath();
        // window.ctx1.moveTo(upper[0][0], upper[0][1]);
        // for (var i = 0; i < upper.length; i++) {
        //     window.ctx1.lineTo(upper[i][0], upper[i][1]);
        //     window.ctx1.moveTo(upper[i][0], upper[i][1]);
        // }
        // window.ctx1.stroke();
        // window.ctx1.closePath();
    }
    upper.pop();
    return upper;
}

function _length(edge) {
    return Math.sqrt(
        Math.pow(edge[1][0] - edge[0][0], 2) + Math.pow(edge[1][1] - edge[0][1], 2)
    );
}

function _sortByLength(edges) {
    return edges.sort(function(a, b) {
        return a.length - b.length;                                                           
    });
}

function _medium(edge, pointset, ignore) {
    var point1 = null, point2 = null,
        angle1 = 90, angle2 = 90,
        point = null;

    window.ctx.strokeStyle = "red";
    window.ctx.lineWidth = 1;
    window.ctx.beginPath();
    window.ctx.moveTo(edge[0][0], edge[0][1]);
    window.ctx.lineTo(edge[1][0], edge[1][1]);
    window.ctx.stroke();
    window.ctx.closePath();

    for (var i = 0; i < pointset.length; i++) {
        var a1 = _angle(edge[0], edge[1], pointset[i]),
            a2 = _angle(edge[1], edge[0], pointset[i]),
            ignoreKey;

        if (a1 < 90 && a2 < 90) {
            ignoreKey = pointset[i].join('-');
            if (a1 > 0 && a1 < angle1 && ignore[ignoreKey] !== true) {
                angle1 = a1;
                point1 = pointset[i];
            }
            if (a2 > 0 && a2 < angle2 && ignore[ignoreKey] !== true) {
                angle2 = a2;
                point2 = pointset[i];
            }
        }
    }

    point = angle1 > angle2 ? point1 : point2;

    if (point) {
        window.ctx1.fillStyle="red";
        window.ctx1.beginPath();
        window.ctx1.arc(point[0], point[1], 2, 0, 2 * Math.PI, true);
        window.ctx1.fill();
        window.ctx1.closePath();
    }

    return point;
}

function _concave(convex, pointset) {
    var concave = [],
        ignoreAsMedium = {};

    // var convexHullEdges = [];
    // for (var i = 0; i < convex.length - 1; i++) {
    //     var edge = [convex[i], convex[i + 1]];
    //     convexHullEdges.push({
    //         edge: edge,
    //         length: _length(edge)
    //     });
    // }
    // convexHullEdges = _sortByLength(convexHullEdges);

    for (var i = 0; i < convex.length; i++) {
        ignoreAsMedium[convex[i].join('-')] = true;
    }

    for (var i = 0; i < convex.length - 1; i++) {
        var mediumPoint = _medium([convex[i], convex[i + 1]], pointset, ignoreAsMedium);
        if (mediumPoint !== null) {
            ignoreAsMedium[mediumPoint.join('-')] = true;
            concave.push(convex[i], mediumPoint, convex[i + 1]);
        } else {
            concave.push(convex[i], convex[i + 1]);
        }
    }
    concave.push(convex[convex.length - 1]);

    return concave;
}

function hull(pointset) {
    var lower,
        upper,
        convex,
        concave;

    if (pointset.length <= 1) {
        return pointset;
    }

    pointset = _sortByX(pointset);
    upper = _upperTangent(pointset);
    lower = _lowerTangent(pointset);
    convex = lower.concat(upper);

    // window.ctx.strokeStyle = "blue";
    // window.ctx.lineWidth = 1;
    // window.ctx.beginPath();
    // convex.forEach(function(px) {
    //     window.ctx.lineTo(px[0], px[1]);
    //     window.ctx.moveTo(px[0], px[1]);
    // });
    // window.ctx.lineTo(convex[0][0], convex[0][1]);
    // window.ctx.stroke();
    // window.ctx.closePath();

    concave = _concave(convex, pointset);

    console.log(concave.length, convex.length);

    return concave;
}