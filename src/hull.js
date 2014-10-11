/*
 (c) 2014, Andrey Geonya
 Hull.js, a JavaScript library for concave hull generation by set of points.
 https://github.com/AndreyGeonya/hull

 Related papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/
 http://allenchou.net/2013/07/cross-product-of-2d-vectors/
 http://users.livejournal.com/_winnie/237714.html
 http://habrahabr.ru/post/105882/
*/

'use strict';

var createKDTree = require("static-kdtree");

function _sortByX(pointset) {
    return pointset.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] - b[1];                           
        } else {                                                    
            return a[0] - b[0];                                                           
        }
    });
}

function _upperTangent(pointset) {
    var lower = [];
    for (var l = 0; l < pointset.length; l++) {
        while (lower.length >= 2 && (_cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0)) {
            lower.pop();
        }
        lower.push(pointset[l]);
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
    }
    upper.pop();
    return upper;
}

function _cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); 
}

function _sqLength(a, b) {
    return Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2);
}

function _cos(o, a, b) {
    var aShifted = [a[0] - o[0], a[1] - o[1]],
        bShifted = [b[0] - o[0], b[1] - o[1]],
        sqALen = _sqLength(o, a),
        sqBLen = _sqLength(o, b),
        dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];

    return dot / Math.sqrt(sqALen * sqBLen);
}

function _bBoxAround(edge) {
    var minX, maxX, minY, maxY;

    if (edge[0][0] < edge[1][0]) {
        minX = edge[0][0] - MAX_EDGE_LENGTH;
        maxX = edge[1][0] + MAX_EDGE_LENGTH;
    } else {
        minX = edge[1][0] - MAX_EDGE_LENGTH;
        maxX = edge[0][0] + MAX_EDGE_LENGTH;
    }

    if (edge[0][1] < edge[1][1]) {
        minY = edge[0][1] - MAX_EDGE_LENGTH;
        maxY = edge[1][1] + MAX_EDGE_LENGTH;
    } else {
        minY = edge[1][1] - MAX_EDGE_LENGTH;
        maxY = edge[0][1] + MAX_EDGE_LENGTH;
    }

    return [
        [minX, minY], // tl
        [maxX, maxY]  // br
    ];
}

function _insideBBox(point, bbox) {
    if (point[0] < bbox[0][0] ||
        point[0] > bbox[1][0] ||
        point[1] < bbox[0][1] ||
        point[1] > bbox[1][1]) { return false; }
    return true;
}

function _midPointIdx(edge, innerPointIdxs, innerPoints) {
    var point1Idx = null, point2Idx = null,
        angle1Cos = MAX_CONCAVE_ANGLE_COS,
        angle2Cos = MAX_CONCAVE_ANGLE_COS,
        a1Cos, a2Cos, idx;

    for (var i = 0; i < innerPointIdxs.length; i++) {
        idx = innerPointIdxs[i];
        if (innerPoints[idx] === null) { continue; }

        a1Cos = _cos(edge[0], edge[1], innerPoints[idx]);
        a2Cos = _cos(edge[1], edge[0], innerPoints[idx]);

        if (a1Cos > MAX_CONCAVE_ANGLE_COS && a2Cos > MAX_CONCAVE_ANGLE_COS) {            
            if (a1Cos > angle1Cos) {
                angle1Cos = a1Cos;
                point1Idx = idx;
            }
            if (a2Cos > angle2Cos) {
                angle2Cos = a2Cos;
                point2Idx = idx;
            }            
        }
    }

    return angle1Cos > angle2Cos ? point1Idx : point2Idx;
}

function _pointIdxsByRange(range, innerPointsTree) {
    var result = [];
    innerPointsTree.range(range[0], range[1], function(idx) {
        result.push(idx);
    });
    return result;
}

function _concave(convex, innerPointsTree, innerPoints) {
    var edge,
        nPointIdxs,
        midPointIdx,
        midPointInserted = false;

    for (var i = 0; i < convex.length - 1; i++) {
        if (_sqLength(convex[i], convex[i + 1]) <= MAX_SQ_EDGE_LENGTH) { continue; }

        edge = [convex[i], convex[i + 1]];
        nPointIdxs = _pointIdxsByRange(_bBoxAround(edge), innerPointsTree);
        midPointIdx = _midPointIdx(edge, nPointIdxs, innerPoints);
        
        if (midPointIdx !== null) {
            convex.splice(i + 1, 0, innerPoints[midPointIdx]);
            innerPoints[midPointIdx] = null;
            midPointInserted = true;
        }
    }

    if (midPointInserted) {
        return _concave(convex, innerPointsTree, innerPoints);
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

    console.time('sortByX');
    pointset = _sortByX(pointset);
    console.timeEnd('sortByX');

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

    console.time('createKDTree');
    var innerPointsTree = createKDTree(innerPoints);
    console.timeEnd('createKDTree');

    console.time('concave');
    concave = _concave(convex, innerPointsTree, innerPoints);
    console.timeEnd('concave');

    return concave;
}

var MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
var MAX_EDGE_LENGTH = 10;
var MAX_SQ_EDGE_LENGTH = Math.pow(MAX_EDGE_LENGTH, 2);

module.exports = hull;