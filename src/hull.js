/*
 (c) 2014, Andrey Geonya
 Hull.js, a JavaScript library for concave hull generation by set of points.
 https://github.com/AndreyGeonya/hull

 Related papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
 http://allenchou.net/2013/07/cross-product-of-2d-vectors/
 http://users.livejournal.com/_winnie/237714.html
 http://habrahabr.ru/post/105882/
*/

/*
 TOTO:
- Adjust EDGE_LENGTH automatically (REJECTED)
- Try to make _bBoxAround smallest and increase it step by step to EDGE_LENGTH.
  It should helps us to use lesser innerPoints in _midPoint on hight density pointsets (DONE!)
- Check, fix and optimize intersection checking (DONE!)
- Update readme (DONE!)
- Create live examples on GitHub pages (DONE!)
- Fix problem in character example (DONE!)
- Compare performance with another concave hull implementations
- Update tests
- Push hull.js to npmjs.org
*/

/*
Optimization TODO:
- Replace RBush to simple grid and use only diff of bBoxes, not full bBox
*/

'use strict';

var rbush = require("rbush");
var intersect = require('./intersect.js');
var grid = require('./grid.js');

function _sortByX(pointset) {
    return pointset.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] - b[1];                           
        } else {                                                    
            return a[0] - b[0];                                                           
        }
    });
}

function _getMaxY(pointset) {
    var maxY = -Infinity;
    for (var i = pointset.length - 1; i >= 0; i--) {
        if (pointset[i][1] > maxY) {
            maxY = pointset[i][1];
        }
    }
    return maxY;
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

var getRangeStartTime = 0, getRangeTime = 0,
    getMidPointStartTime = 0, getMidPointTime = 0,
    convexSpliceStartTime = 0, convexSpliceTime = 0,
    removeGridPointStartTime = 0, removeGridPointTime = 0,
    midPointIfsStartTime = 0, midPointIfsTime = 0,
    getCosStartTime = 0, getCosTime = 0,
    intersectStartTime = 0, intersectTime = 0;

// var intersectCalls = 0;

function _intersect(segment, pointset) {
    // intersectCalls++;
    // intersectStartTime = new Date();
    for (var i = 0; i < pointset.length - 1; i++) {
        var seg = [pointset[i], pointset[i + 1]];
        if (segment[0][0] === seg[0][0] && segment[0][1] === seg[0][1] ||
            segment[0][0] === seg[1][0] && segment[0][1] === seg[1][1]) {
            continue;
        }

        if (intersect(segment, seg)) {
            // intersectTime += new Date() - intersectStartTime;
            return true;
        }
    }
    // intersectTime += new Date() - intersectStartTime;
    return false;
}

function _bBoxAround(edge, boxSize) {
    var minX, maxX, minY, maxY;

    if (edge[0][0] < edge[1][0]) {
        minX = edge[0][0] - boxSize;
        maxX = edge[1][0] + boxSize;
    } else {
        minX = edge[1][0] - boxSize;
        maxX = edge[0][0] + boxSize;
    }

    if (edge[0][1] < edge[1][1]) {
        minY = edge[0][1] - boxSize;
        maxY = edge[1][1] + boxSize;
    } else {
        minY = edge[1][1] - boxSize;
        maxY = edge[0][1] + boxSize;
    }

    return [
        minX, minY, // tl
        maxX, maxY  // br
    ];
}

// function _midPoint1(edge, innerPoints, convex) {
//     var a1Cos, a2Cos,
//         angle1Cos = MAX_CONCAVE_ANGLE_COS,
//         angle2Cos = MAX_CONCAVE_ANGLE_COS,
//         pointsWithCos = [];

//     innerPoints.forEach(function(pt) {
//         getCosStartTime = new Date();
//         a1Cos = _cos(edge[0], edge[1], pt);
//         a2Cos = _cos(edge[1], edge[0], pt);
//         getCosTime += new Date() - getCosStartTime;

//         if (a1Cos > angle1Cos && a2Cos > angle2Cos) {
//             pointsWithCos.push([pt, Math.max(a1Cos, a2Cos)]);
//             // angle1Cos = a1Cos;
//             // angle2Cos = a2Cos;
//         }
//     });

//     pointsWithCos.sort(function(p1, p2) {
//         return p1[1] - p2[1];
//     });

//     var p = pointsWithCos.pop();
//     while (p !== undefined) {
//         if (!_intersect([edge[0], p[0]], convex) &&
//             !_intersect([edge[1], p[0]], convex)) {
//             return p[0];
//         }
//         p = pointsWithCos.pop();
//     }
//     return null;
// }

function _midPoint(edge, innerPoints, convex) {
    var point = null,
        angle1Cos = MAX_CONCAVE_ANGLE_COS,
        angle2Cos = MAX_CONCAVE_ANGLE_COS,
        a1Cos, a2Cos;

    for (var i = 0; i < innerPoints.length; i++) {
        // getCosStartTime = new Date();
        a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
        a2Cos = _cos(edge[1], edge[0], innerPoints[i]);
        // getCosTime += new Date() - getCosStartTime;

        if (a1Cos > angle1Cos && a2Cos > angle2Cos &&
            !_intersect([edge[0], innerPoints[i]], convex) &&
            !_intersect([edge[1], innerPoints[i]], convex)) {

            angle1Cos = a1Cos;
            angle2Cos = a2Cos;
            point = innerPoints[i];
        }
    }

    return point;
}

function _concave(convex, innerPointsTree, maxSqEdgeLen, maxSearchBBoxSize, grid) {
    var edge,
        border,
        nPoints,
        bBoxSize,
        midPoint,
        sqEdgeLen,
        bBoxAround,
        
        midPointInserted = false;

    for (var i = 0; i < convex.length - 1; i++) {
        edge = [convex[i], convex[i + 1]];
        sqEdgeLen = _sqLength(edge[0], edge[1]);

        if (sqEdgeLen < maxSqEdgeLen) { continue; }

        bBoxSize = MIN_SEARCH_BBOX_SIZE;

        border = 0;
        bBoxAround = _bBoxAround(edge, bBoxSize);
        do {
            bBoxAround = grid.addBorder2Bbox(bBoxAround, border);
            bBoxSize = bBoxAround[2] - bBoxAround[0];

            // getRangeStartTime = new Date();
            nPoints = border > 0 ? grid.rangeBorderPoints(bBoxAround, 1) : grid.rangePoints(bBoxAround);
            // getRangeTime += new Date() - getRangeStartTime;
            
            // getMidPointStartTime = new Date();
            midPoint = _midPoint(edge, nPoints, convex);
            // getMidPointTime += new Date() - getMidPointStartTime;
            
            border++;
        }  while (midPoint === null && maxSearchBBoxSize > bBoxSize);
        if (midPoint !== null) {
            
            // convexSpliceStartTime = new Date();
            convex.splice(i + 1, 0, midPoint);
            // convexSpliceTime += new Date() - convexSpliceStartTime;

            // removeGridPointStartTime = new Date();
            grid.removePoint(midPoint);
            // removeGridPointTime += new Date() - removeGridPointStartTime;

            midPointInserted = true;
        }

        // do {
        //     bBoxAround = _bBoxAround(edge, bBoxSize);
        //     nPoints = innerPointsTree.search(bBoxAround);
        //     midPoint = _midPoint(edge, nPoints, convex);
        //     bBoxSize *= 2;
        // } while (midPoint === null && maxSearchBBoxSize > bBoxSize);
        // if (midPoint !== null) {
        //     convex.splice(i + 1, 0, midPoint);
        //     innerPointsTree.remove(midPoint);
        //     midPointInserted = true;
        // }
    }

    if (midPointInserted) {
        return _concave(convex, innerPointsTree, maxSqEdgeLen, maxSearchBBoxSize, grid);
    }

    return convex;
}

function hull(pointset, concavity) {
    var lower, upper, convex,
        innerPoints,
        innerPointsTree,
        maxSearchBBoxSize,
        concavity = concavity || 10;

    if (pointset.length < 3) {
        return pointset;
    }

    // console.log('Points count', pointset.length);

    // console.time('_sortByX');
    pointset = _sortByX(pointset);
    // console.timeEnd('_sortByX');
    // console.time('convex');
    upper = _upperTangent(pointset);
    lower = _lowerTangent(pointset);
    convex = lower.concat(upper);
    convex.push(pointset[0]);
    // console.timeEnd('convex');

    // console.time('innerPoints');
    maxSearchBBoxSize = Math.max(pointset[pointset.length - 1][0], _getMaxY(convex)) * MAX_SEARCH_BBOX_SIZE_PERCENT;
    innerPoints = pointset.filter(function(pt) {
        return convex.indexOf(pt) < 0;
    });
    // console.timeEnd('innerPoints');

    // console.time('build grid');
    var g = grid(innerPoints);
    // console.timeEnd('build grid');
 
    // console.time('build rbush');
    innerPointsTree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
    innerPointsTree.load(innerPoints);
    // console.timeEnd('build rbush');

    // console.time('_concave');
    var concave = _concave(convex, innerPointsTree, Math.pow(concavity, 2), maxSearchBBoxSize, g);
    // console.timeEnd('_concave');

    // console.log('   getRangeTime: ', getRangeTime);
    // console.log('   getMidPointTime: ', getMidPointTime);
    // console.log('       getCosTime', getCosTime);
    // console.log('       intersectTime', intersectTime);
    // console.log('       intersectCalls', intersectCalls);
    // console.log('   convexSpliceTime: ', convexSpliceTime);
    // console.log('   removeGridPointTime: ', removeGridPointTime);

    return concave;
}

var MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
var MIN_SEARCH_BBOX_SIZE = 5;
var MAX_SEARCH_BBOX_SIZE_PERCENT = 0.6;

module.exports = hull;