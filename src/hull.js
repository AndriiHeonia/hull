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

function _cos(o, a, b) {
    var aShifted = [a[0] - o[0], a[1] - o[1]],
        bShifted = [b[0] - o[0], b[1] - o[1]],
        aLen = _length([o, a]),
        bLen = _length([o, b]),
        dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];

    return dot / (aLen * bLen);
}

function _angle(o, a, b) {
    var aShifted = [a[0] - o[0], a[1] - o[1]],
        bShifted = [b[0] - o[0], b[1] - o[1]];

    var angleRad = Math.atan2(
        aShifted[0] * bShifted[1] - bShifted[0] * aShifted[1],
        aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1]
    );

    return Math.abs(angleRad);
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

function _intersect(edge, pointset) {
    var a = {
        'first': {
            x: edge[0][0],
            y: edge[0][1]
        },
        'second': {
            x: edge[1][0],
            y: edge[1][1]                
        }
    };

    // window.ctx1.clearRect (0, 0, 341, 238);
    // window.ctx1.beginPath();
    // window.ctx1.moveTo(a.first.x, a.first.y);
    // window.ctx1.lineTo(a.second.x, a.second.y);
    // window.ctx1.stroke();
    // window.ctx1.closePath();

    for (var i = 0; i < pointset.length - 1; i++) {
        var b = {
            'first': {
                x: pointset[i][0],
                y: pointset[i][1]
            },
            'second': {
                x: pointset[i + 1][0],
                y: pointset[i + 1][1]
            }
        };

        // window.ctx1.fillStyle="red";
        // window.ctx1.beginPath();
        // window.ctx1.arc(pointset[i][0], pointset[i][1], 2, 0, 2 * Math.PI, true);
        // window.ctx1.fill();
        // window.ctx1.closePath();

        // window.ctx1.fillStyle="red";
        // window.ctx1.beginPath();
        // window.ctx1.arc(pointset[i+1][0], pointset[i+1][1], 2, 0, 2 * Math.PI, true);
        // window.ctx1.fill();
        // window.ctx1.closePath();

        // window.ctx1.beginPath();
        // window.ctx1.moveTo(b.first.x, b.first.y);
        // window.ctx1.lineTo(b.second.x, b.second.y);
        // window.ctx1.stroke();
        // window.ctx1.closePath();

        if (edge[0][0] === pointset[i][0] && edge[0][1] === pointset[i][1] ||
            edge[0][0] === pointset[i + 1][0] && edge[0][1] === pointset[i + 1][1]) {
            continue;
        }

        if (segments.intersect(a, b)) {
            return true;
        }
    }

    return false;
}

function _midPointIdx(edge, innerPoints, convex) {
    var point1Idx = null, point2Idx = null,
        // angle1 = MAX_CONCAVE_ANGLE,
        // angle2 = MAX_CONCAVE_ANGLE,
        angle1Cos = MAX_CONCAVE_ANGLE_COS,
        angle2Cos = MAX_CONCAVE_ANGLE_COS,
        // a1, a2,
        a1Cos, a2Cos;

    for (var i = 0; i < innerPoints.length; i++) {
        if (innerPoints[i] === null) { continue; }

        // a1 = _angle(edge[0], edge[1], innerPoints[i]);
        // a2 = _angle(edge[1], edge[0], innerPoints[i]);

        a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
        a2Cos = _cos(edge[1], edge[0], innerPoints[i]);

       if (a1Cos > MAX_CONCAVE_ANGLE_COS && a2Cos > MAX_CONCAVE_ANGLE_COS) {
            if (a1Cos > angle1Cos && !_intersect([edge[0], innerPoints[i]], convex)) {
                angle1Cos = a1Cos;
                point1Idx = i;
            }
            if (a2Cos > angle2Cos && !_intersect([edge[1], innerPoints[i]], convex)) {
                angle2Cos = a2Cos;
                point2Idx = i;
            }
        }

        // if (a1 < MAX_CONCAVE_ANGLE && a2 < MAX_CONCAVE_ANGLE) {
        //     if (a1 < angle1 && !_intersect([edge[0], innerPoints[i]], convex)) {
        //         angle1 = a1;
        //         point1Idx = i;
        //     }
        //     if (a2 < angle2 && !_intersect([edge[1], innerPoints[i]], convex)) {
        //         angle2 = a2;
        //         point2Idx = i;
        //     }
        // }
    }


    return angle1Cos > angle2Cos ? point1Idx : point2Idx;
    // return angle1 > angle2 ? point1Idx : point2Idx;

    // concave (angle): 165.232ms
    // concave (angle cos): 180.135ms

    // if (point) {
    //     window.ctx1.fillStyle="red";
    //     window.ctx1.beginPath();
    //     window.ctx1.arc(point[0], point[1], 2, 0, 2 * Math.PI, true);
    //     window.ctx1.fill();
    //     window.ctx1.closePath();
    // }
}

// TODO
/**
  1. Оптимизировать:
    1.1. splice() complexity O(N), то есть, сложность вставки midPoint-ов сейчас O(N^2 + N^2).
         innerPoints надо вместо удаления просто маркать как удаленные (FIXED).
    1.2. ф-ю рассчета угла
    1.3. предрассчитать length для всех edges 1 раз
    1.4. можем ли как-то ограничить область пооиска midPoint-ов?
  2. Автоматически считать угол и дистанцию
 */

function _concave(convex, innerPoints) {
    var midPointIdx,
        midPointInserted = false;

    for (var i = 0; i < convex.length - 1; i++) {

        if (_length([convex[i], convex[i + 1]]) <= MAX_EDGE_LENGTH) { continue; }

        midPointIdx = _midPointIdx([convex[i], convex[i + 1]], innerPoints, convex);
        if (midPointIdx !== null) {
            convex.splice(i + 1, 0, innerPoints[midPointIdx]);
            innerPoints[midPointIdx] = null; // mark as deleted (it's faster than splice)
            midPointInserted = true;
        }
    }

    if (midPointInserted) {
        return _concave(convex, innerPoints);
    }

    return convex;
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

    console.time('convex');
    upper = _upperTangent(pointset);
    lower = _lowerTangent(pointset);
    convex = lower.concat(upper);
    console.timeEnd('convex');

    
    console.time('innerPoints');
    var innerPoints = pointset.filter(function(pt) {
        return convex.indexOf(pt) < 0;
    });
    console.timeEnd('innerPoints');

    console.time('concave');
    concave = _concave(convex, innerPoints);
    console.timeEnd('concave');

    return concave;
}

var MAX_CONCAVE_ANGLE = 70 / (180 / Math.PI);
var MAX_CONCAVE_ANGLE_COS = Math.cos(70 / (180 / Math.PI));
var MAX_EDGE_LENGTH = 10;